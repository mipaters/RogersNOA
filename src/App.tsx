import { useState, type ReactNode } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowRight, Bot, Building2, Check, ChevronRight, CircleStop,
  Eye, FileText, Gauge, GitBranch, Map, Network, Pause, Play, RotateCcw,
  ShieldCheck, Sparkles, TicketCheck, X, Zap,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { agents, architectureLayers, scenarios } from './data'
import { CustomerZeroPage } from './CustomerZeroPage'
import type { Agent, AuditEvent, AutonomyMode, Scenario, ScenarioStep } from './types'
import { useScenarioEngine } from './useScenarioEngine'

type Engine = ReturnType<typeof useScenarioEngine>
type AgentDrawerState = { agent: Agent; step?: ScenarioStep } | null

const navItems = [
  ['/', 'Command Center', Activity],
  ['/customer-zero', 'Customer Zero', Network],
  ['/scenarios', 'Scenarios', Sparkles],
  ['/agents', 'Agent Operations', Bot],
  ['/map', 'Network Map', Map],
  ['/impact', 'Executive Impact', Gauge],
  ['/architecture', 'Architecture', Building2],
  ['/governance', 'Governance', ShieldCheck],
] as const

const autonomyModes: AutonomyMode[] = ['Observe', 'Assist', 'Governed Autonomy', 'Level 4 Simulation']

function App() {
  const engine = useScenarioEngine()
  const [agentDrawer, setAgentDrawer] = useState<AgentDrawerState>(null)
  const [traceOpen, setTraceOpen] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [guided, setGuided] = useState(false)
  const [guidedStep, setGuidedStep] = useState(0)
  const openAgent = (agentId: string, step?: ScenarioStep) => {
    const agent = agents.find((item) => item.id === agentId)
    if (agent) setAgentDrawer({ agent, step })
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header engine={engine} onReset={engine.reset} onGuide={() => setGuided(true)} />
        <div className="body-shell">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CommandCenter engine={engine} openAgent={openAgent} openTrace={() => setTraceOpen(true)} openTicket={() => setTicketOpen(true)} />} />
              <Route path="/customer-zero" element={<CustomerZeroPage />} />
              <Route path="/scenarios" element={<ScenariosPage engine={engine} />} />
              <Route path="/agents" element={<AgentsPage engine={engine} openAgent={openAgent} />} />
              <Route path="/map" element={<NetworkMapPage engine={engine} />} />
              <Route path="/impact" element={<ExecutivePage engine={engine} />} />
              <Route path="/architecture" element={<ArchitecturePage engine={engine} />} />
              <Route path="/governance" element={<GovernancePage engine={engine} />} />
            </Routes>
            <footer className="confidential-footer">Microsoft Confidential</footer>
          </main>
        </div>
        {agentDrawer && <AgentDrawer state={agentDrawer} close={() => setAgentDrawer(null)} openTrace={() => setTraceOpen(true)} />}
        {traceOpen && <TraceModal engine={engine} close={() => setTraceOpen(false)} />}
        {ticketOpen && <TicketDrawer engine={engine} close={() => setTicketOpen(false)} />}
        {guided && <GuidedDemo step={guidedStep} setStep={setGuidedStep} close={() => { setGuided(false); setGuidedStep(0) }} engine={engine} />}
      </div>
    </BrowserRouter>
  )
}

function Header({ engine, onReset, onGuide }: { engine: Engine; onReset: () => void; onGuide: () => void }) {
  return (
    <header className="global-header">
      <div className="brand">
        <div className="brand-mark">NG</div>
        <div>
          <strong>Network Guardian</strong>
          <span>Autonomous Network Operations</span>
        </div>
      </div>
      <div className="header-status">
        <span className="live-dot"><i /> Live simulation</span>
        <span><b>{engine.scenario.severity}</b> · {engine.scenario.name}</span>
        <select aria-label="Autonomy mode" value={engine.mode} onChange={(event) => engine.setMode(event.target.value as AutonomyMode)}>
          {autonomyModes.map((mode) => <option key={mode}>{mode}</option>)}
        </select>
        <button className="button ghost" onClick={onReset}><RotateCcw size={15} /> Reset</button>
        <button className="button primary" onClick={onGuide}><Sparkles size={15} /> Guided Demo</button>
      </div>
    </header>
  )
}

