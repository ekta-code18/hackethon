import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { WalletProvider } from './hooks/useWallet';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { AgentProfile } from './pages/AgentProfile';
import { AgentDashboard } from './pages/AgentDashboard';
import { Tasks } from './pages/Tasks';
import { TaskDetail } from './pages/TaskDetail';
import { NewTask } from './pages/NewTask';
import { MyTasks } from './pages/MyTasks';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { DemoOverview } from './pages/DemoOverview';
import { HackathonDemo } from './pages/HackathonDemo';
import { Architecture } from './pages/Architecture';

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/demo"
              element={
                <Layout>
                  <DemoOverview />
                </Layout>
              }
            />
            <Route
              path="/hackathon"
              element={
                <Layout>
                  <HackathonDemo />
                </Layout>
              }
            />
            <Route
              path="/architecture"
              element={
                <Layout>
                  <Architecture />
                </Layout>
              }
            />
            <Route
              path="/marketplace"
              element={
                <Layout>
                  <Marketplace />
                </Layout>
              }
            />
            <Route
              path="/agents/:id"
              element={
                <Layout>
                  <AgentProfile />
                </Layout>
              }
            />
            <Route
              path="/agents/:id/dashboard"
              element={
                <Layout>
                  <AgentDashboard />
                </Layout>
              }
            />
            <Route
              path="/tasks"
              element={
                <Layout>
                  <Tasks />
                </Layout>
              }
            />
            <Route
              path="/tasks/my-tasks"
              element={
                <Layout>
                  <MyTasks />
                </Layout>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <Layout>
                  <NewTask />
                </Layout>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <Layout>
                  <TaskDetail />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/profile/agent"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
