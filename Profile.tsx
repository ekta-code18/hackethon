import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Agent } from '../types';
import { formatCurrency, AGENT_SPECIALTIES } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui';
import { Avatar } from '../components/ui/Avatar';
import { LoadingState } from '../components/ui/Skeleton';
import {
  User,
  Bot,
  Save,
  ArrowLeft,
  Star,
  DollarSign,
  CheckCircle,
  X,
  Plus,
} from 'lucide-react';

export function Profile() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentSpecialties, setAgentSpecialties] = useState<string[]>([]);
  const [agentHourlyRate, setAgentHourlyRate] = useState('');
  const [agentActive, setAgentActive] = useState(true);

  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
      loadAgent();
    }
  }, [user]);

  async function loadAgent() {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setAgent(data as Agent);
      setAgentName(data.name);
      setAgentDescription(data.description);
      setAgentSpecialties(data.specialties);
      setAgentHourlyRate(data.hourly_rate.toString());
      setAgentActive(data.is_active);
    }
    setLoading(false);
  }

  async function handleSaveProfile() {
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, avatar_url: avatarUrl || null })
      .eq('id', user?.id);

    if (!error) {
      refreshProfile();
    }
    setSaving(false);
  }

  async function handleSaveAgent() {
    setSaving(true);

    const agentData = {
      user_id: user?.id,
      name: agentName,
      description: agentDescription,
      specialties: agentSpecialties,
      hourly_rate: parseFloat(agentHourlyRate) || 50,
      is_active: agentActive,
    };

    let error;
    if (agent) {
      ({ error } = await supabase
        .from('agents')
        .update(agentData)
        .eq('id', agent.id));
    } else {
      ({ error } = await supabase
        .from('agents')
        .insert(agentData));
    }

    if (!error) {
      loadAgent();
    }
    setSaving(false);
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Sign in to view your profile</h2>
          <p className="text-secondary-600">Create an account to set up your profile.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading profile..." />
      </Layout>
    );
  }

  const isAgent = user.user_type === 'agent';

  return (
    <Layout>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-8">Profile Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Details
            </h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={fullName || user.email} size="xl" />
              <div className="flex-1">
                <Input
                  placeholder="Avatar URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  helper="Enter a URL for your avatar image"
                />
              </div>
            </div>

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={3}
            />

            <Input
              label="Email"
              value={user.email}
              disabled
              helper="Contact support to change your email"
            />

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} loading={saving} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Agent Profile */}
        {isAgent && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Agent Profile
              </h2>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <Input
                label="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g., CodeMaster-AI"
                helper="This is how clients will see you in the marketplace"
              />

              <Textarea
                label="Description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe your capabilities, experience, and what makes you the best choice for tasks..."
                rows={4}
              />

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {agentSpecialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm cursor-pointer hover:bg-primary-100"
                      onClick={() => setAgentSpecialties(agentSpecialties.filter((x) => x !== s))}
                    >
                      {s}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                  <button
                    onClick={() => setShowSpecialtyPicker(!showSpecialtyPicker)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-sm hover:bg-secondary-200"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                {showSpecialtyPicker && (
                  <div className="p-3 bg-secondary-50 rounded-lg space-y-2">
                    {AGENT_SPECIALTIES.filter((s) => !agentSpecialties.includes(s)).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setAgentSpecialties([...agentSpecialties, s]);
                          setShowSpecialtyPicker(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-white rounded-lg transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Hourly Rate (USD)"
                    type="number"
                    value={agentHourlyRate}
                    onChange={(e) => setAgentHourlyRate(e.target.value)}
                    placeholder="e.g., 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAgentActive(true)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        agentActive
                          ? 'bg-accent-100 text-accent-700 border-2 border-accent-500'
                          : 'bg-secondary-100 text-secondary-700 border-2 border-transparent'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setAgentActive(false)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        !agentActive
                          ? 'bg-secondary-200 text-secondary-700 border-2 border-secondary-400'
                          : 'bg-secondary-100 text-secondary-700 border-2 border-transparent'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              {agent && (
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Star className="w-5 h-5 text-warning-500 mx-auto mb-1" />
                      <p className="font-semibold text-secondary-900">{agent.rating.toFixed(1)}</p>
                      <p className="text-xs text-secondary-500">Rating</p>
                    </div>
                    <div>
                      <CheckCircle className="w-5 h-5 text-accent-500 mx-auto mb-1" />
                      <p className="font-semibold text-secondary-900">{agent.total_tasks_completed}</p>
                      <p className="text-xs text-secondary-500">Tasks</p>
                    </div>
                    <div>
                      <DollarSign className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                      <p className="font-semibold text-secondary-900">{formatCurrency(agent.hourly_rate)}</p>
                      <p className="text-xs text-secondary-500">Rate</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveAgent} loading={saving} icon={<Save className="w-4 h-4" />}>
                  {agent ? 'Update Agent' : 'Create Agent Profile'}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
}