function Navigation() {
  return (
    <aside className="navigation">
      <div className="nav-label">Network command</div>
      {navItems.map(([path, label, Icon]) => (
        <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Icon size={18} /><span>{label}</span>
        </NavLink>
      ))}
      <div className="simulation-note"><ShieldCheck size={18} /><b>Simulated demo</b><span>No live network actions, tickets, or messages.</span></div>
    </aside>
  )
}

function CommandCenter({ engine, openAgent, openTrace, openTicket }: { engine: Engine; openAgent: (id: string, step?: ScenarioStep) => void; openTrace: () => void; openTicket: () => void }) {
  const currentStep = engine.scenario.steps[engine.current]
  return (
    <div className="page command-page">
      <PageIntro eyebrow="Network Operations Command Center" title={engine.scenario.name} text={engine.scenario.summary}>
        <span className={`severity ${engine.scenario.severity.toLowerCase()}`}>{engine.scenario.severity}</span>
        <span className="chip">{engine.scenario.domain}</span>
        <span className="chip">{engine.scenario.incidentId}</span>
      </PageIntro>

      <div className="metric-strip">
        {engine.scenario.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} progress={engine.complete || engine.current >= Math.max(1, engine.scenario.steps.length - 2)} />)}
      </div>

      <div className="command-grid">
        <section className="panel context-panel">
          <PanelHeader icon={<AlertTriangle size={18} />} title="Incident context" />
          <div className="scenario-select">
            <label htmlFor="scenario-selector">Selected scenario</label>
            <select id="scenario-selector" value={engine.scenario.id} onChange={(event) => engine.selectScenario(event.target.value)}>
              {scenarios.map((scenario) => <option value={scenario.id} key={scenario.id}>{scenario.name}</option>)}
            </select>
          </div>
          <DataPair label="Affected asset" value={engine.scenario.asset} />
          <DataPair label="Customer impact" value={engine.scenario.customers} />
          <DataPair label="Primary risk" value={engine.scenario.risk} />
          <DataPair label="Autonomy" value={engine.mode} />
          <div className="timeline-mini">
            <span>Workflow progress</span>
            <strong>{Math.min(engine.current + 1, engine.scenario.steps.length)} / {engine.scenario.steps.length}</strong>
            <div><i style={{ width: `${Math.max(0, Math.min(100, ((engine.current + 1) / engine.scenario.steps.length) * 100))}%` }} /></div>
          </div>
          <div className="controls">
            {!engine.running ? <button className="button primary wide" onClick={engine.start}><Play size={16} /> {engine.current < 0 ? 'Start scenario' : 'Resume'}</button> : <button className="button secondary wide" onClick={engine.pause}><Pause size={16} /> Pause</button>}
            <div className="control-row">
              <button className="button ghost" onClick={engine.skipToApproval}>Skip to approval</button>
              <button className="button ghost" onClick={engine.completeScenario}>Complete</button>
            </div>
            <div className="speed-row"><span>Simulation speed</span>{[1, 2, 4].map((speed) => <button className={engine.speed === speed ? 'active' : ''} onClick={() => engine.setSpeed(speed)} key={speed}>{speed}x</button>)}</div>
            <button className="button danger wide" onClick={engine.emergencyStop}><CircleStop size={16} /> Emergency stop</button>
          </div>
          <button className="text-button" onClick={openTicket}><TicketCheck size={15} /> View simulated incident ticket</button>
        </section>

        <section className="panel workflow-panel">
          <PanelHeader icon={<GitBranch size={18} />} title="Live multi-agent workflow" action={<button className="text-button" onClick={openTrace}>Full trace <ArrowRight size={14} /></button>} />
          <div className="workflow-rail">
            {engine.scenario.steps.map((step, index) => {
              const agent = agents.find((item) => item.id === step.agentId)!
              const status = engine.statuses[index]
              return (
                <button key={step.id} className={`workflow-step ${status}`} onClick={() => openAgent(agent.id, step)}>
                  <div className="step-node">{status === 'complete' ? <Check size={16} /> : status === 'blocked' ? <ShieldCheck size={16} /> : <Bot size={16} />}</div>
                  <div className="step-copy"><small>{index + 1} · {agent.name}</small><strong>{step.title}</strong><span>{status === 'active' ? step.description : status === 'blocked' ? 'Waiting for NOC Duty Manager' : status}</span></div>
                  {index < engine.scenario.steps.length - 1 && <i className="connector" />}
                </button>
              )
            })}
          </div>
          {currentStep && (
            <div className="active-tool">
              <Zap size={16} /><div><small>Active tools</small><strong>{currentStep.toolCalls.join(' · ')}</strong></div>
              <span>{currentStep.confidence}% confidence</span>
            </div>
          )}
          {engine.paused && <ApprovalPanel engine={engine} />}
          {engine.stopped && <div className="stop-banner"><CircleStop size={20} /><div><b>Emergency stop active</b><span>The workflow is locked. Reset the demo to continue.</span></div></div>}
        </section>

        <ActivityPanel engine={engine} openAgent={openAgent} openTrace={openTrace} />
      </div>
    </div>
  )
}

