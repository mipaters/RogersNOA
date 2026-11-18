export interface CustomerZeroScaleMetric {
  value: string
  label: string
}

export interface CustomerZeroAgent {
  id: 'niobe' | 'pal' | 'miles'
  name: string
  role: string
  type: string
  responsibilities: string[]
  proofPoint?: string
}

export interface CustomerZeroArchitectureLayer {
  title: string
  items: string[]
}

export interface CustomerZeroAgentArchitecture {
  agentId: CustomerZeroAgent['id']
  build: string
  workflowRole: string
  grounding: string[]
  toolsAndSystems: string[]
  channels: string[]
}

export interface CustomerZeroMessage {
  channel: 'teams' | 'email'
  sender: string
  audience?: string
  subject?: string
  body: string
  kind: 'agent' | 'human' | 'system'
}

export interface CustomerZeroScenarioStep {
  id: string
  number: number
  title: string
  agent: string
  summary: string
  detail: string[]
  badge?: string
  messages: CustomerZeroMessage[]
}

export interface CustomerZeroKpi {
  value: string
  label: string
  from: string
  to: string
}

export const customerZeroData = {
  title: 'Azure Networking: Microsoft as Customer Zero',
  scale: [
    { value: '550,000+ km', label: 'Fibre optic and undersea cable' },
    { value: '190+', label: 'Metro points of presence' },
    { value: '400+', label: 'Datacenters' },
  ] satisfies CustomerZeroScaleMetric[],
  story: {
    customer: 'Azure network operations team, responsible for continuously improving availability and throughput of the Azure backbone.',
    challenge: 'Network demand is expected to grow 10x over the next four years. Traditional automation across diagnostics, ticketing, and repair workflows cannot keep up with hyperscale growth, creating rising operational burden, delays, and cost.',
    solution: 'Shift from reactive automated workflows with human escalation to scalable AI-driven automation through an agentic framework. Specialized agents operate within bounded scopes and are invoked by a stateful workflow manager that assembles and injects context so each agent acts reliably and repeatably.',
    grounding: 'Engineered prompt libraries use device logs, historical tickets, and runbooks. Network Graph Service and Network State Service provide universal network context. Niobe and Pal use SQL-like interfaces to triangulate alerts and identify affected components.',
  },
  lessons: [
    'Teams and Outlook integration was the killer app: agents work with you like the rest of your team.',
    'Models are good out of the box, like a university-intern network engineer.',
    'Workflow is the biggest challenge; getting it right offsets limited LLM context.',
    'High effort is required to get engineered prompts right.',
    'LLMs can reason over source systems, reducing the need for a traditional data model.',
    'Invest time updating runbooks for agents.',
    'Build agents for your most time-intensive problems first.',
    'Focus less on anomaly detection and more on fixing problems really quickly; that maximizes ROI on hardware.',
  ],
  agents: [
    {
      id: 'niobe',
      name: 'Niobe Li',
      role: 'NOC Manager',
      type: 'Copilot',
      responsibilities: [
        'Monitors global network health and surfaces anomalies.',
        'Escalates incidents and recommends change windows.',
        'Works in Teams and Outlook.',
      ],
    },
    {
      id: 'pal',
      name: 'Pal Locke',
      role: 'Tier 2 Escalations',
      type: 'Copilot',
      responsibilities: [
        'Invoked when expert root-cause analysis is needed.',
        'Performs deep reasoning and complex diagnostics.',
        'Understands hundreds of hardware SKUs and operating systems.',
        'Synthesizes topology, telemetry, and history.',
      ],
    },
    {
      id: 'miles',
      name: 'Miles Dyson',
      role: 'Operations Engineer',
      type: 'Autonomous Agent',
      responsibilities: [
        'Independently initiates and manages fibre repair workflows.',
        'Runs OTDR tests and coordinates field technicians.',
        'Coordinates with hundreds of fibre providers worldwide.',
        'Verifies repairs and escalates to a human Tier 2 when stuck.',
      ],
      proofPoint: '300+ fibre repairs completed; repairs up to 35 hours and 50+ interactions.',
    },
  ] satisfies CustomerZeroAgent[],
  agentArchitecture: [
    {
      agentId: 'niobe',
      build: 'NOC Manager Copilot in the Troubleshooting Agent Service, reached through Azure Functions request routing and coordinated by the workflow engine on AKS.',
      workflowRole: 'Monitors global health, surfaces anomalies, escalates incidents, recommends change windows, and brings critical network context to NOC engineers.',
      grounding: ['Engineered prompt libraries', 'Device logs', 'Historical tickets', 'Runbooks', 'Network Graph Service', 'Network State Service'],
      toolsAndSystems: ['SQL-like interfaces', 'Network telemetry', 'Ticket system', 'Troubleshooting guides & RCAs', 'RAG', 'REST APIs'],
      channels: ['Copilot', 'Teams', 'Outlook'],
    },
    {
      agentId: 'pal',
      build: 'Tier 2 Escalations Copilot in the Troubleshooting Agent Service, reached through Azure Functions request routing and coordinated by the workflow engine on AKS.',
      workflowRole: 'Invoked for expert root-cause analysis, deep reasoning, complex diagnostics, and synthesis across multivendor topology, telemetry, and history.',
      grounding: ['Engineered prompt libraries', 'Device logs', 'Historical tickets', 'Runbooks', 'Network Graph Service', 'Network State Service'],
      toolsAndSystems: ['SQL-like interfaces', 'Network telemetry', 'Device access · commands and output', 'Troubleshooting guides & RCAs', 'Security guides', 'RAG'],
      channels: ['Copilot', 'Agent Factory web app'],
    },
    {
      agentId: 'miles',
      build: 'Autonomous Operations Engineer in the Workflow Agent Service, coordinated by the workflow engine on AKS for long-running fibre repair workflows.',
      workflowRole: 'Initiates and manages fibre repair, runs OTDR tests, coordinates field technicians and fibre providers, verifies repairs, and escalates to a human Tier 2 when stuck.',
      grounding: ['Engineered prompt libraries', 'Historical tickets', 'Automation runbooks', 'Troubleshooting guides & RCAs'],
      toolsAndSystems: ['GDCO field ticketing', 'Ticket system', 'Network telemetry', 'Device access · commands and output', 'Logic Apps', 'REST APIs'],
      channels: ['Outlook · fibre providers', 'Agent Factory web app', 'Human Tier 2 escalation'],
    },
  ] satisfies CustomerZeroAgentArchitecture[],
  architecture: {
    current: [
      {
        title: 'UI for AI',
        items: ['Copilot', 'Teams', 'Outlook', 'Agent Factory web app'],
      },
      {
        title: 'Agentic framework · GPT-5',
        items: ['Azure Functions request routing', 'Troubleshooting Agent Service · Pal & Niobe', 'Workflow Agent Service · Miles', 'Workflow engine on AKS'],
      },
      {
        title: 'Data & universal data access',
        items: ['ADLS Gen2', 'Cosmos DB · conversation history', 'Ticket system', 'GDCO field ticketing', 'Network telemetry', 'Device access · commands and output', 'Troubleshooting guides & RCAs', 'Security guides', 'Automation runbooks', 'RAG', 'Logic Apps', 'REST APIs'],
      },
      {
        title: 'Governance',
        items: ['Entra ID', 'Key Vault', 'Purview'],
      },
    ] satisfies CustomerZeroArchitectureLayer[],
    future: [
      {
        title: 'Future platform',
        items: ['Microsoft Agent Framework', 'Foundry IQ', 'Fabric & Fabric IQ', 'Agent 365', 'MCP server', 'Azure AI Search vector indexes'],
      },
      {
        title: 'Future agent team',
        items: ['NOC Manager', 'Frontline Engineer', 'Escalation Engineer', 'Devices Interaction', 'Configuration & Change'],
      },
    ] satisfies CustomerZeroArchitectureLayer[],
  },
  scenario: {
    title: 'Fibre cut, Kuala Lumpur',
    incidentId: '606093997',
    steps: [
      {
        id: 'break',
        number: 1,
        title: 'Fibre break',
        agent: 'Niobe',
        summary: 'Critical Azure impact flagged in Teams.',
        detail: ['Alarm on span wmk032 between facilities KUL20 and KUL23.', 'The fibre break is bidirectional.', 'Incident ID 606093997.'],
        messages: [
          { channel: 'teams', sender: 'Niobe', body: 'Critical Azure impact detected on bidirectional span wmk032 between KUL20 and KUL23. Incident 606093997 has been opened.', kind: 'agent' },
        ],
      },
      {
        id: 'isolate',
        number: 2,
        title: 'Detect & isolate',
        agent: 'Miles + Pal',
        summary: 'OTDR and network context isolate the fault and blast radius.',
        detail: ['Miles locates the cut 19.10 km from KUL20.', 'The cut is 7.94 km from KUL23.', 'Pal correlates topology and telemetry to confirm affected circuits and blast radius.'],
        messages: [
          { channel: 'teams', sender: 'Miles', body: 'OTDR results locate the fault 19.10 km from KUL20 and 7.94 km from KUL23.', kind: 'agent' },
          { channel: 'teams', sender: 'Pal', body: 'Topology and telemetry correlation confirms the affected circuits and blast radius.', kind: 'agent' },
        ],
      },
      {
        id: 'dispatch',
        number: 3,
        title: 'Diagnose & dispatch',
        agent: 'Miles',
        summary: 'Provider receives an urgent, technically grounded dispatch request.',
        detail: ['Miles requests urgent technician dispatch, root cause and fault analysis, and ETR.', 'Azure internal SLA requires repair within 24 hours.', 'Status updates are requested every 45 minutes.'],
        messages: [
          { channel: 'email', sender: 'Miles', audience: 'Fibre provider', subject: 'Critical fibre cut · urgent dispatch · incident 606093997', body: 'Please dispatch a technician urgently, provide root cause and fault analysis, and share ETR. Azure internal SLA requires repair within 24 hours. Please provide status updates every 45 minutes.', kind: 'agent' },
        ],
      },
      {
        id: 'confirm',
        number: 4,
        title: 'Confirm dispatch',
        agent: 'Fibre provider',
        summary: 'The provider locates the break and prepares to splice.',
        detail: ['Cable break is approximately 8 km from FEDB Astro toward Cyberjaya.', 'The contractor is preparing to splice.', 'ETTR is 4 hours.'],
        badge: '3 emails back & forth to clarify',
        messages: [
          { channel: 'email', sender: 'Fibre provider', audience: 'Miles', subject: 'Re: Critical fibre cut · incident 606093997', body: 'Cable break is approximately 8 km from FEDB Astro toward Cyberjaya. The team is preparing to splice. ETTR is 4 hours.', kind: 'human' },
        ],
      },
      {
        id: 'updates',
        number: 5,
        title: 'Periodic updates',
        agent: 'Miles',
        summary: 'Miles acknowledges dispatch and holds the provider to the update cadence.',
        detail: ['Provider status remains visible to the workflow.', 'Miles maintains the 45-minute update requirement.'],
        messages: [
          { channel: 'email', sender: 'Miles', audience: 'Fibre provider', subject: 'Re: Critical fibre cut · incident 606093997', body: 'Acknowledged. Please continue to provide status updates every 45 minutes.', kind: 'agent' },
        ],
      },
      {
        id: 'failed-check',
        number: 6,
        title: 'Quality check · failed attempt',
        agent: 'Miles',
        summary: 'The contractor reports completion, but independent verification fails.',
        detail: ['Miles verifies the repair and finds the issue persists.', 'Miles replies with technical findings.', 'A second repair attempt is requested.'],
        messages: [
          { channel: 'email', sender: 'Fibre provider', audience: 'Miles', subject: 'Repair completed · incident 606093997', body: 'The repair work is complete.', kind: 'human' },
          { channel: 'email', sender: 'Miles', audience: 'Fibre provider', subject: 'Verification failed · second attempt required', body: 'Network verification shows the issue persists. Please review the technical findings and perform a second repair attempt.', kind: 'agent' },
        ],
      },
      {
        id: 'complete',
        number: 7,
        title: 'Complete repair',
        agent: 'Miles',
        summary: 'Optical power is verified and the repair workflow closes.',
        detail: [
          'kul23-wmk032-01omt: median -9.1 dBm, threshold -9.6, latest OSC -9.2 dBm, delta +0.4.',
          'kul20-wmk032-01omt: median -9.3 dBm, threshold -9.8, latest OSC -9.5 dBm, delta +0.3.',
          'Circuit MSFT/KUL23-CX5/FIBER CORE/007 is restored.',
        ],
        messages: [
          { channel: 'teams', sender: 'Miles', body: 'Optical power verification passed for both endpoints. Circuit MSFT/KUL23-CX5/FIBER CORE/007 is restored.', kind: 'agent' },
          { channel: 'email', sender: 'Miles', audience: 'Fibre provider', subject: 'Repair verified · incident 606093997', body: 'Repair verification passed. Thank you for your support restoring the circuit.', kind: 'agent' },
        ],
      },
    ] satisfies CustomerZeroScenarioStep[],
    summary: {
      repairTime: '9.5 hours',
      interactions: '14 interactions',
      attempts: '2 repair attempts',
      clarifications: '6 clarification emails',
      owner: 'All coordinated by Miles',
      note: 'Physical work typically takes 4–36 hours; the agent automates alert, isolation, coordination, and restore-to-network.',
    },
  },
  kpis: [
    { value: '+40%', label: 'More incidents handled per person', from: 'Engineers manually drive each incident.', to: 'Engineers enable agents; agents escalate only when stuck.' },
    { value: '25%', label: 'Improvement in fibre-cut time to repair', from: 'A human runs OTDR.', to: 'The agent runs OTDR.' },
    { value: '80%', label: 'Reduction in human OTDR tests', from: 'Human-led OTDR testing.', to: 'Agent-led OTDR testing.' },
    { value: '70%', label: 'Reduction in change-window planning time', from: 'Manual planning and approval preparation.', to: 'Agents propose safe windows and whitelist approval.' },
    { value: '60%', label: 'Time-to-detect improvement', from: 'NOC triage classifies and routes tickets.', to: 'Agents classify and route tickets.' },
    { value: '80%', label: 'Faster root-cause analysis', from: 'Siloed per-supplier EMS/NMS and humans watching screens.', to: 'Unified multivendor APIs.' },
    { value: '40%', label: 'More team time directed to roadmap and AI-enabling technology', from: 'Time consumed by operational work.', to: 'Time invested in technology such as the inline OTDR framework.' },
  ] satisfies CustomerZeroKpi[],
  bridge: [
    { from: 'Niobe', to: 'Network Guardian NOC copilot', path: '/' },
    { from: 'Pal', to: 'Root Cause Analysis agent', path: '/agents' },
    { from: 'Miles', to: 'Autonomous field and fibre repair agent', path: '/scenarios' },
  ],
  whatsNext: [
    { title: 'Multi-agent flywheel', detail: 'NOC Manager, Frontline Engineer, Escalation Engineer' },
    { title: 'Self-building networks', detail: 'Ordering, shipping, commissioning' },
    { title: 'Self-verifying networks', detail: 'Configuration and change management' },
  ],
} as const
