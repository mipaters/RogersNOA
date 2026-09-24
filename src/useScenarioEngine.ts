import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { scenarios } from './data'
import type { AuditEvent, AutonomyMode, PolicyState, Scenario, StepStatus } from './types'

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export function useScenarioEngine() {
  const [scenario, setScenario] = useState<Scenario>(scenarios[0])
  const [mode, setMode] = useState<AutonomyMode>('Governed Autonomy')
  const [current, setCurrent] = useState(-1)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [rejected, setRejected] = useState(false)
  const [audit, setAudit] = useState<AuditEvent[]>([])
  const [policies, setPolicies] = useState<PolicyState>({
    blastRadiusApproval: true,
    automaticCommunications: true,
    minimumConfidence: 85,
    automaticRemediation: true,
  })
  const timer = useRef<number | undefined>(undefined)

  const addAudit = useCallback((message: string, type: AuditEvent['type'] = 'agent') => {
    setAudit((events) => [...events, { id: crypto.randomUUID(), time: now(), type, message }])
  }, [])

  const reset = useCallback((next = scenario) => {
    window.clearTimeout(timer.current)
    setScenario(next)
    setCurrent(-1)
    setRunning(false)
    setPaused(false)
    setStopped(false)
    setRejected(false)
    setAnalysisCount(0)
    setAudit([{ id: crypto.randomUUID(), time: now(), type: 'system', message: `${next.name} loaded and ready.` }])
  }, [scenario])

  const selectScenario = useCallback((id: string) => {
    const next = scenarios.find((item) => item.id === id)
    if (next) reset(next)
  }, [reset])

  const needsApproval = useCallback((index: number) => {
    const next = scenario.steps[index]
    if (!next) return false
    if (mode === 'Observe' && next.operational) return true
    if (mode === 'Assist' && next.operational) return true
    if (!policies.automaticRemediation && next.agentId === 'remediation') return true
    if (!policies.automaticCommunications && next.agentId === 'communications') return true
    if (next.confidence < policies.minimumConfidence) return true
    if (mode === 'Level 4 Simulation') return false
    return Boolean(next.requiresApproval && policies.blastRadiusApproval)
  }, [mode, policies, scenario.steps])

  const advance = useCallback(() => {
    if (stopped) return
    const nextIndex = current + 1
    if (nextIndex >= scenario.steps.length) {
      setRunning(false)
      setPaused(false)
      addAudit('Scenario completed. Executive outcomes and incident record updated.', 'system')
      return
    }
    setCurrent(nextIndex)
    addAudit(`${scenario.steps[nextIndex].title} started.`)
    if (needsApproval(nextIndex)) {
      setPaused(true)
      addAudit(`Human approval required: ${scenario.steps[nextIndex].title}.`, 'policy')
    }
  }, [addAudit, current, needsApproval, scenario.steps, stopped])

  useEffect(() => {
    if (!running || paused || stopped) return
    const active = scenario.steps[current]
    timer.current = window.setTimeout(advance, (active?.duration ?? 350) / speed)
    return () => window.clearTimeout(timer.current)
  }, [advance, current, paused, running, scenario.steps, speed, stopped])

  const start = () => {
    if (current === -1) {
      setRunning(true)
      addAudit('Simulation launched by NOC Duty Manager.', 'human')
      setCurrent(0)
      addAudit(`${scenario.steps[0].title} started.`)
      if (needsApproval(0)) setPaused(true)
    } else {
      setRunning(true)
      setPaused(false)
    }
  }

  const approve = () => {
    setPaused(false)
    setRunning(true)
    setRejected(false)
    addAudit(`NOC Duty Manager approved ${scenario.steps[current]?.title}.`, 'human')
  }

  const reject = () => {
    setPaused(true)
    setRunning(false)
    setRejected(true)
    addAudit(`NOC Duty Manager rejected ${scenario.steps[current]?.title}; alternatives generated.`, 'human')
  }

  const requestAnalysis = () => {
    setAnalysisCount((count) => count + 1)
    addAudit('Additional synthetic diagnostic completed and attached to approval evidence.', 'agent')
  }

  const emergencyStop = () => {
    window.clearTimeout(timer.current)
    setStopped(true)
    setRunning(false)
    setPaused(false)
    addAudit('Emergency Stop activated. No additional actions may execute.', 'human')
  }

  const skipToApproval = () => {
    const index = scenario.steps.findIndex((_step, stepIndex) => stepIndex > current && needsApproval(stepIndex))
    if (index >= 0) {
      setCurrent(index)
      setRunning(true)
      setPaused(true)
      addAudit(`Presenter skipped to approval: ${scenario.steps[index].title}.`, 'human')
    }
  }

  const complete = () => {
    setCurrent(scenario.steps.length)
    setRunning(false)
    setPaused(false)
    addAudit('Presenter completed the scenario. Outcomes finalized.', 'human')
  }

  const statuses = useMemo<StepStatus[]>(() => scenario.steps.map((_step, index) => {
    if (stopped && index >= current) return 'stopped'
    if (rejected && index === current) return 'rejected'
    if (index < current) return 'complete'
    if (index === current) return paused ? 'blocked' : 'active'
    return 'waiting'
  }), [current, paused, rejected, scenario.steps, stopped])

  return {
    scenario, mode, current, running, paused, stopped, speed, audit, policies, statuses, analysisCount,
    complete: current >= scenario.steps.length,
    setMode, setSpeed, setPolicies, selectScenario, start,
    pause: () => setPaused(true), resume: () => { setPaused(false); setRunning(true) },
    reset: () => reset(), approve, reject, requestAnalysis, emergencyStop, skipToApproval, completeScenario: complete,
  }
}