function ApprovalPanel({ engine }: { engine: Engine }) {
  const step = engine.scenario.steps[engine.current]
  if (!step) return null
  return (
    <div className="approval-panel">
      <div className="approval-title"><ShieldCheck size={22} /><div><small>Human approval gate</small><strong>{step.title}</strong></div><span>{step.confidence}% confidence</span></div>
      <p>{step.description}</p>
      <div className="approval-facts">
        <DataPair label="Affected assets" value={engine.scenario.asset} />
        <DataPair label="Blast radius" value={engine.scenario.customers} />
        <DataPair label="Rollback" value="Available · previous state retained" />
        <DataPair label="Policy result" value={step.policy} />
      </div>
      {engine.analysisCount > 0 && <div className="new-evidence"><Sparkles size={15} /> Additional analysis #{engine.analysisCount}: alternative path and failure-domain checks agree with the proposed action.</div>}
      <div className="control-row">
        <button className="button success" onClick={engine.approve}><Check size={15} /> Approve</button>
        <button className="button danger" onClick={engine.reject}><X size={15} /> Reject</button>
        <button className="button secondary" onClick={engine.requestAnalysis}>Request more analysis</button>
      </div>
    </div>
  )
}

function ActivityPanel({ engine, openAgent, openTrace }: { engine: Engine; openAgent: (id: string, step?: ScenarioStep) => void; openTrace: () => void }) {
  const [tab, setTab] = useState('Agent Activity')
  const tabs = ['Agent Activity', 'Evidence', 'Tool Calls', 'Communications', 'Audit Log']
  const events = [...engine.audit].reverse()
  return (
    <section className="panel activity-panel">
      <PanelHeader icon={<Activity size={18} />} title="Live activity & evidence" />
      <div className="tabs">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{item}</button>)}</div>
      <div className="activity-feed">
        {tab === 'Agent Activity' && engine.scenario.steps.map((step, index) => index <= engine.current && (
          <button className="feed-item" key={step.id} onClick={() => openAgent(step.agentId, step)}>
            <span className={`feed-icon ${engine.statuses[index]}`}><Bot size={14} /></span><div><small>{agents.find((a) => a.id === step.agentId)?.name}</small><strong>{step.title}</strong><p>{step.description}</p></div><ChevronRight size={15} />
          </button>
        )).reverse()}
        {tab === 'Evidence' && (engine.scenario.steps[engine.current]?.evidence ?? engine.scenario.steps[0].evidence).map((item) => <FeedText key={item} title={item} text="Synthetic source · grounded and attributed for this demonstration." />)}
        {tab === 'Tool Calls' && (engine.scenario.steps[engine.current]?.toolCalls ?? engine.scenario.steps[0].toolCalls).map((item) => <FeedText key={item} title={item} text="Completed against local synthetic data in 620 ms." />)}
        {tab === 'Communications' && ['Teams approval card', 'NOC incident update', 'Field dispatch', 'Customer-care bulletin', 'Executive summary'].map((item) => <FeedText key={item} title={item} text="Preview generated from scenario data · not sent." />)}
        {tab === 'Audit Log' && events.map((event) => <AuditRow event={event} key={event.id} />)}
        {tab === 'Audit Log' && <button className="button secondary wide" onClick={openTrace}>Open full trace</button>}
        {engine.current < 0 && tab === 'Agent Activity' && <EmptyState icon={<Play size={22} />} title="Ready to simulate" text="Start the scenario to watch the agent team coordinate in real time." />}
      </div>
    </section>
  )
}

