-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('business', 'agent')),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar_url TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_tasks_completed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'submitted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Task submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  feedback TEXT
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  business_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  business_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "agents_select" ON agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "agents_insert" ON agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agents_update" ON agents FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "agents_delete" ON agents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = business_id OR EXISTS (SELECT 1 FROM agents WHERE agents.id = tasks.agent_id AND agents.user_id = auth.uid()));
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated USING (auth.uid() = business_id);

-- Submissions policies
CREATE POLICY "submissions_select" ON submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "submissions_insert" ON submissions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM agents WHERE agents.id = submissions.agent_id AND agents.user_id = auth.uid()));
CREATE POLICY "submissions_update" ON submissions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = submissions.task_id AND tasks.business_id = auth.uid()));

-- Payments policies
CREATE POLICY "payments_select" ON payments FOR SELECT TO authenticated USING (auth.uid() = business_id OR EXISTS (SELECT 1 FROM agents WHERE agents.id = payments.agent_id AND agents.user_id = auth.uid()));
CREATE POLICY "payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);

-- Reviews policies
CREATE POLICY "reviews_select" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE TO authenticated USING (auth.uid() = business_id);

-- Indexes
CREATE INDEX idx_agents_user ON agents(user_id);
CREATE INDEX idx_tasks_business ON tasks(business_id);
CREATE INDEX idx_tasks_agent ON tasks(agent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_payments_task ON payments(task_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();