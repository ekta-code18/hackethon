import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from './ui/Card';
import {
  Search,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Brain,
  FileText,
  Shield,
} from 'lucide-react';

export type AgentStep = 'idle' | 'research' | 'writing' | 'reviewing' | 'completed';

interface AgentStatus {
  name: string;
  role: string;
  status: 'pending' | 'active' | 'completed';
  output?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface MultiAgentWorkflowProps {
  isActive: boolean;
  currentStep: AgentStep;
  onStepChange?: (step: AgentStep) => void;
  onWorkflowComplete?: (result: string) => void;
  taskTitle?: string;
  taskDescription?: string;
}

export function MultiAgentWorkflow({
  isActive,
  currentStep,
  onStepChange,
  onWorkflowComplete,
  taskTitle,
  taskDescription,
}: MultiAgentWorkflowProps) {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      name: 'Research Agent',
      role: 'Information Gathering',
      status: 'pending',
      icon: <Search className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Writer Agent',
      role: 'Content Creation',
      status: 'pending',
      icon: <PenTool className="w-5 h-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
    },
    {
      name: 'Reviewer Agent',
      role: 'Quality Assurance',
      status: 'pending',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
    },
  ]);

  const [researchProgress, setResearchProgress] = useState(0);
  const [writingProgress, setWritingProgress] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [agentOutputs, setAgentOutputs] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (!isActive) return;

    // Reset progress when workflow starts
    if (currentStep === 'research') {
      setAgents(prev => prev.map((a, i) => ({
        ...a,
        status: i === 0 ? 'active' : 'pending',
      })));
      setResearchProgress(0);
      setWritingProgress(0);
      setReviewProgress(0);
      setAgentOutputs(['', '', '']);
    }

    // Research phase
    if (currentStep === 'research') {
      const interval = setInterval(() => {
        setResearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setAgents(prev => prev.map((a, i) => ({
              ...a,
              status: i === 0 ? 'completed' : i === 1 ? 'active' : 'pending',
            })));
            setAgentOutputs(['Research complete: gathered relevant information, identified key concepts, and analyzed context.']);
            onStepChange?.('writing');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }

    // Writing phase
    if (currentStep === 'writing') {
      setAgents(prev => prev.map((a, i) => ({
        ...a,
        status: i === 0 ? 'completed' : i === 1 ? 'active' : 'pending',
      })));

      const interval = setInterval(() => {
        setWritingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setAgents(prev => prev.map((a, i) => ({
              ...a,
              status: i <= 1 ? 'completed' : i === 2 ? 'active' : 'pending',
            })));
            setAgentOutputs(prev => [...prev.slice(0, 1), 'Content generated: structured response with clear sections and comprehensive coverage.', prev[2]]);
            onStepChange?.('reviewing');
            return 100;
          }
          return prev + 4;
        });
      }, 80);
      return () => clearInterval(interval);
    }

    // Reviewing phase
    if (currentStep === 'reviewing') {
      setAgents(prev => prev.map((a, i) => ({
        ...a,
        status: i <= 1 ? 'completed' : 'active',
      })));

      const interval = setInterval(() => {
        setReviewProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setAgents(prev => prev.map(a => ({ ...a, status: 'completed' })));
            setAgentOutputs(prev => [...prev.slice(0, 2), 'Quality check passed: improved clarity, enhanced readability, and verified accuracy.']);
            onStepChange?.('completed');
            onWorkflowComplete?.('Multi-agent collaboration completed successfully!');
            return 100;
          }
          return prev + 3;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [isActive, currentStep, onStepChange, onWorkflowComplete]);

  if (!isActive && currentStep === 'idle') return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-accent-50 border-b border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900">Multi-Agent Collaboration</h3>
            <p className="text-sm text-secondary-500">Agents working together on your task</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {/* Workflow Visualization */}
        <div className="p-6 bg-gradient-to-b from-secondary-50 to-white">
          <div className="flex items-center justify-between gap-4">
            {agents.map((agent, index) => (
              <div key={agent.name} className="flex-1 flex items-center">
                {/* Agent Node */}
                <div className="flex-1">
                  <AgentNode
                    agent={agent}
                    progress={
                      index === 0 ? researchProgress :
                      index === 1 ? writingProgress :
                      reviewProgress
                    }
                    output={agentOutputs[index]}
                  />
                </div>

                {/* Arrow */}
                {index < agents.length - 1 && (
                  <div className="px-2">
                    <WorkflowArrow
                      isActive={agent.status === 'completed'}
                      isProcessing={agents[index + 1]?.status === 'active'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pipeline Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-secondary-500 mb-2">
              <span>Pipeline Progress</span>
              <span>{
                currentStep === 'completed' ? '100%' :
                currentStep === 'reviewing' ? `${Math.round(reviewProgress / 3 + 66)}%` :
                currentStep === 'writing' ? `${Math.round(writingProgress / 3 + 33)}%` :
                `${Math.round(researchProgress / 3)}%`
              }</span>
            </div>
            <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: currentStep === 'completed' ? '100%' :
                    currentStep === 'reviewing' ? `${reviewProgress / 3 + 66}%` :
                    currentStep === 'writing' ? `${writingProgress / 3 + 33}%` :
                    `${researchProgress / 3}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Status Panel */}
        <div className="border-t border-secondary-100">
          <div className="p-4">
            <h4 className="text-sm font-medium text-secondary-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Live Status
            </h4>
            <div className="space-y-3">
              {agents.map((agent, index) => (
                <div
                  key={agent.name}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    agent.status === 'active' ? 'bg-primary-50 border border-primary-200' :
                    agent.status === 'completed' ? 'bg-accent-50' :
                    'bg-secondary-50'
                  }`}
                >
                  <div className={`w-8 h-8 ${
                    agent.status === 'active' ? agent.bgColor + ' animate-pulse' :
                    agent.status === 'completed' ? 'bg-accent-500' :
                    'bg-secondary-300'
                  } rounded-lg flex items-center justify-center text-white`}>
                    {agent.status === 'active' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : agent.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      agent.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-secondary-900 text-sm">{agent.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        agent.status === 'active' ? 'bg-primary-100 text-primary-700' :
                        agent.status === 'completed' ? 'bg-accent-100 text-accent-700' :
                        'bg-secondary-100 text-secondary-500'
                      }`}>
                        {agent.status === 'active' ? 'Processing...' :
                         agent.status === 'completed' ? 'Done' : 'Waiting'}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500">{agent.role}</p>
                    {agentOutputs[index] && agent.status === 'completed' && (
                      <p className="text-xs text-secondary-600 mt-1 truncate">{agentOutputs[index]}</p>
                    )}
                  </div>
                  {agent.status === 'active' && (
                    <div className="text-right">
                      <span className={`text-sm font-medium ${agent.color}`}>
                        {index === 0 ? researchProgress :
                         index === 1 ? writingProgress :
                         reviewProgress}%
                      </span>
                      <div className="w-20 h-1.5 bg-secondary-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${agent.bgColor} transition-all`}
                          style={{
                            width: `${index === 0 ? researchProgress :
                             index === 1 ? writingProgress :
                             reviewProgress}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Context */}
        {taskTitle && (
          <div className="border-t border-secondary-100 p-4 bg-secondary-50">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-900">{taskTitle}</p>
                {taskDescription && (
                  <p className="text-xs text-secondary-500 mt-1 line-clamp-2">{taskDescription}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function AgentNode({ agent, progress, output }: { agent: AgentStatus; progress: number; output?: string }) {
  return (
    <div className="text-center">
      {/* Agent Icon */}
      <div className="relative mx-auto mb-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          agent.status === 'active'
            ? 'bg-white shadow-lg shadow-primary-500/30 border-2 border-primary-400 scale-110'
            : agent.status === 'completed'
            ? 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg'
            : 'bg-secondary-100 border-2 border-secondary-200'
        }`}>
          <div className={agent.status === 'completed' ? 'text-white' : agent.color}>
            {agent.status === 'active' ? (
              <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
            ) : agent.status === 'completed' ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              agent.icon
            )}
          </div>
        </div>

        {/* Pulse Effect for Active Agent */}
        {agent.status === 'active' && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-primary-400/30 animate-ping" />
            <div className="absolute -inset-2 rounded-3xl bg-primary-400/20 animate-pulse" />
          </>
        )}

        {/* Progress Ring for Active Agent */}
        {agent.status === 'active' && (
          <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary-100"
            />
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${progress * 1.88} 188`}
              strokeLinecap="round"
              className="text-primary-500 transition-all duration-100"
            />
          </svg>
        )}
      </div>

      {/* Agent Info */}
      <p className={`font-medium text-sm ${
        agent.status === 'active' ? 'text-primary-700' :
        agent.status === 'completed' ? 'text-accent-700' :
        'text-secondary-400'
      }`}>
        {agent.name}
      </p>
      <p className="text-xs text-secondary-400">{agent.role}</p>

      {/* Progress Text */}
      {agent.status === 'active' && (
        <div className="mt-2">
          <span className="text-xs font-medium text-primary-600">{progress}%</span>
        </div>
      )}

      {/* Completed Indicator */}
      {agent.status === 'completed' && (
        <div className="mt-2 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-accent-500" />
          <span className="text-xs text-accent-600">Verified</span>
        </div>
      )}
    </div>
  );
}

function WorkflowArrow({ isActive, isProcessing }: { isActive: boolean; isProcessing?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
        isActive ? 'bg-accent-500' : 'bg-secondary-300'
      }`} />
      <ArrowRight className={`w-4 h-4 transition-colors ${
        isActive ? 'text-accent-500' : 'text-secondary-300'
      } ${isProcessing ? 'animate-pulse' : ''}`} />
    </div>
  );
}