function ScenariosPage({ engine }: { engine: Engine }) {
  const navigate = useNavigate()
  const launch = (id: string) => { engine.selectScenario(id); navigate('/') }
  return (
    <div className="page">
      <PageIntro eyebrow="Scenario library" title="Select a network operations scenario" text="Each scenario has unique telemetry, topology, agent participation, approval policy, and measurable outcomes." />
      <div className="scenario-grid">
        {scenarios.map((scenario, index) => (
          <article className={`scenario-card ${engine.scenario.id === scenario.id ? 'selected' : ''}`} key={scenario.id} onClick={() => engine.selectScenario(scenario.id)}>
            <div className="scenario-number">0{index + 1}</div><span className={`severity ${scenario.severity.toLowerCase()}`}>{scenario.severity}</span>
            <h2>{scenario.name}</h2><p>{scenario.summary}</p>
            <div className="scenario-details"><DataPair label="Domain" value={scenario.domain} /><DataPair label="Detection" value={scenario.detection} /><DataPair label="Impact" value={scenario.customers} /><DataPair label="Outcome" value={scenario.outcome} /></div>
            <div className="agent-stack">{[...new Set(scenario.steps.map((step) => step.agentId))].slice(0, 6).map((id) => <span key={id}>{agents.find((a) => a.id === id)?.name.replace(' Agent', '').slice(0, 2)}</span>)}<small>{new Set(scenario.steps.map((step) => step.agentId)).size} agents</small></div>
            <button className="button primary wide" onClick={(event) => { event.stopPropagation(); launch(scenario.id) }}><Play size={16} /> Load in Command Center</button>
          </article>
        ))}
      </div>
    </div>
  )
}

function AgentsPage({ engine, openAgent }: { engine: Engine; openAgent: (id: string) => void }) {
  const activeIds = new Set(engine.scenario.steps.map((step) => step.agentId))
  return (
    <div className="page">
      <PageIntro eyebrow="Agent Operations" title="Reusable Network Operations Agent team" text="Health, ownership, tools, and governance remain visible across every scenario." />
      <div className="agent-summary">
        <Stat value="18" label="Registered agents" /><Stat value="100%" label="Guardrail checks" /><Stat value="742 ms" label="Avg. simulated latency" /><Stat value="98.6%" label="Demo success rate" />
      </div>
      <div className="agent-grid">
        {agents.map((agent) => <button key={agent.id} className={`agent-card ${activeIds.has(agent.id) ? 'participating' : ''}`} onClick={() => openAgent(agent.id)}>
          <div className="agent-avatar"><Bot size={20} /></div><span className="health"><i /> Healthy</span><h3>{agent.name}</h3><p>{agent.purpose}</p>
          <div className="agent-meta"><span>{activeIds.has(agent.id) ? 'Current scenario' : 'Standby'}</span><span>{agent.version}</span></div>
          <div className="tool-chips">{agent.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
        </button>)}
      </div>
    </div>
  )
}

function NetworkMapPage({ engine }: { engine: Engine }) {
  const [selected, setSelected] = useState('Affected service domain')
  const nodes = ['Core network', 'Regional aggregation', engine.scenario.asset.split(' · ')[0], 'Customer services', 'Enterprise sites', 'Field crew']
  return (
    <div className="page">
      <PageIntro eyebrow="Synthetic topology" title="Network impact and recovery map" text={`Scenario-aware topology for ${engine.scenario.name}. No external map or live network data is used.`} />
      <div className="map-layout">
        <section className="panel topology-map">
          <div className="map-legend"><span><i className="healthy" /> Healthy</span><span><i className="affected" /> Affected</span><span><i className="rerouted" /> Protected path</span></div>
          <div className="topology-canvas">
            <svg viewBox="0 0 900 460" role="img" aria-label="Synthetic network topology">
              <path className="path base" d="M95 230 C220 80 320 90 430 210 S650 330 810 205" />
              <path className="path affected" d="M310 145 C360 155 395 180 430 210" />
              {(engine.current >= Math.floor(engine.scenario.steps.length / 2) || engine.complete) && <path className="path rerouted" d="M95 230 C230 390 620 410 810 205" />}
            </svg>
            {nodes.map((node, index) => {
              const positions = [[7, 45], [24, 21], [46, 43], [68, 60], [86, 40], [50, 82]]
              return <button key={node} style={{ left: `${positions[index][0]}%`, top: `${positions[index][1]}%` }} className={`map-node ${index === 2 ? 'affected' : index === 5 ? 'crew' : ''}`} onClick={() => setSelected(node)}><Network size={20} /><span>{node}</span></button>
            })}
          </div>
        </section>
        <aside className="panel asset-panel"><PanelHeader icon={<Network size={18} />} title="Asset details" /><h2>{selected}</h2><DataPair label="Health" value={selected.includes(engine.scenario.asset.split(' · ')[0]) ? 'Critical · active alarms' : 'Nominal'} /><DataPair label="Region" value="Greater Toronto Area" /><DataPair label="Customers served" value={engine.scenario.customers} /><DataPair label="Open ticket" value={engine.scenario.incidentId} /><DataPair label="Assigned agent" value="Network Guardian Supervisor" /><DataPair label="Recommended action" value={engine.scenario.outcome} /><div className="telemetry-list">{engine.scenario.metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.before}{metric.unit}</strong></div>)}</div></aside>
      </div>
    </div>
  )
}

