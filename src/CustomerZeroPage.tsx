import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Bot, Cable, Check, ChevronRight, Database, FastForward,
  Mail, MessageSquare, Network, Pause, Play, RotateCcw, Sparkles,
  UserRound,
} from 'lucide-react'
import {
  customerZeroData,
  type CustomerZeroMessage,
  type CustomerZeroScenarioStep,
} from './customerZeroData'

const agentColors = {
  niobe: '#55d5ff',
  pal: '#a98cff',
  miles: '#55dfa4',
} as const

export function CustomerZeroPage() {
  const [future, setFuture] = useState(false)
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const scenario = customerZeroData.scenario

  useEffect(() => {
    if (!playing) return
    if (step >= scenario.steps.length - 1) {
      setPlaying(false)
      return
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 1500)
    return () => window.clearTimeout(timer)
  }, [playing, scenario.steps.length, step])

  const visibleSteps: readonly CustomerZeroScenarioStep[] = step < 0 ? [] : scenario.steps.slice(0, step + 1)
  const messages: CustomerZeroMessage[] = visibleSteps.flatMap((item) => [...item.messages])
  const teamsMessages = messages.filter((message) => message.channel === 'teams')
  const emailMessages = messages.filter((message) => message.channel === 'email')
  const activeStep = step >= 0 ? scenario.steps[step] : undefined

  const play = () => {
    if (step >= scenario.steps.length - 1) setStep(-1)
    setPlaying(true)
  }
  const next = () => {
    setPlaying(false)
    setStep((current) => Math.min(scenario.steps.length - 1, current + 1))
  }
  const reset = () => {
    setPlaying(false)
    setStep(-1)
  }

  return (
    <div className="page customer-zero-page">
      <section className="cz-hero">
        <div className="cz-hero-copy">
          <span className="eyebrow">Azure Networking · Microsoft as Customer Zero</span>
          <h1>AI agents operating the Azure backbone</h1>
          <p>{customerZeroData.story.customer}</p>
          <div className="cz-hero-actions">
            <a className="button primary" href="#customer-zero-scenario"><Play size={15} /> Play fibre-cut scenario</a>
            <a className="button secondary" href="#customer-zero-kpis">View outcomes <ArrowRight size={15} /></a>
          </div>
        </div>
        <div className="cz-scale-grid">
          {customerZeroData.scale.map((metric) => (
            <div className="cz-scale-card" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cz-story-grid">
        <StoryCard number="01" title="Challenge" icon={<FastForward size={20} />} text={customerZeroData.story.challenge} />
        <StoryCard number="02" title="Agentic shift" icon={<Sparkles size={20} />} text={customerZeroData.story.solution} />
        <StoryCard number="03" title="Grounded operations" icon={<Database size={20} />} text={customerZeroData.story.grounding} />
      </section>

      <SectionHeading eyebrow="Agent team" title="Three agents, bounded responsibilities" text="Copilots work alongside operators in familiar collaboration surfaces while the autonomous agent manages long-running repair workflows." />
      <section className="cz-agent-grid">
        {customerZeroData.agents.map((agent) => (
          <article className="panel cz-agent-card" key={agent.id} style={{ '--agent-color': agentColors[agent.id] } as CSSProperties}>
            <div className="cz-agent-head">
              <div className="cz-agent-avatar">{agent.id === 'miles' ? <Bot size={28} /> : <UserRound size={28} />}</div>
              <div><span>{agent.type}</span><h2>{agent.name}</h2><p>{agent.role}</p></div>
            </div>
            <ul>{agent.responsibilities.map((responsibility) => <li key={responsibility}><Check size={14} />{responsibility}</li>)}</ul>
            {agent.proofPoint && <div className="cz-proof"><Sparkles size={15} />{agent.proofPoint}</div>}
          </article>
        ))}
      </section>

      <SectionHeading eyebrow="Architecture" title="Agentic operations built on Azure" text="A stateful workflow manager assembles context and invokes specialized agents across collaboration, agent, data, and governance layers.">
        <label className="cz-future-toggle">
          <span>Current</span>
          <input type="checkbox" checked={future} onChange={(event) => setFuture(event.target.checked)} />
          <i />
          <span>Future</span>
        </label>
      </SectionHeading>
      <section className="cz-architecture">
        {(future ? customerZeroData.architecture.future : customerZeroData.architecture.current).map((layer, index) => (
          <div className="cz-architecture-layer" key={layer.title}>
            <div className="cz-layer-label"><span>0{index + 1}</span><strong>{layer.title}</strong></div>
            <div className="cz-layer-items">{layer.items.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        ))}
      </section>

      <section className="cz-agent-architecture-review">
        <SectionHeading eyebrow="Under the hood" title="How Niobe, Pal, and Miles are built" text="Each agent has a bounded role, dedicated grounding, approved system interactions, and clear communication channels for NOC engineers and external providers." />
        <div className="cz-agent-architecture-grid">
          {customerZeroData.agentArchitecture.map((profile) => {
            const agent = customerZeroData.agents.find((item) => item.id === profile.agentId)!
            return (
              <article className="panel cz-agent-architecture-card" key={profile.agentId} style={{ '--agent-color': agentColors[profile.agentId] } as CSSProperties}>
                <div className="cz-agent-architecture-title">
                  <div className="cz-agent-avatar"><Bot size={23} /></div>
                  <div><span>{agent.type}</span><h3>{agent.name}</h3><p>{agent.role}</p></div>
                </div>
                <ArchitectureFact icon={<Sparkles size={15} />} label="Build pattern" text={profile.build} />
                <ArchitectureFact icon={<Network size={15} />} label="Workflow role" text={profile.workflowRole} />
                <ArchitectureList icon={<Database size={15} />} label="Grounding" items={profile.grounding} />
                <ArchitectureList icon={<ServerIcon />} label="Tools & systems" items={profile.toolsAndSystems} />
                <ArchitectureList icon={<MessageSquare size={15} />} label="Communication channels" items={profile.channels} />
              </article>
            )
          })}
        </div>
      </section>

      <section className="cz-lessons">
        <SectionHeading eyebrow="Lessons learned" title="What Microsoft learned operating as Customer Zero" text="Practical lessons from bringing agents into network operations workflows." />
        <div className="cz-lessons-grid">
          {customerZeroData.lessons.map((lesson, index) => <article key={lesson}><span>{String(index + 1).padStart(2, '0')}</span><p>{lesson}</p></article>)}
        </div>
      </section>

      <section id="customer-zero-scenario" className="cz-scenario-section">
        <SectionHeading eyebrow="Playable fibre repair" title={scenario.title} text={`Incident ${scenario.incidentId} · step through the agent-led detection, provider coordination, verification, and closure workflow.`} />
        <div className="cz-scenario-controls">
          <button className="button primary" onClick={play}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Playing' : step < 0 ? 'Play' : 'Resume'}</button>
          <button className="button secondary" onClick={next} disabled={step >= scenario.steps.length - 1}>Next <ChevronRight size={15} /></button>
          <button className="button ghost" onClick={reset}><RotateCcw size={15} /> Reset</button>
          <div className="cz-scenario-progress"><span>{Math.max(0, step + 1)} / {scenario.steps.length}</span><div><i style={{ width: `${Math.max(0, ((step + 1) / scenario.steps.length) * 100)}%` }} /></div></div>
        </div>
        <div className="cz-scenario-grid">
          <section className="panel cz-timeline-panel">
            <div className="panel-header"><div><Cable size={18} /><strong>Repair workflow</strong></div><span className="chip">KUL20 ↔ KUL23</span></div>
            <div className="cz-timeline">
              {scenario.steps.map((item, index) => {
                const status = index < step ? 'complete' : index === step ? 'active' : 'waiting'
                return (
                  <button key={item.id} className={`cz-timeline-step ${status}`} onClick={() => { setPlaying(false); setStep(index) }}>
                    <span className="cz-step-number">{status === 'complete' ? <Check size={15} /> : item.number}</span>
                    <div><small>{item.agent}</small><strong>{item.title}</strong><p>{item.summary}</p>{item.badge && <em>{item.badge}</em>}</div>
                  </button>
                )
              })}
            </div>
            {activeStep && <div className="cz-active-detail"><span>Active evidence</span>{activeStep.detail.map((detail) => <p key={detail}><Check size={13} />{detail}</p>)}</div>}
          </section>

          <section className="panel cz-comms-panel">
            <div className="panel-header"><div><MessageSquare size={18} /><strong>Agent & supplier communications</strong></div><span className="chip">Not sent · demonstration</span></div>
            <div className="cz-comms-split">
              <div className="cz-channel-pane teams">
                <div className="cz-channel-heading"><MessageSquare size={16} /><div><strong>Teams incident channel</strong><span>NOC engineer collaboration</span></div></div>
                <div className="cz-channel-scroll">
                  {teamsMessages.length === 0 && <ChannelEmpty text="Niobe, Pal, and Miles updates will appear as the incident progresses." />}
                  {teamsMessages.map((message, index) => <MessageCard key={`${message.sender}-teams-${index}`} message={message} />)}
                </div>
              </div>
              <div className="cz-channel-pane outlook">
                <div className="cz-channel-heading"><Mail size={16} /><div><strong>Miles ↔ third-party fibre provider</strong><span>Outlook email trail · incident 606093997</span></div></div>
                <div className="cz-channel-scroll">
                  {emailMessages.length === 0 && <ChannelEmpty text="The supplier email trail begins when Miles dispatches the provider." />}
                  {emailMessages.map((message, index) => <MessageCard key={`${message.sender}-email-${index}`} message={message} />)}
                </div>
              </div>
            </div>
          </section>
        </div>
        {step >= scenario.steps.length - 1 && (
          <div className="cz-repair-summary">
            <div><Check size={24} /><span>Repair complete</span><strong>{scenario.summary.repairTime}</strong></div>
            <div><span>Workflow</span><strong>{scenario.summary.interactions}</strong></div>
            <div><span>Quality control</span><strong>{scenario.summary.attempts}</strong></div>
            <div><span>Provider coordination</span><strong>{scenario.summary.clarifications}</strong></div>
            <div><span>Ownership</span><strong>{scenario.summary.owner}</strong></div>
            <p>{scenario.summary.note}</p>
          </div>
        )}
      </section>

      <section id="customer-zero-kpis">
        <SectionHeading eyebrow="Measured outcomes" title="Operational impact at hyperscale" text="The agent model shifts engineers from manually driving every incident to enabling agents and handling escalations when agents get stuck." />
        <div className="cz-kpi-grid">
          {customerZeroData.kpis.map((kpi) => <article className="cz-kpi-card" key={kpi.label}><strong>{kpi.value}</strong><span>{kpi.label}</span><i /></article>)}
        </div>
        <div className="panel cz-from-to">
          <div className="panel-header"><div><ArrowRight size={18} /><strong>Operating model shift</strong></div></div>
          <div className="cz-from-to-head"><span>Outcome</span><span>From</span><span>To</span></div>
          {customerZeroData.kpis.map((kpi) => <div className="cz-from-to-row" key={kpi.label}><strong>{kpi.value} · {kpi.label}</strong><span>{kpi.from}</span><span>{kpi.to}</span></div>)}
        </div>
      </section>

      <section className="cz-bridge">
        <div className="cz-bridge-copy">
          <span className="eyebrow">Bridge to Network Guardian</span>
          <h2>From Customer Zero to your network</h2>
          <p>The same pattern maps proven agent roles into the reusable Network Guardian operating model.</p>
        </div>
        <div className="cz-bridge-links">
          {customerZeroData.bridge.map((item) => <Link key={item.from} to={item.path}><span>{item.from}</span><ArrowRight size={18} /><strong>{item.to}</strong><ChevronRight size={16} /></Link>)}
        </div>
        <div className="cz-next-strip">
          <span>What’s next</span>
          {customerZeroData.whatsNext.map((item) => <div key={item.title}><strong>{item.title}</strong><small>{item.detail}</small></div>)}
        </div>
      </section>
    </div>
  )
}

function StoryCard({ number, title, icon, text }: { number: string; title: string; icon: ReactNode; text: string }) {
  return <article className="panel cz-story-card"><div><span>{number}</span>{icon}</div><h2>{title}</h2><p>{text}</p></article>
}

function SectionHeading({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return <div className="cz-section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>{children}</div>
}

function MessageCard({ message }: { message: CustomerZeroMessage }) {
  return (
    <article className={`cz-message ${message.kind} ${message.channel}`}>
      <div className="cz-message-icon">{message.channel === 'email' ? <Mail size={15} /> : <MessageSquare size={15} />}</div>
      <div>
        <div className="cz-message-head"><strong>{message.sender}</strong><span>{message.channel === 'email' ? 'Outlook' : 'Teams'}</span></div>
        {message.audience && <small>To: {message.audience}</small>}
        {message.subject && <h3>{message.subject}</h3>}
        <p>{message.body}</p>
      </div>
    </article>
  )
}

function ArchitectureFact({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return <div className="cz-architecture-fact"><div>{icon}<span>{label}</span></div><p>{text}</p></div>
}

function ArchitectureList({ icon, label, items }: { icon: ReactNode; label: string; items: readonly string[] }) {
  return <div className="cz-architecture-fact"><div>{icon}<span>{label}</span></div><div className="cz-architecture-tags">{items.map((item) => <i key={item}>{item}</i>)}</div></div>
}

function ServerIcon() {
  return <Network size={15} />
}

function ChannelEmpty({ text }: { text: string }) {
  return <div className="cz-channel-empty"><Network size={22} /><span>{text}</span></div>
}
