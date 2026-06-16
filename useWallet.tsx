import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';

export type WalletType = 'metamask' | 'coinbase' | 'walletconnect';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  walletType: WalletType | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  getBalance: () => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Demo wallet for hackathon - simulates MetaMask/Web3 behavior
const DEMO_WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const DEMO_CHAIN_ID = 8453; // Base mainnet
const DEMO_BALANCE = '245.00 ETH';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    walletType: null,
    balance: '0',
    isConnecting: false,
    error: null,
  });

  // Auto-connect in demo mode
  useEffect(() => {
    const storedWallet = localStorage.getItem('neurolance-demo-wallet');
    if (storedWallet) {
      setWallet({
        address: DEMO_WALLET_ADDRESS,
        isConnected: true,
        chainId: DEMO_CHAIN_ID,
        walletType: 'metamask' as WalletType,
        balance: DEMO_BALANCE,
        isConnecting: false,
        error: null,
      });
    }
  }, []);

  const connect = useCallback(async (walletType: WalletType) => {
    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In demo mode, always connect with demo wallet
    const walletState: WalletState = {
      address: DEMO_WALLET_ADDRESS,
      isConnected: true,
      chainId: DEMO_CHAIN_ID,
      walletType,
      balance: DEMO_BALANCE,
      isConnecting: false,
      error: null,
    };

    setWallet(walletState);
    localStorage.setItem('neurolance-demo-wallet', 'connected');
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      walletType: null,
      balance: '0',
      isConnecting: false,
      error: null,
    });
    localStorage.removeItem('neurolance-demo-wallet');
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    // Simulate chain switch
    await new Promise(resolve => setTimeout(resolve, 500));
    setWallet(prev => ({ ...prev, chainId }));
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    // Simulate message signing for x402 authorization
    await new Promise(resolve => setTimeout(resolve, 300));
    const signature = `0x${Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    return signature;
  }, []);

  const getBalance = useCallback(async (): Promise<string> => {
    // In demo mode, just return the stored balance
    return DEMO_BALANCE;
  }, []);

  return (
    <WalletContext.Provider value={{
      ...wallet,
      connect,
      disconnect,
      switchChain,
      signMessage,
      getBalance,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Format wallet address for display
export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get chain name by ID
export function getChainName(chainId: number | null): string {
  const chains: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    137: 'Polygon',
    10: 'Optimism',
    42161: 'Arbitrum',
  43114: 'Avalanche',
  56: 'BSC',
    42220: 'Celo',
  7777777: 'Zora',
  11155111: 'Sepolia',
    84532: 'Base Sepolia',
  137: 'Polygon',
  80001: 'Polygon Mumbai',
  100: 'Gnosis',
  324: 'zkSync Era',
    59144: 'Linea',
  1101: 'Polygon zkEVM',
    5000: 'Mantle',
  5001: 'Mantle Testnet',
  250: 'Fantom',
    42262: 'Oasis Sapphire',
    44787: 'Celo Alfajores',
    11155420: 'Optimism Sepolia',
    2442: 'Polygon zkEVM Cardona',
    397: 'Near',
    1088: 'Metis',
    2222: 'Kava',
    22222: 'Nahmii',
  10200: 'Chiado',
    1284: 'Moonbeam',
    5611: 'Bobabeam',
    42170: 'Arbitrum Nova',
    421613: 'Arbitrum Sepolia',
    421614: 'Arbitrum Sepolia',
    195: 'Tri',
    196: 'Tri',
    197: 'Tri',
    198: 'Tri',
  };
  return chains[chainId || 0] || `Chain ${chainId}`;
}