function ExecutivePage({ engine }: { engine: Engine }) {
  const chart = engine.scenario.metrics.map((metric) => ({ name: metric.label, Before: metric.before, After: metric.after }))
  return (
    <div className="page">
      <PageIntro eyebrow="Executive impact" title="From technical action to business outcome" text="All monetary, operational, and customer values are simulated demo estimates. Autonomy is assessed by scenario, domain, and market—not across the entire network." />
      <div className="executive-cards">
        <Stat value="42 sec" label="Mean time to detect" delta="92% faster" /><Stat value="2.8 min" label="Root cause identification" delta="87% faster" /><Stat value="11.4 min" label="Simulated restoration" delta="64% faster" /><Stat value="17" label="Manual steps avoided" delta="Demo estimate" /><Stat value="428" label="Alarms correlated" delta="1 incident" /><Stat value="86%" label="Workflow automated" delta={`${engine.mode}`} />
      </div>
      <div className="impact-grid">
        <section className="panel chart-panel"><PanelHeader icon={<Gauge size={18} />} title="Before vs. validated outcome" /><ResponsiveContainer width="100%" height={320}><BarChart data={chart} margin={{ top: 20, right: 20, left: 0, bottom: 50 }}><CartesianGrid strokeDasharray="3 3" stroke="#27303a" /><XAxis dataKey="name" stroke="#84909d" angle={-18} textAnchor="end" interval={0} /><YAxis stroke="#84909d" /><Tooltip contentStyle={{ background: '#111821', border: '1px solid #303a45' }} /><Bar dataKey="Before" fill="#ef4b58" radius={[4, 4, 0, 0]} /><Bar dataKey="After" fill="#32d296" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></section>
        <section className="panel why-panel"><PanelHeader icon={<Building2 size={18} />} title="Why it matters" /><h2>{engine.scenario.outcome}</h2><p>Network Guardian turns fragmented alarms into a governed workflow that can detect, diagnose, coordinate, execute, validate, and explain an operational outcome.</p><div className="outcome-list"><DataPair label="Customers protected" value={engine.scenario.customers} /><DataPair label="Truck rolls avoided" value={engine.scenario.id === 'home-wifi' ? '318 estimated' : '1–4 estimated'} /><DataPair label="SLA exposure reduced" value="72% simulated estimate" /><DataPair label="Human approvals" value={engine.mode === 'Level 4 Simulation' ? '0 policy exceptions' : '1–3 governed gates'} /></div><div className="maturity"><span>TM Forum autonomy progression</span><div><i style={{ width: engine.mode === 'Level 4 Simulation' ? '88%' : engine.mode === 'Governed Autonomy' ? '72%' : '48%' }} /></div><b>{engine.mode} · scenario-specific assessment</b></div></section>
      </div>
    </div>
  )
}

