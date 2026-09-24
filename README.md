# Rogers Network Guardian

An executive-ready, simulated network operations command center demonstrating how a governed team of AI agents can detect, analyze, coordinate, resolve, validate, and communicate telecom incidents.

> **Demo disclaimer:** All network data, customers, incidents, tickets, communications, actions, metrics, and business values are synthetic. The application does not connect to Rogers systems, make network changes, create tickets, or send messages.

## Features

- Six distinct fibre, DOCSIS, CPE, capacity, and wireless scenarios
- Deterministic multi-agent workflow simulation with adjustable speed
- Observe, Assist, Governed Autonomy, and Level 4 Simulation modes
- Human approval, rejection, extra-analysis, rollback, and emergency-stop experiences
- Clickable agent registry with enterprise-safe decision summaries
- Scenario-aware synthetic topology, telemetry, customer impact, and outcomes
- Agent trace, evidence, tool-call, communication, audit, and ticket views
- Executive before/after dashboard with scenario-level autonomy positioning
- Clickable Microsoft architecture and interactive governance policies
- Guided Demo presenter mode
- Responsive, keyboard-accessible, reduced-motion-aware interface

## Technology

Vite, React, TypeScript, Tailwind CSS, React Router, Lucide React, Recharts, Vitest, and React Testing Library. Data and simulation state are local; no backend, environment variables, paid APIs, or external data are required.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Validate and build

```bash
npm test
npm run build
```

The production output is written to `dist`.

## Scenarios

1. **Major Fibre Cut** — correlates optical and downstream alarms, identifies probable physical damage, coordinates repair, reroutes traffic, and validates recovery.
2. **DOCSIS Congestion & Noise** — distinguishes congestion from plant noise and applies a simulated temporary profile adjustment.
3. **In-Home Connectivity** — isolates a gateway firmware cohort, pilots rollback, and compares pilot and control outcomes.
4. **Proactive DOCSIS Capacity** — predicts a threshold breach and creates headroom before customer experience degrades.
5. **Wireless Capacity Hotspot** — treats radio congestion during a synthetic stadium event as an additional wireless scenario.
6. **Tower Backhaul & Power** — coordinates transport, power, field, vendor, and RAN actions for a spreading site-cluster risk.

## Guided demo walkthrough

Select **Guided Demo** in the header. The presenter flow covers the network problem, scenario selection, detection, correlation, diagnosis, customer impact, evidence, approval, execution, validation, executive outcomes, Microsoft architecture, and governance.

The recommended starting point is **Major Fibre Cut**, followed by the DOCSIS and CPE scenarios to show reuse of the Network Harness.

## Architecture

The solution is organized into user experience, the Agentic Network Harness, Microsoft AI, Network IQ and Customer IQ, integration, network/customer data, and security/governance layers. Production implementations would require approved identity, data, model, integration, evaluation, monitoring, and operational-change controls.

## Simulation model

Scenario data is defined in `src/data.ts`. `src/useScenarioEngine.ts` advances ordered workflow steps, applies autonomy and governance policy, pauses at approval gates, records audit events, and exposes metric completion state. The UI never presents hidden chain-of-thought; it presents goals, evidence, policy, decisions, confidence, and next actions.

## Add a scenario

Add a strongly typed `Scenario` entry in `src/data.ts` with unique steps, metrics, affected assets, architecture components, and agent IDs. Approval and operational flags determine how autonomy modes and governance policies affect execution.

## Add an agent

Add a strongly typed `Agent` entry to the agent registry in `src/data.ts`, then reference its `id` from scenario steps. Agent cards and detail drawers are generated automatically.

## Azure Static Web Apps

`staticwebapp.config.json` provides SPA navigation fallback to `index.html`. The sample workflow in `.github/workflows/azure-static-web-apps.yml` uses:

- `app_location: "/"`
- `api_location: ""`
- `output_location: "dist"`

Create an Azure Static Web App and add its deployment token as the `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret before enabling deployment.
