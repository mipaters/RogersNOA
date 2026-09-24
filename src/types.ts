export type AutonomyMode = 'Observe' | 'Assist' | 'Governed Autonomy' | 'Level 4 Simulation'
export type Severity = 'Critical' | 'High' | 'Medium' | 'Predictive'
export type StepStatus = 'waiting' | 'active' | 'complete' | 'blocked' | 'rejected' | 'stopped'

export interface Agent {
  id: string
  name: string
  role: string
  purpose: string
  tools: string[]
  knowledge: string[]
  owner: string
  version: string
}

export interface Metric {
  label: string
  before: number
  after: number
  unit: string
  better: 'up' | 'down'
}

export interface ScenarioStep {
  id: string
  title: string
  description: string
  agentId: string
  duration: number
  input: string
  evidence: string[]
  toolCalls: string[]
  decision: string
  confidence: number
  policy: string
  output: string
  requiresApproval?: boolean
  operational?: boolean
}

export interface Scenario {
  id: string
  name: string
  domain: string
  severity: Severity
  detection: string
  customers: string
  risk: string
  outcome: string
  incidentId: string
  asset: string
  summary: string
  steps: ScenarioStep[]
  metrics: Metric[]
  architecture: string[]
}

export interface AuditEvent {
  id: string
  time: string
  type: 'system' | 'agent' | 'policy' | 'human' | 'communication'
  message: string
}

export interface PolicyState {
  blastRadiusApproval: boolean
  automaticCommunications: boolean
  minimumConfidence: number
  automaticRemediation: boolean
}