function ArchitecturePage({ engine }: { engine: Engine }) {
  const [selected, setSelected] = useState<{ layer: string; item: string } | null>(null)
  return (
    <div className="page">
      <PageIntro eyebrow="Microsoft solution architecture" title="A reusable Network Harness beneath the use cases" text="Click any component to inspect its role, data, agent use, scenarios, and production controls." />
      <div className="architecture-stack">
        {architectureLayers.map((layer, index) => <section className="architecture-layer" key={layer.title}><div className="layer-label"><span>0{index + 1}</span><strong>{layer.title}</strong></div><div className="architecture-items">{layer.items.map((item) => <button key={item} onClick={() => setSelected({ layer: layer.title, item })} className={engine.scenario.architecture.some((match) => item.includes(match) || match.includes(item.split(' ')[0])) ? 'active' : ''}>{item}<ChevronRight size={14} /></button>)}</div></section>)}
      </div>
      {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="modal architecture-detail" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)}><X /></button><span className="eyebrow">{selected.layer}</span><h1>{selected.item}</h1><p>This component supports grounded, observable, and governed network operations workflows in the Microsoft-aligned architecture.</p><div className="detail-grid"><DataPair label="Data handled" value="Synthetic telemetry, topology, service impact, workflow state, or policy metadata as appropriate." /><DataPair label="Agents using it" value={engine.scenario.steps.slice(0, 4).map((step) => agents.find((a) => a.id === step.agentId)?.name).join(', ')} /><DataPair label="Scenarios" value="Reusable across fibre, DOCSIS, CPE, capacity, and wireless workflows." /><DataPair label="Security controls" value="Entra ID, managed identity, RBAC, Purview, audit logs, least privilege, and data boundaries." /><DataPair label="Demo status" value="Simulated locally. Production implementation would require approved integrations and controls." /></div></div></div>}
    </div>
  )
}

function GovernancePage({ engine }: { engine: Engine }) {
  const policies = [
    ['blastRadiusApproval', 'Maximum blast radius', 'Require approval for service-affecting changes.'],
    ['automaticCommunications', 'Automatic communications', 'Allow policy-approved notices without an extra review.'],
    ['automaticRemediation', 'Automatic remediation', 'Permit remediation when policy and confidence checks pass.'],
  ] as const
  return (
    <div className="page">
      <PageIntro eyebrow="Governance & controls" title="Human-governed, visible, reversible autonomy" text="Policy changes immediately affect simulation behavior and approval gates." />
      <div className="governance-grid">
        <section className="panel policy-panel"><PanelHeader icon={<ShieldCheck size={18} />} title="Active policy controls" />{policies.map(([key, title, description]) => <label className="policy-toggle" key={key}><div><strong>{title}</strong><span>{description}</span></div><input type="checkbox" checked={engine.policies[key]} onChange={(event) => engine.setPolicies({ ...engine.policies, [key]: event.target.checked })} /><i /></label>)}<div className="confidence-control"><div><strong>Minimum confidence threshold</strong><span>Lower-confidence decisions trigger additional analysis and approval.</span></div><b>{engine.policies.minimumConfidence}%</b><input type="range" min="70" max="98" value={engine.policies.minimumConfidence} onChange={(event) => engine.setPolicies({ ...engine.policies, minimumConfidence: Number(event.target.value) })} /></div></section>
        <section className="panel controls-panel"><PanelHeader icon={<Eye size={18} />} title="Control coverage" />{['Human-in-the-loop policy', 'Role-based approvals', 'Separation of duties', 'Maintenance-window enforcement', 'Rollback readiness', 'Tool allowlist', 'Data-boundary enforcement', 'PII masking', 'Prompt-injection protection', 'Grounding requirement', 'Source attribution', 'Action logging', 'Model and agent versioning', 'Incident replay', 'Audit export'].map((control) => <div className="control-check" key={control}><Check size={14} /><span>{control}</span><small>Enforced</small></div>)}</section>
        <section className="panel audit-preview"><PanelHeader icon={<FileText size={18} />} title="Recent audit events" />{[...engine.audit].reverse().slice(0, 8).map((event) => <AuditRow event={event} key={event.id} />)}{engine.audit.length === 0 && <EmptyState icon={<FileText />} title="No audit events yet" text="Load or run a scenario to create an immutable simulated audit trail." />}</section>
      </div>
    </div>
  )
}

