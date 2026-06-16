-- Extend existing tables with x402 and ERC-8004 fields

-- Add x402/ERC-8004 fields to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agent_id TEXT UNIQUE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS owner_address TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS trust_score DECIMAL(3,2) DEFAULT 4.5;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS reputation_level INTEGER DEFAULT 1;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS verification_date TIMESTAMPTZ;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add x402 fields to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS x402_transaction_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS escrow_address TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_wallet TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payee_wallet TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS authorization_hash TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS release_signature TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_hash TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2);

-- Update payment status check constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE payments ADD CONSTRAINT payments_status_check 
  CHECK (status = ANY (ARRAY['pending'::text, 'authorized'::text, 'processing'::text, 'released'::text, 'completed'::text, 'failed'::text, 'refunded'::text, 'cancelled'::text]));

-- Add wallet fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12,2) DEFAULT 0;

-- Add x402 fields to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS required_capabilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS result_url TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS result_metadata JSONB DEFAULT '{}'::jsonb;

-- Update task status check constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check
  CHECK (status = ANY (ARRAY['draft'::text, 'open'::text, 'funded'::text, 'x402_authorized'::text, 'assigned'::text, 'in_progress'::text, 'submitted'::text, 'approved'::text, 'completed'::text, 'cancelled'::text]));

-- Create trust_events table
CREATE TABLE IF NOT EXISTS trust_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  score_change DECIMAL(3,2) NOT NULL,
  score_before DECIMAL(3,2),
  score_after DECIMAL(3,2),
  reference_type TEXT,
  reference_id UUID,
  evidence JSONB DEFAULT '{}'::jsonb,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_receipts table
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  receipt_number TEXT UNIQUE NOT NULL,
  transaction_hash TEXT,
  block_number BIGINT,
  gross_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed',
  metadata JSONB DEFAULT '{}'::jsonb,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_wallet_address ON agents(wallet_address);
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_trust_score ON agents(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_payments_x402 ON payments(x402_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_escrow ON payments(escrow_address);
CREATE INDEX IF NOT EXISTS idx_trust_events_agent ON trust_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet_address);

-- Enable RLS on new tables
ALTER TABLE trust_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "trust_events_select_all" ON trust_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "payment_receipts_select_own" ON payment_receipts FOR SELECT TO authenticated 
  USING (payment_id IN (SELECT id FROM payments WHERE auth.uid() = business_id));

-- Update existing profile with wallet data
UPDATE profiles SET
  wallet_address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  wallet_type = 'metamask',
  wallet_balance = 245.00
WHERE id IN (SELECT id FROM profiles LIMIT 1);

-- Insert demo agents with ERC-8004 compliant data
INSERT INTO agents (
  id, agent_id, wallet_address, owner_address, name, description, 
  capabilities, specialties, trust_score, reputation_level, 
  total_tasks_completed, success_rate, hourly_rate, is_verified, rating
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'NL-AGENT-001', '0xa1B2c3D4e5F6789012345678901234567890aBCD', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'Webie AI', 
   'Expert web development AI specializing in React, Next.js, and modern frameworks.', 
   '[{"name":"React","type":"skill","proficiency_level":5},{"name":"Next.js","type":"skill","proficiency_level":5},{"name":"TypeScript","type":"skill","proficiency_level":5}]', 
   '{React,Next.js,TypeScript,Node.js,CSS}', 4.90, 5, 156, 98.00, 25.00, true, 4.9),
  ('22222222-2222-2222-2222-222222222222', 'NL-AGENT-002', '0xb2C3d4E5f678901234567890123456789012BcDe', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'DesignBot', 
   'Creative AI agent for UI/UX design and Figma workflows.', 
   '[{"name":"UI Design","type":"skill","proficiency_level":5},{"name":"Figma","type":"tool","proficiency_level":5},{"name":"Prototyping","type":"skill","proficiency_level":4}]', 
   '{UI Design,UX Research,Figma,Prototyping}', 4.80, 4, 134, 97.00, 22.00, true, 4.8),
  ('33333333-3333-3333-3333-333333333333', 'NL-AGENT-003', '0xc3D4e5F67890123456789012345678901234CdEf', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'ContentGPT', 
   'Content creation specialist for blog posts and SEO-optimized copy.', 
   '[{"name":"Content Writing","type":"skill","proficiency_level":5},{"name":"SEO","type":"skill","proficiency_level":5},{"name":"Copywriting","type":"skill","proficiency_level":5}]', 
   '{Blog Posts,SEO Writing,Copywriting,Technical Writing}', 4.90, 5, 189, 99.00, 18.00, true, 4.9),
  ('44444444-4444-4444-4444-444444444444', 'NL-AGENT-004', '0xd4E5f678901234567890123456789012345DeF0', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'DataMind', 
   'Data analysis expert for Python, SQL, and visualization.', 
   '[{"name":"Python","type":"skill","proficiency_level":5},{"name":"SQL","type":"skill","proficiency_level":5},{"name":"Data Visualization","type":"skill","proficiency_level":4}]', 
   '{Python,SQL,Data Visualization,Statistics}', 4.70, 4, 98, 96.00, 28.00, true, 4.7),
  ('55555555-5555-5555-5555-555555555555', 'NL-AGENT-005', '0xe5F67890123456789012345678901234567Ef01', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'SalesAgent', 
   'AI-powered lead generation and sales automation.', 
   '[{"name":"Lead Research","type":"skill","proficiency_level":5},{"name":"CRM","type":"tool","proficiency_level":5},{"name":"Outreach","type":"skill","proficiency_level":4}]', 
   '{Lead Research,Email Outreach,CRM Management}', 4.60, 3, 112, 94.00, 24.00, true, 4.6),
  ('66666666-6666-6666-6666-666666666666', 'NL-AGENT-006', '0xf6789012345678901234567890123456789F012', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'AutoFlow AI', 
   'Workflow automation specialist using Zapier and Make.', 
   '[{"name":"Zapier","type":"tool","proficiency_level":5},{"name":"API Integration","type":"skill","proficiency_level":5},{"name":"Automation","type":"skill","proficiency_level":5}]', 
   '{Zapier,Make.com,API Integration,Webhooks}', 4.80, 4, 87, 97.00, 30.00, true, 4.8)
ON CONFLICT (id) DO UPDATE SET
  agent_id = EXCLUDED.agent_id,
  wallet_address = EXCLUDED.wallet_address,
  owner_address = EXCLUDED.owner_address,
  capabilities = EXCLUDED.capabilities,
  trust_score = EXCLUDED.trust_score,
  reputation_level = EXCLUDED.reputation_level,
  total_tasks_completed = EXCLUDED.total_tasks_completed,
  success_rate = EXCLUDED.success_rate;

-- Insert sample trust events
INSERT INTO trust_events (agent_id, event_type, score_change, score_before, score_after, reference_type, verified, created_at)
SELECT id, 'task_completed', 0.05, 4.85, 4.90, 'task', true, NOW() - INTERVAL '1 day'
FROM agents WHERE agent_id = 'NL-AGENT-003'
ON CONFLICT DO NOTHING;
