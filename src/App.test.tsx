import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Network Guardian', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.history.pushState({}, '', '/')
  })

  it('selecting a scenario resets workflow state', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /start scenario/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Audit Log' }))
    expect(screen.getByText(/detect optical anomaly started/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Selected scenario'), { target: { value: 'docsis-noise' } })
    expect(screen.getByRole('heading', { name: 'DOCSIS Congestion & Noise' })).toBeInTheDocument()
    expect(screen.getByText('0 / 9')).toBeInTheDocument()
  })

  it('starting advances and pauses at an approval gate', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /start scenario/i }))
    for (let index = 0; index < 5; index += 1) {
      act(() => vi.runOnlyPendingTimers())
    }
    expect(screen.getByText('Human approval gate')).toBeInTheDocument()
    expect(screen.getAllByText('Prepare repair and supplier response').length).toBeGreaterThan(0)
  })

  it('approving resumes the workflow', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /skip to approval/i }))
    fireEvent.click(screen.getByRole('button', { name: /^approve$/i }))
    expect(screen.queryByText('Human approval gate')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument()
  })

  it('rejecting records alternatives in the audit log', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /skip to approval/i }))
    fireEvent.click(screen.getByRole('button', { name: /^reject$/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Audit Log' }))
    expect(screen.getByText(/alternatives generated/i)).toBeInTheDocument()
  })

  it('autonomy mode changes approval behavior', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Autonomy mode'), { target: { value: 'Level 4 Simulation' } })
    fireEvent.click(screen.getByRole('button', { name: /skip to approval/i }))
    expect(screen.queryByText('Human approval gate')).not.toBeInTheDocument()
  })

  it('emergency stop prevents additional execution', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /start scenario/i }))
    fireEvent.click(screen.getByRole('button', { name: /emergency stop/i }))
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByText('Emergency stop active')).toBeInTheDocument()
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('completion updates outcome metrics', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Complete' }))
    expect(screen.getByText('99.2%')).toBeInTheDocument()
    expect(screen.getByText(/validated from 61%/i)).toBeInTheDocument()
  })

  it('agent clicks open the correct detail drawer', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByText('Detect optical anomaly')[0])
    expect(screen.getByRole('heading', { name: 'Network Monitoring Agent' })).toBeInTheDocument()
  })

  it('architecture blocks open the correct explanation', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: /architecture/i }))
    await user.click(screen.getByRole('button', { name: /microsoft foundry/i }))
    expect(screen.getByRole('heading', { name: 'Microsoft Foundry' })).toBeInTheDocument()
    expect(screen.getByText(/production implementation would require approved integrations/i)).toBeInTheDocument()
  })

  it('opens the Customer Zero story and steps through the Kuala Lumpur repair', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: /customer zero/i }))
    expect(screen.getByRole('heading', { name: /AI agents operating the Azure backbone/i })).toBeInTheDocument()
    expect(screen.getByText('550,000+ km')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^next/i }))
    expect(screen.getByText(/Critical Azure impact detected/i)).toBeInTheDocument()
    expect(screen.getByText('Microsoft Confidential')).toBeInTheDocument()
  })

  it('loads the IMS hardware failure scenario and its Voice Assurance Agent', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<App />)
    fireEvent.change(screen.getByLabelText('Selected scenario'), { target: { value: 'ims-hardware' } })
    expect(screen.getByRole('heading', { name: 'IMS Voice Core Hardware Failure' })).toBeInTheDocument()
    expect(screen.getByText('IMS-SBC-GTA-02 · line card LC-3')).toBeInTheDocument()
    await user.click(screen.getAllByText('Identify failed SBC line card')[0])
    expect(screen.getByRole('heading', { name: 'Voice Assurance Agent' })).toBeInTheDocument()
  })
})