function AgentDrawer({ state, close, openTrace }: { state: NonNullable<AgentDrawerState>; close: () => void; openTrace: () => void }) {
  const { agent, step } = state
  return (
    <div className="drawer-backdrop" onMouseDown={close}><aside className="drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={`${agent.name} details`}><button className="close-button" onClick={close}><X /></button><div className="drawer-agent"><div className="agent-avatar large"><Bot /></div><span className="health"><i /> Healthy</span><h1>{agent.name}</h1><p>{agent.role}</p></div><div className="drawer-section"><h3>Current assignment</h3><DataPair label="Status" value={step ? 'Active in current workflow' : 'Ready'} /><DataPair label="Task" value={step?.title ?? 'Awaiting scenario assignment'} /><DataPair label="Elapsed" value={step ? '00:00:42 simulated' : '—'} /><DataPair label="Processing count" value={step ? '18.4K simulated tokens' : '—'} /></div><div className="drawer-section"><h3>Enterprise-safe decision summary</h3><DataPair label="Goal" value={step?.description ?? agent.purpose} /><DataPair label="Evidence considered" value={step?.evidence.join('; ') ?? agent.knowledge.join('; ')} /><DataPair label="Rule / policy" value={step?.policy ?? 'Grounding and data-boundary controls enforced.'} /><DataPair label="Decision" value={step?.decision ?? 'No active decision.'} /><DataPair label="Confidence" value={step ? `${step.confidence}%` : '—'} /><DataPair label="Next action" value={step?.output ?? 'Wait for assignment.'} /></div><div className="drawer-section"><h3>Tools & knowledge</h3><div className="tool-chips">{agent.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><p>{agent.knowledge.join(' · ')}</p></div><button className="button primary wide" onClick={openTrace}>View trace</button></aside></div>
  )
}

function TraceModal({ engine, close }: { engine: Engine; close: () => void }) {
  const [filter, setFilter] = useState('All')
  const visible = engine.scenario.steps.filter((step) => filter === 'All' || step.agentId === filter)
  return (
    <div className="modal-backdrop"><div className="modal trace-modal"><button className="close-button" onClick={close}><X /></button><span className="eyebrow">Execution observability</span><h1>Agent trace · {engine.scenario.incidentId}</h1><p>Readable operational summaries only. Hidden chain-of-thought is never exposed.</p><div className="trace-filters"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{[...new Set(engine.scenario.steps.map((step) => step.agentId))].map((id) => <option key={id} value={id}>{agents.find((a) => a.id === id)?.name}</option>)}</select><span>{visible.length} steps</span></div><div className="trace-table">{visible.map((step, index) => <details key={step.id} open={index === engine.current}><summary><span>{String(index + 1).padStart(2, '0')}</span><div><small>{agents.find((a) => a.id === step.agentId)?.name}</small><strong>{step.title}</strong></div><b className={engine.statuses[engine.scenario.steps.indexOf(step)]}>{engine.statuses[engine.scenario.steps.indexOf(step)]}</b></summary><div className="trace-detail"><DataPair label="Input" value={step.input} /><DataPair label="Data source" value={step.evidence.join(' · ')} /><DataPair label="Tool" value={step.toolCalls.join(' · ')} /><DataPair label="Decision summary" value={step.decision} /><DataPair label="Confidence" value={`${step.confidence}%`} /><DataPair label="Guardrail outcome" value={step.policy} /><DataPair label="Output" value={step.output} /><DataPair label="Latency" value={`${step.duration} ms simulated`} /></div></details>)}</div></div></div>
  )
}

function TicketDrawer({ engine, close }: { engine: Engine; close: () => void }) {
  const rootStep = engine.scenario.steps.find((step) => step.agentId === 'root-cause' || step.agentId === 'docsis' || step.agentId === 'cpe')
  return <div className="drawer-backdrop" onMouseDown={close}><aside className="drawer ticket-drawer" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={close}><X /></button><span className="eyebrow">Simulated ITSM record</span><h1>{engine.scenario.incidentId}</h1><p>TM Forum-style terminology for demonstration only; no live certified integration is claimed.</p><div className="drawer-section"><DataPair label="Title" value={engine.scenario.name} /><DataPair label="Severity" value={engine.scenario.severity} /><DataPair label="Status" value={engine.complete ? 'Resolved' : engine.current < 0 ? 'New' : 'In progress'} /><DataPair label="Domain" value={engine.scenario.domain} /><DataPair label="Affected assets" value={engine.scenario.asset} /><DataPair label="Customers impacted" value={engine.scenario.customers} /><DataPair label="Root cause" value={rootStep?.decision ?? 'Under investigation'} /><DataPair label="Assigned team" value="Network Operations Command Centre" /><DataPair label="Remediation" value={engine.scenario.outcome} /><DataPair label="Validation" value={engine.complete ? 'Passed' : 'Pending'} /></div><div className="drawer-section"><h3>Agent-generated work notes</h3>{engine.audit.map((event) => <AuditRow event={event} key={event.id} />)}</div></aside></div>
}

const guideSteps = ['The network problem', 'Select a scenario', 'Detect the incident', 'Correlate the alarms', 'Determine root cause', 'Quantify customer impact', 'Review agent evidence', 'Approve the action', 'Execute remediation', 'Validate recovery', 'Review business impact', 'Show Microsoft architecture', 'Show governance and auditability']
function GuidedDemo({ step, setStep, close, engine }: { step: number; setStep: (step: number) => void; close: () => void; engine: Engine }) {
  const notes = [
    'Network operations teams must connect telemetry, topology, customer impact, policy, field work, and communications under time pressure.',
    'Start with Major Fibre Cut for the primary wireline story, then use the additional scenarios to show reuse.',
    'The Monitoring Agent identifies a meaningful anomaly rather than waiting for a customer-reported outage.',
    'Hundreds of symptoms become one actionable incident with a common probable cause.',
    'Grounded operational evidence identifies the likely failure domain without exposing hidden reasoning.',
    'Customer IQ translates affected assets into service and business priority.',
    'Every agent exposes evidence, tools, confidence, policy checks, and outputs.',
    'The operator maintains control over high-impact changes and can request more analysis.',
    'The action remains simulated, reversible, policy checked, and fully logged.',
    'Validation compares before-and-after telemetry before declaring success.',
    'Technical recovery becomes customer, SLA, effort, and autonomy outcomes.',
    'The reusable Network Harness combines Microsoft AI, Fabric, integrations, and controls.',
    'Autonomy is scenario-specific, governed, observable, and reversible.',
  ]
  const action = () => {
    if (step === 1) engine.selectScenario('fibre-cut')
    if (step === 2 && engine.current < 0) engine.start()
    if (step === 7) engine.skipToApproval()
    if (step === 8 && engine.paused) engine.approve()
    if (step === 9) engine.completeScenario()
    setStep(Math.min(guideSteps.length - 1, step + 1))
  }
  return <div className="guided"><div className="guided-progress"><span style={{ width: `${((step + 1) / guideSteps.length) * 100}%` }} /></div><div className="guided-copy"><small>Guided Demo · {step + 1} of {guideSteps.length}</small><h2>{guideSteps[step]}</h2><p>{notes[step]}</p>{step === 0 && <blockquote>“Instead of asking a NOC analyst to manually investigate hundreds of alarms, Network Guardian correlates the signals into a single incident. Specialized agents analyze the network, determine customer impact, retrieve the approved operating procedure, and prepare a remediation plan. The operator can inspect the evidence and maintain control over high-impact changes. Once approved, the workflow executes the simulated remediation, validates recovery, updates the incident, and prepares communications. The important point is not a single use case. It is the reusable network harness beneath the use cases.”</blockquote>}</div><div className="guided-actions"><button className="button ghost" onClick={close}>Exit</button><button className="button secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button><button className="button primary" onClick={action}>{step === guideSteps.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={15} /></button></div></div>
}

function MetricCard({ metric, progress }: { metric: Scenario['metrics'][number]; progress: boolean }) {
  const value = progress ? metric.after : metric.before
  const improved = metric.better === 'up' ? metric.after > metric.before : metric.after < metric.before
  return <div className="metric-card"><span>{metric.label}</span><strong>{value.toLocaleString()}{metric.unit}</strong><small className={progress && improved ? 'positive' : ''}>{progress ? `Validated from ${metric.before}${metric.unit}` : 'Current synthetic reading'}</small></div>
}
function PageIntro({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{children && <div className="intro-chips">{children}</div>}</div>
}
function PanelHeader({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return <div className="panel-header"><div>{icon}<strong>{title}</strong></div>{action}</div>
}
function DataPair({ label, value }: { label: string; value: string }) {
  return <div className="data-pair"><span>{label}</span><strong>{value}</strong></div>
}
function FeedText({ title, text }: { title: string; text: string }) {
  return <div className="feed-item static"><span className="feed-icon complete"><Check size={14} /></span><div><strong>{title}</strong><p>{text}</p></div></div>
}
function AuditRow({ event }: { event: AuditEvent }) {
  return <div className="audit-row"><span>{event.time}</span><i className={event.type} /><p>{event.message}</p></div>
}
function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="empty-state">{icon}<strong>{title}</strong><span>{text}</span></div>
}
function Stat({ value, label, delta }: { value: string; label: string; delta?: string }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span>{delta && <small>{delta}</small>}</div>
}

export default App
