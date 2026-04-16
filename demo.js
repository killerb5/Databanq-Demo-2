document.addEventListener('DOMContentLoaded', () => {
  const screenNames = {
    dashboard: 'Dashboard',
    integrations: 'Connected Systems',
    agents: 'Agent Governance',
    ai: 'AI Governance',
    audit: 'Audit & Compliance',
    usage: 'Usage & Hash Ledger',
    settings: 'Settings'
  };

  const breadcrumbMap = {
    dashboard: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Agent Governance\u00A0\u00A0/\u00A0\u00A0Dashboard',
    integrations: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Connected Systems',
    agents: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Agent Governance',
    ai: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0AI Governance',
    audit: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Audit & Compliance',
    usage: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Usage & Hash Ledger',
    settings: 'Acme Fintech Inc.\u00A0\u00A0/\u00A0\u00A0Settings'
  };

  const navItems = Array.from(document.querySelectorAll('.demo-nav-item[data-screen]'));
  const screens = Array.from(document.querySelectorAll('.screen'));
  const breadcrumb = document.getElementById('demoBreadcrumb');
  const toastEl = document.getElementById('demoToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const liveFeed = document.getElementById('liveFeed');
  const mcpCallFeed = document.getElementById('mcpCallFeed');
  const dashboardAlert = document.getElementById('dashboardAlert');
  const demoMain = document.querySelector('.demo-main');
  const trustGraphBox = document.getElementById('trustGraphBox');
  const connectedTableBody = document.getElementById('connectedTableBody');
  const integrationActionLog = document.getElementById('integrationActionLog');
  const registryActionLog = document.getElementById('registryActionLog');
  const radiusResult = document.getElementById('radiusResult');
  const trustNote = document.getElementById('trustNote');
  const containmentStatus = document.getElementById('containmentStatus');
  const containmentSteps = ['containmentStep1', 'containmentStep2', 'containmentStep3', 'containmentStep4']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const requestForm = document.getElementById('requestIntegrationForm');
  const ledgerTableBody = document.getElementById('ledgerTableBody');
  const ledgerPageSize = document.getElementById('ledgerPageSize');
  const ledgerPageText = document.getElementById('ledgerPageText');
  const ledgerPrev = document.getElementById('ledgerPrev');
  const ledgerNext = document.getElementById('ledgerNext');
  const integrationModalName = document.getElementById('integrationModalName');
  const integrationModalSync = document.getElementById('integrationModalSync');
  const integrationModalAuth = document.getElementById('integrationModalAuth');
  const integrationModalScope = document.getElementById('integrationModalScope');
  const integrationModalActions = document.getElementById('integrationModalActions');
  const agentRegistryBody = document.getElementById('agentRegistryBody');
  const agentRegistryCountBadge = document.getElementById('agentRegistryCountBadge');
  const issueAgentForm = document.getElementById('issueAgentForm');
  const issueAgentName = document.getElementById('issueAgentName');
  const issueAgentType = document.getElementById('issueAgentType');
  const issueAgentPrincipal = document.getElementById('issueAgentPrincipal');
  const issueAgentExpiration = document.getElementById('issueAgentExpiration');
  const issueAgentSubmit = document.getElementById('issueAgentSubmit');
  const issueAgentNameError = document.getElementById('issueAgentNameError');
  const issueAgentScopeError = document.getElementById('issueAgentScopeError');
  const issueAgentScopeGroup = document.getElementById('issueAgentScopeGroup');
  const agentModal = document.getElementById('agentModal');
  const agentModalName = document.getElementById('agentModalName');
  const agentModalMeta = document.getElementById('agentModalMeta');
  const agentModalStatus = document.getElementById('agentModalStatus');
  const agentModalToken = document.getElementById('agentModalToken');
  const agentIdentityDetails = document.getElementById('agentIdentityDetails');
  const agentScopeChips = document.getElementById('agentScopeChips');
  const agentMcpList = document.getElementById('agentMcpList');
  const agentModalActions = document.getElementById('agentModalActions');
  const revokeModalTitle = document.getElementById('revokeModalTitle');
  const trustGraph = document.getElementById('trustGraphSvg');
  const trustTooltip = document.getElementById('trustTooltip');
  const trustNodes = Array.from(document.querySelectorAll('.node-group[data-node]'));
  const trustEdges = Array.from(document.querySelectorAll('.edge[data-edge]'));
  const blastAgentSelector = document.getElementById('agentBlastSelector');
  const blastDiagram = document.getElementById('bullseyeDiagram');
  const blastCenterName = document.getElementById('blastCenterName');
  const blastCenterToken = document.getElementById('blastCenterToken');
  const blastMonitoredRing = document.getElementById('blastMonitoredRing');
  const blastBlockedRing = document.getElementById('blastBlockedRing');
  const runContainmentBtn = document.getElementById('runContainmentBtn');
  const probeBlocked1 = document.getElementById('probeBlocked1');
  const probeBlocked2 = document.getElementById('probeBlocked2');
  const probeMonitored = document.getElementById('probeMonitored');
  const probeBlockedMotion1 = document.getElementById('probeBlockedMotion1');
  const probeBlockedMotion2 = document.getElementById('probeBlockedMotion2');
  const probeMonitoredMotion = document.getElementById('probeMonitoredMotion');

  const getSavedTab = (group, fallback) => {
    try {
      return sessionStorage.getItem(`databanq-active-tab-${group}`) || fallback;
    } catch {
      return fallback;
    }
  };

  const saveActiveTab = (group, value) => {
    try {
      sessionStorage.setItem(`databanq-active-tab-${group}`, value);
    } catch {
      // ignore storage errors in demo mode
    }
  };

  const activeTabs = {
    agent: getSavedTab('agent', 'agent-registry'),
    ai: getSavedTab('ai', 'ai-overview'),
    settings: getSavedTab('settings', 'settings-org')
  };

  const groupToScreen = {
    agent: 'agents',
    ai: 'ai',
    settings: 'settings'
  };

  const screenToGroup = {
    agents: 'agent',
    ai: 'ai',
    settings: 'settings'
  };

  let demoAgentCount = 18;
  let nextAgentTokenId = 72;
  let ledgerRows = [];
  let ledgerPage = 0;
  let containmentRunning = false;
  let pendingRevoke = null;

  const metricConfigs = {
    'Governed Agents': { target: 18 },
    'High-risk Alerts': { target: 2 },
    'AI Governance Score': { target: 91 },
    'Audit Readiness': { target: 87 },
    'Connected Now': { target: 4 },
    'Pending Requests': { target: 1 },
    'Needs Scoped Access': { target: 1 },
    'Catalog Matches': { target: 4 },
    'SOC 2': { target: 87, suffix: '/100' },
    'HIPAA': { target: 34, suffix: '/38' },
    'EU AI Act': { target: 22, suffix: '/27' },
    'Evidence Packs': { target: 6, suffix: ' ready' },
    'Total Events': { target: 9847, format: 'comma' },
    'Hash Verified': { target: 9847, format: 'comma' },
    'Agent Actions': { target: 3241, format: 'comma' },
    'AI Inferences': { target: 6606, format: 'comma' }
  };

  const blastProfiles = {
    'AIT-0041': {
      shortName: 'Underwriting',
      token: 'AIT-0041',
      authorized: ['read:applications', 'write:decisions', 'read:underwriting-rules'],
      monitored: ['read:customer-profile', '(logged)'],
      blocked: ['read:full-PII', 'write:financial-records', 'call:payment-apis', 'spawn:sub-agents']
    },
    'AIT-0038': {
      shortName: 'Contracts',
      token: 'AIT-0038',
      authorized: ['read:contracts', 'write:clause-flags', 'read:legal-playbook'],
      monitored: ['read:counterparty-data', '(logged)'],
      blocked: ['read:full-PII', 'write:financial-records', 'call:payment-apis', 'spawn:sub-agents']
    },
    'AIT-0029': {
      shortName: 'Support',
      token: 'AIT-0029',
      authorized: ['read:tickets', 'write:replies', 'read:knowledge-base'],
      monitored: ['read:customer-profile', '(logged)'],
      blocked: ['read:full-PII', 'write:refund-ledger', 'call:payment-apis', 'spawn:sub-agents']
    },
    'AIT-0063': {
      shortName: 'Fraud AI',
      token: 'AIT-0063',
      authorized: ['read:transactions', 'write:risk-flags', 'read:fraud-rules'],
      monitored: ['read:customer-profile', '(logged)'],
      blocked: ['read:full-PII', 'write:financial-records', 'call:payment-apis', 'spawn:sub-agents']
    }
  };

  const agentDirectory = {
    'RevenueOps Agent': {
      token: 'AIT-0041', status: 'Active', tone: 'ok', model: 'gpt-4o-2024-11-20', type: 'Orchestrator', environment: 'Production',
      owner: 'M. Chen (CTO)', issued: '2026-01-14', expires: '2026-07-13',
      scope: ['read:crm', 'write:notes'], mcpServers: ['crm-mcp', 'audit-mcp'],
      recent: [{ time: '09:41', text: 'Token rotation completed' }, { time: '09:18', text: 'CRM write scope attested' }, { time: '08:54', text: 'No unsigned delegation' }]
    },
    'Contract Reviewer': {
      token: 'AIT-0038', status: 'Active', tone: 'ok', model: 'claude-3-5-sonnet', type: 'Tool-agent', environment: 'Staging',
      owner: 'A. Torres (CCO)', issued: '2026-01-08', expires: '2026-07-07',
      scope: ['read:docs', 'read:legal'], mcpServers: ['doc-retrieval-mcp', 'audit-mcp'],
      recent: [{ time: '09:13', text: 'Legal owner approval confirmed' }, { time: '08:37', text: 'Model lineage reviewed' }, { time: '07:52', text: 'Staging policy pack verified' }]
    },
    'Customer Support AI': {
      token: 'AIT-0029', status: 'Active', tone: 'ok', model: 'gpt-4o-mini-2024-07-18', type: 'Monitor', environment: 'Production',
      owner: 'J. Kim (VP Eng)', issued: '2026-01-20', expires: '2026-07-19',
      scope: ['read:tickets', 'write:replies'], mcpServers: ['doc-retrieval-mcp', 'crm-mcp'],
      recent: [{ time: '08:44', text: 'Consent evidence mapped' }, { time: '08:17', text: 'PII guardrails active' }, { time: '07:58', text: 'Prompt logging enabled' }]
    },
    'Fraud Detection AI': {
      token: 'AIT-0063', status: '⚠ Warning', tone: 'warn', model: 'gpt-4o-2024-11-20', type: 'Monitor', environment: 'Production',
      owner: 'D. Williams', issued: '2026-02-02', expires: '2026-08-01',
      scope: ['read:transactions (review)'], mcpServers: ['audit-mcp'],
      recent: [{ time: '10:02', text: 'Trust escalation path under oversight' }, { time: '09:46', text: 'Critical risk review open' }, { time: '09:12', text: 'Containment controls verified' }]
    },
    'HR Onboarding Bot': {
      token: 'AIT-0055', status: 'Active', tone: 'ok', model: 'gpt-4o-2024-11-20', type: 'Sub-agent', environment: 'Production',
      owner: 'J. Rivera (CCO)', issued: '2026-01-30', expires: '2026-07-29',
      scope: ['read:hr-data', 'write:records'], mcpServers: ['doc-retrieval-mcp'],
      recent: [{ time: '08:32', text: 'Employee onboarding workflow validated' }, { time: '07:41', text: 'HR access renewal approved' }, { time: '07:06', text: 'Retention controls confirmed' }]
    },
    'Legacy Data Agent': {
      token: 'AIT-0019', status: '✕ Revoked', tone: 'risk', model: 'legacy-runtime', type: 'Tool-agent', environment: 'Production',
      owner: 'M. Chen (CTO)', issued: '2025-10-12', expires: '2026-01-10',
      scope: [], mcpServers: [],
      recent: [{ time: '2 days ago', text: 'Token revoked after legacy policy mismatch' }, { time: '3 days ago', text: 'Unsigned activity detected' }, { time: '4 days ago', text: 'Containment policy escalated' }]
    },
    'Compliance Reporter': {
      token: 'AIT-0071', status: 'Active', tone: 'ok', model: 'gpt-4o-2024-11-20', type: 'Orchestrator', environment: 'Production',
      owner: 'A. Torres (CCO)', issued: '2026-02-14', expires: '2026-08-13',
      scope: ['read:audit', 'read:policies'], mcpServers: ['audit-mcp'],
      recent: [{ time: '08:51', text: 'Evidence pack generated' }, { time: '08:29', text: 'Policy references synchronized' }, { time: '08:02', text: 'Board report draft prepared' }]
    },
    'unknown-proc-881': {
      token: 'NONE', status: '🔴 Unverified', tone: 'risk', model: 'Unknown', type: 'Unknown', environment: 'Unregistered',
      owner: 'None', issued: 'Unknown', expires: '—',
      scope: [], mcpServers: [],
      recent: [{ time: '6 min ago', text: 'Process detected without signed token' }, { time: '7 min ago', text: 'Verification workflow queued' }, { time: '8 min ago', text: 'Registry isolation applied' }]
    }
  };

  const toastStack = document.getElementById('toastStack');

  const showToast = (title, description = '', type = 'success') => {
    if (!toastStack) return;
    const icons = { success: '✓', warning: '⚠', error: '✕' };
    const toast = document.createElement('div');
    toast.className = `toast-item ${type === 'success' ? '' : type}`.trim();
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '✓'}</div>
      <div class="toast-copy">
        <div class="toast-title">${title}</div>
        ${description ? `<div class="toast-desc">${description}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close">✕</button>
    `;

    const dismiss = () => {
      toast.classList.remove('show');
      window.setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close')?.addEventListener('click', dismiss);
    toastStack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    window.setTimeout(dismiss, 4000);
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('demo-menu-open');
    }
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (!document.querySelector('.modal.open')) {
      document.body.classList.remove('demo-menu-open');
    }
  };

  const createDownload = (filename, content, type = 'application/json') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const createHtmlDownload = (filename, markup) => {
    createDownload(filename, markup, 'text/html;charset=utf-8');
  };

  const buildAuditReport = () => {
    const generatedAt = new Date().toLocaleDateString();
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Q1 2026 AI Governance Audit Report</title>
<style>
body{font-family:Arial,sans-serif;background:#ffffff;color:#111827;margin:0;padding:32px}
.report{max-width:980px;margin:0 auto;border:1px solid #d1d5db;border-radius:12px;overflow:hidden}
.hero{padding:28px 32px;border-bottom:3px solid #10B981;background:#f8fffb}.hero h1{margin:0 0 8px;font-size:30px;color:#065f46}.hero p{margin:4px 0;color:#374151}.badge{display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid #10B981;color:#065f46;background:#ecfdf5;font-size:12px;font-weight:700}.section{padding:24px 32px}.section h2{margin:0 0 12px;font-size:18px;color:#065f46}.muted{color:#374151;line-height:1.65}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{padding:10px 12px;border:1px solid #d1d5db;text-align:left;font-size:13px}th{background:#f0fdf4;color:#065f46;text-transform:uppercase;letter-spacing:.06em}.footer{padding:18px 32px;background:#f9fafb;color:#4b5563;font-size:12px;border-top:1px solid #d1d5db}
</style>
</head>
<body>
<div class="report">
  <div class="hero">
    <span class="badge">Hash-verified export</span>
    <h1>Q1 2026 AI Governance Audit Report</h1>
    <p>Prepared for Acme Fintech Inc. | Generated by DataBanq</p>
    <p>Date: ${generatedAt} | Signed badge: Hash-verified export</p>
  </div>
  <div class="section">
    <h2>Executive Summary</h2>
    <p class="muted">This report documents the AI governance posture of Acme Fintech Inc. for Q1 2026. DataBanq platform recorded 9,847 governed events across 18 registered AI agents. Compliance coverage: SOC 2 87%, HIPAA 89%, EU AI Act 81%, NIST AI RMF 86%.</p>
  </div>
  <div class="section">
    <h2>Framework Coverage</h2>
    <table>
      <thead><tr><th>Framework</th><th>Coverage</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>SOC 2</td><td>87/100</td><td>In progress</td></tr>
        <tr><td>HIPAA</td><td>34/38</td><td>Review transmission safeguards</td></tr>
        <tr><td>EU AI Act</td><td>22/27</td><td>Human oversight task open</td></tr>
        <tr><td>NIST</td><td>31/36</td><td>Drift monitoring depth</td></tr>
      </tbody>
    </table>
  </div>
  <div class="section">
    <h2>Registered Agents</h2>
    <table>
      <thead><tr><th>Agent</th><th>Token</th><th>Status</th><th>Owner</th></tr></thead>
      <tbody>
        <tr><td>RevenueOps Agent</td><td>AIT-0041</td><td>Active</td><td>M. Chen (CTO)</td></tr>
        <tr><td>Contract Reviewer</td><td>AIT-0038</td><td>Active</td><td>A. Torres (CCO)</td></tr>
        <tr><td>Customer Support AI</td><td>AIT-0029</td><td>Active</td><td>J. Kim (VP Eng)</td></tr>
        <tr><td>Fraud Detection AI</td><td>AIT-0063</td><td>Warning</td><td>D. Williams</td></tr>
      </tbody>
    </table>
  </div>
  <div class="section">
    <h2>Evidence Summary</h2>
    <p class="muted">Agent identity registry: 18 records, all hash-signed.</p>
    <p class="muted">Trust chain review: 42 delegations verified, 0 unsigned.</p>
    <p class="muted">Usage ledger: 9,847 events, tamper-evident.</p>
    <p class="muted">Consent evidence: 4 active records.</p>
  </div>
  <div class="footer">Report generated by DataBanq | databanqtech.com | Confidential</div>
</div>
</body>
</html>`;
  };

  const buildLedgerReport = () => {
    const rows = Array.from(ledgerTableBody?.querySelectorAll('tr') || []).slice(0, 20)
      .map((row) => Array.from(row.children).map((cell) => cell.textContent.trim()).join(' | '))
      .join('\n');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Ledger Appendix</title><style>body{font-family:Arial,sans-serif;background:#f4f7f6;color:#132018;padding:28px}pre{white-space:pre-wrap;background:#fff;border:1px solid #d7e6dd;border-radius:12px;padding:18px;line-height:1.7}h1{margin-top:0}</style></head><body><h1>Usage and Hash Ledger Appendix</h1><p>Signed event export from the DataBanq demo environment.</p><pre>${rows}</pre></body></html>`;
  };

  const buildGovernanceReport = () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Governance Summary</title><style>body{font-family:Arial,sans-serif;background:#f5f8f7;color:#132018;padding:28px}section{background:#fff;border:1px solid #d7e6dd;border-radius:12px;padding:18px;margin-bottom:14px}</style></head><body><section><h1>AI Governance Summary</h1><p>Coverage includes consent evidence, shadow AI monitoring, vendor intelligence, policy enforcement, and the evidence vault.</p></section><section><h2>Current posture</h2><ul><li>Policy score: 94%</li><li>Signed ledger integrity: 100%</li><li>Open tasks: 4 supervised reviews</li></ul></section></body></html>`;

  function countUp(element, target, duration = 1200, suffix = '') {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const applyMetricTargets = () => {
    document.querySelectorAll('.demo-card.kpi').forEach((card) => {
      const label = card.querySelector('.kpi-label')?.textContent.trim();
      const valueEl = card.querySelector('.metric');
      const config = metricConfigs[label];
      if (!valueEl || !config) return;

      valueEl.dataset.target = String(config.target);
      valueEl.dataset.suffix = config.suffix || '';
      valueEl.dataset.format = config.format || '';
      valueEl.dataset.animated = 'false';
      valueEl.textContent = '0';
    });
  };

  const animateMetric = (el) => {
    if (!el || el.dataset.animated === 'true') return;

    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const useComma = el.dataset.format === 'comma';
    el.dataset.animated = 'true';

    if (!useComma) {
      countUp(el, target, 1200, suffix);
      return;
    }

    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const metricObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateMetric(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  const observeMetrics = () => {
    document.querySelectorAll('.kpi-value.metric').forEach((el) => metricObserver.observe(el));
  };

  const updateLocationHash = (screenId) => {
    const group = screenToGroup[screenId];
    const route = group ? activeTabs[group] : screenId;
    history.replaceState(null, '', `#${route}`);
  };

  const activateTab = (group, targetId, updateHash = true) => {
    const groupTabs = Array.from(document.querySelectorAll(`.subtab[data-tab-group="${group}"]`));
    if (!groupTabs.length) return;

    const availableTargets = groupTabs.map((btn) => btn.dataset.tabTarget);
    const nextTarget = availableTargets.includes(targetId) ? targetId : availableTargets[0];
    activeTabs[group] = nextTarget;
    saveActiveTab(group, nextTarget);

    groupTabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tabTarget === nextTarget);
    });

    availableTargets.forEach((paneId) => {
      const pane = document.getElementById(paneId);
      if (pane) pane.classList.toggle('active', paneId === nextTarget);
    });

    if (updateHash && document.getElementById(groupToScreen[group])?.classList.contains('active')) {
      history.replaceState(null, '', `#${nextTarget}`);
    }
  };

  const setScreen = (screenId, updateHash = true) => {
    screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.screen === screenId));

    const group = screenToGroup[screenId];
    if (group) activateTab(group, activeTabs[group], false);

    if (breadcrumb) breadcrumb.textContent = breadcrumbMap[screenId] || breadcrumbMap.dashboard;
    document.title = `${screenNames[screenId] || 'Dashboard'} — DataBanq`;

    if (updateHash) updateLocationHash(screenId);
    if (demoMain) {
      demoMain.classList.add('is-loading');
      window.setTimeout(() => demoMain.classList.remove('is-loading'), 200);
    }
    requestAnimationFrame(observeMetrics);
  };

  const syncRouteFromHash = () => {
    const route = (window.location.hash || '#dashboard').replace('#', '');
    const routeTab = document.querySelector(`.subtab[data-tab-target="${route}"]`);

    if (routeTab) {
      const group = routeTab.dataset.tabGroup;
      const screenId = groupToScreen[group] || 'dashboard';
      activeTabs[group] = route;
      saveActiveTab(group, route);
      setScreen(screenId, false);
      activateTab(group, route, false);
      return;
    }

    setScreen(screenNames[route] ? route : 'dashboard', false);
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => setScreen(item.dataset.screen));
  });

  document.querySelectorAll('[data-screen-jump]').forEach((button) => {
    button.addEventListener('click', () => setScreen(button.dataset.screenJump));
  });

  document.querySelectorAll('.subtab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.tabGroup, tab.dataset.tabTarget, true);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  const formatRelativeTime = (timestamp) => {
    const delta = Math.max(1, Math.round((Date.now() - timestamp) / 1000));
    if (delta < 60) return `${delta} sec ago`;
    const mins = Math.round(delta / 60);
    return `${mins} min ago`;
  };

  const formatClockTime = (timestamp) => new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const dashboardFeedEntries = [
    { timestamp: Date.now() - 45000, html: '<strong>Fraud Detection AI</strong> triggered trust boundary review → compliance' },
    { timestamp: Date.now() - 120000, html: '<strong>Audit evidence</strong> hash committed for workflow WF-204' },
    { timestamp: Date.now() - 240000, html: '<strong>New integration request</strong>: GitHub queued for security sign-off' },
    { timestamp: Date.now() - 420000, html: '<strong>Consent renewal</strong> propagated to downstream model vendors' },
    { timestamp: Date.now() - 660000, html: '<strong>AIT-0041</strong> token rotated and hash-signed to registry' }
  ];

  const mcpFeedEntries = [
    { timestamp: Date.now() - 1000, actor: 'compliance-checker', server: 'audit-mcp', status: '✓ Pass', tone: 'ok' },
    { timestamp: Date.now() - 4000, actor: 'fraud-detection-ai', server: 'payment-gateway-mcp', status: '⚠ Flagged', tone: 'warn' },
    { timestamp: Date.now() - 13000, actor: 'revenue-ops-agent', server: 'crm-mcp', status: '✓ Pass', tone: 'ok' },
    { timestamp: Date.now() - 21000, actor: 'contract-reviewer', server: 'doc-retrieval-mcp', status: '✓ Pass', tone: 'ok' },
    { timestamp: Date.now() - 34000, actor: 'unknown-proc-881', server: 'external-llm-mcp', status: '✕ Blocked', tone: 'risk' },
    { timestamp: Date.now() - 48000, actor: 'fraud-detection-ai', server: 'audit-mcp', status: '✓ Pass', tone: 'ok' },
    { timestamp: Date.now() - 61000, actor: 'customer-support', server: 'crm-mcp', status: '✓ Pass', tone: 'ok' },
    { timestamp: Date.now() - 73000, actor: 'revenue-ops-agent', server: 'doc-retrieval-mcp', status: '✓ Pass', tone: 'ok' }
  ];

  const renderDashboardFeed = () => {
    if (!liveFeed) return;
    liveFeed.innerHTML = dashboardFeedEntries.map((entry, index) => `
      <div class="feed-row ${entry.isNew ? 'feed-entry-new' : ''}"${index === 0 && entry.isNew ? ' style="animation:flashNew .4s ease;"' : ''}>
        <div class="feed-time">${formatRelativeTime(entry.timestamp)}</div>
        <div class="feed-text">${entry.html}</div>
      </div>
    `).join('');
    dashboardFeedEntries.forEach((entry) => { entry.isNew = false; });
  };

  const renderMcpFeed = () => {
    if (!mcpCallFeed) return;
    mcpCallFeed.innerHTML = mcpFeedEntries.map((entry, index) => `
      <div class="feed-row ${entry.isNew ? 'feed-entry-new' : ''}"${index === 0 && entry.isNew ? ' style="animation:flashNew .4s ease;"' : ''}>
        <div class="feed-time">${formatClockTime(entry.timestamp)}</div>
        <div class="feed-text"><strong>${entry.actor}</strong> → ${entry.server} <span class="status-badge ${entry.tone}">${entry.status}</span></div>
      </div>
    `).join('');
    mcpFeedEntries.forEach((entry) => { entry.isNew = false; });
  };

  const addFeedItem = (text, timestamp = Date.now()) => {
    dashboardFeedEntries.unshift({ timestamp, html: text, isNew: true });
    while (dashboardFeedEntries.length > 8) dashboardFeedEntries.pop();
    renderDashboardFeed();
  };

  const addMcpFeedItem = (actor, server, status, tone) => {
    mcpFeedEntries.unshift({ timestamp: Date.now(), actor, server, status, tone, isNew: true });
    while (mcpFeedEntries.length > 12) mcpFeedEntries.pop();
    renderMcpFeed();
  };

  const addActivityRow = (container, text) => {
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'feed-row';
    row.innerHTML = `<div class="feed-time">now</div><div class="feed-text">${text}</div>`;
    container.prepend(row);
    while (container.children.length > 6) {
      container.removeChild(container.lastElementChild);
    }
  };

  const addConnectedRow = (name, type, status = 'Connected', scope = 'Requested scope', lastSync = 'just now') => {
    if (!connectedTableBody) return;
    const row = document.createElement('tr');
    const badgeClass = status === 'Pending Review' ? 'warn' : 'ok';
    row.innerHTML = `
      <td>${name}</td>
      <td>${type}</td>
      <td><span class="status-badge ${badgeClass}">${status}</span></td>
      <td>${scope}</td>
      <td>${lastSync}</td>
      <td><button class="small-btn" data-action="integration-settings" data-name="${name}">Settings</button></td>
    `;
    connectedTableBody.prepend(row);
  };

  const updateRegistryCount = () => {
    if (agentRegistryCountBadge) {
      agentRegistryCountBadge.textContent = `${demoAgentCount} registered`;
    }
  };

  const defaultExpiryDate = () => {
    const dt = new Date();
    dt.setDate(dt.getDate() + 90);
    return dt.toISOString().slice(0, 10);
  };

  const resetIssueAgentForm = () => {
    issueAgentForm?.reset();
    if (issueAgentExpiration) issueAgentExpiration.value = defaultExpiryDate();
    issueAgentName?.classList.remove('field-error');
    issueAgentScopeGroup?.classList.remove('field-error');
    if (issueAgentNameError) issueAgentNameError.style.display = 'none';
    if (issueAgentScopeError) issueAgentScopeError.style.display = 'none';
    if (issueAgentSubmit) {
      issueAgentSubmit.disabled = false;
      issueAgentSubmit.innerHTML = 'Sign &amp; Register Token →';
    }
  };

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const getAgentProfileFromRow = (row, fallbackName) => {
    const name = row?.children?.[0]?.textContent.trim() || fallbackName;
    const token = row?.children?.[1]?.textContent.trim() || agentDirectory[name]?.token || 'AIT-0000';
    const statusText = row?.children?.[2]?.textContent.trim() || agentDirectory[name]?.status || 'Active';
    const scopeText = row?.children?.[3]?.textContent.trim() || '';
    const owner = row?.children?.[4]?.textContent.trim() || agentDirectory[name]?.owner || 'Unassigned';
    const lastActive = row?.children?.[5]?.textContent.trim() || 'Just now';
    const base = agentDirectory[name] || {};
    const tone = statusText.toLowerCase().includes('warning') ? 'warn' : (statusText.toLowerCase().includes('revoked') || statusText.toLowerCase().includes('unverified')) ? 'risk' : 'ok';

    return {
      name,
      token,
      status: statusText,
      tone,
      model: base.model || 'gpt-4o-2024-11-20',
      type: base.type || 'Orchestrator',
      environment: base.environment || 'Production',
      owner,
      issued: base.issued || new Date().toISOString().slice(0, 10),
      expires: base.expires || defaultExpiryDate(),
      scope: scopeText && scopeText !== '—' ? scopeText.split(',').map((item) => item.trim()).filter(Boolean) : (base.scope || []),
      mcpServers: base.mcpServers || ['audit-mcp'],
      recent: base.recent || [{ time: 'Just now', text: 'Registry review complete' }],
      lastActive
    };
  };

  const renderAgentRecord = (profile) => {
    if (!agentModal) return;
    agentModal.dataset.name = profile.name;
    agentModal.dataset.token = profile.token;

    if (agentModalName) agentModalName.textContent = profile.name;
    if (agentModalMeta) agentModalMeta.textContent = `${profile.type} · ${profile.environment} · Last active ${profile.lastActive}`;
    if (agentModalStatus) {
      agentModalStatus.textContent = profile.status;
      agentModalStatus.className = `status-badge ${profile.tone}`;
    }
    if (agentModalToken) agentModalToken.textContent = profile.token;
    if (agentIdentityDetails) {
      agentIdentityDetails.innerHTML = [
        ['Model', profile.model],
        ['Type', profile.type],
        ['Environment', profile.environment],
        ['Owner', profile.owner],
        ['Issued date', profile.issued],
        ['Expires', profile.expires]
      ].map(([label, value]) => `<div class="status-item"><strong>${label}</strong><span>${value}</span></div>`).join('');
    }
    if (agentScopeChips) {
      agentScopeChips.innerHTML = profile.scope.length
        ? profile.scope.map((scope) => `<span class="chip ok">${scope}</span>`).join('')
        : '<span class="chip risk">No authorized scope</span>';
    }
    if (agentMcpList) {
      agentMcpList.innerHTML = profile.mcpServers.length
        ? profile.mcpServers.map((server) => `<div class="status-item"><strong>${server}</strong><span>Allowed</span></div>`).join('')
        : '<div class="status-item"><strong>None</strong><span>No server access</span></div>';
    }
    if (agentModalActions) {
      agentModalActions.innerHTML = profile.recent.slice(0, 3).map((item) => `<div class="status-item"><strong>${item.time}</strong><span>${item.text}</span></div>`).join('');
    }
  };

  const prependRegistryRow = ({ name, token, principal, scopes }) => {
    if (!agentRegistryBody) return null;
    const row = document.createElement('tr');
    row.className = 'registry-enter';
    row.innerHTML = `
      <td><strong class="agent-name">${name}</strong></td>
      <td class="mono">${token}</td>
      <td><span class="status-badge ok">Active</span></td>
      <td>${scopes.join(', ')}</td>
      <td>${principal}</td>
      <td>Just now</td>
      <td><button class="small-btn" data-action="view-agent" data-name="${name}">View</button> <button class="small-btn" data-action="revoke-agent" data-name="${name}" data-token="${token}">Revoke</button></td>
    `;
    agentRegistryBody.prepend(row);
    requestAnimationFrame(() => row.classList.add('registry-enter-active'));
    window.setTimeout(() => row.classList.remove('registry-enter', 'registry-enter-active'), 360);
    return row;
  };

  const applyRevokeState = ({ name, token, row }) => {
    if (!row) return;
    row.classList.add('registry-revoked');
    row.classList.remove('registry-warning', 'registry-unverified');

    const badge = row.children[2]?.querySelector('.status-badge');
    if (badge) {
      badge.className = 'status-badge risk';
      badge.textContent = '✕ Revoked';
    }

    const actionsCell = row.children[6];
    if (actionsCell) {
      actionsCell.innerHTML = `<button class="small-btn" data-action="view-agent" data-name="${name}">View</button>`;
    }

    if (agentDirectory[name]) {
      agentDirectory[name].status = '✕ Revoked';
      agentDirectory[name].tone = 'risk';
      agentDirectory[name].recent = [{ time: 'Just now', text: `${token} revoked and invalidated` }, ...(agentDirectory[name].recent || [])];
    }

    if (agentModal?.dataset.token === token) {
      if (agentModalStatus) {
        agentModalStatus.textContent = '✕ Revoked';
        agentModalStatus.className = 'status-badge risk';
      }
    }
  };

  const openRevokeDialog = ({ name, token, row }) => {
    pendingRevoke = { name, token, row };
    if (revokeModalTitle) revokeModalTitle.textContent = `Revoke ${token}?`;
    openModal('revokeConfirmModal');
  };

  const setBlastProfile = (token) => {
    const profile = blastProfiles[token] || blastProfiles['AIT-0041'];
    if (!blastDiagram) return;

    blastDiagram.classList.add('updating');
    window.setTimeout(() => {
      if (blastCenterName) blastCenterName.textContent = profile.shortName;
      if (blastCenterToken) blastCenterToken.textContent = profile.token;

      profile.authorized.forEach((value, index) => {
        const el = document.getElementById(`authText${index + 1}`);
        if (el) el.textContent = value;
      });
      profile.monitored.forEach((value, index) => {
        const el = document.getElementById(`monText${index + 1}`);
        if (el) el.textContent = value;
      });
      profile.blocked.forEach((value, index) => {
        const el = document.getElementById(`blockText${index + 1}`);
        if (el) el.textContent = value;
      });

      blastDiagram.classList.remove('updating');
    }, 120);
  };

  const setContainmentRowState = (row, state) => {
    if (!row) return;
    const badge = row.querySelector('.status-badge');
    if (!badge) return;

    const states = {
      awaiting: { text: '—', className: 'status-awaiting' },
      running: { text: 'Testing...', className: 'status-running' },
      blocked: { text: '✕ Blocked', className: 'status-blocked' },
      passed: { text: '✓ Contained', className: 'status-passed' }
    };

    const next = states[state] || states.awaiting;
    badge.className = `status-badge sim-status ${next.className}`;
    badge.textContent = next.text;
  };

  const clearProbeDots = () => {
    [probeBlocked1, probeBlocked2, probeMonitored].forEach((probe) => {
      if (probe) probe.style.opacity = '0';
    });
  };

  const triggerContainmentProbe = (type) => {
    clearProbeDots();

    const configs = {
      blocked1: { probe: probeBlocked1, motion: probeBlockedMotion1, ring: blastBlockedRing, ringClass: 'blocked-ring-flash' },
      blocked2: { probe: probeBlocked2, motion: probeBlockedMotion2, ring: blastBlockedRing, ringClass: 'blocked-ring-flash' },
      monitored: { probe: probeMonitored, motion: probeMonitoredMotion, ring: blastMonitoredRing, ringClass: 'monitored-ring-flash' }
    };

    const selected = configs[type];
    if (!selected?.probe || !selected?.motion) return;

    if (selected.ring) {
      selected.ring.classList.remove('blocked-ring-flash', 'monitored-ring-flash');
      void selected.ring.getBBox();
      selected.ring.classList.add(selected.ringClass);
      window.setTimeout(() => selected.ring?.classList.remove(selected.ringClass), 500);
    }

    selected.probe.style.opacity = '1';
    selected.probe.removeAttribute('transform');
    try {
      selected.motion.beginElement();
    } catch {
      // animation begin unsupported
    }
    window.setTimeout(() => {
      selected.probe.style.opacity = '0';
    }, 760);
  };

  const resetContainmentSimulation = () => {
    containmentSteps.forEach((row) => setContainmentRowState(row, 'awaiting'));
    clearProbeDots();
    blastBlockedRing?.classList.remove('blocked-ring-flash');
    blastMonitoredRing?.classList.remove('monitored-ring-flash');

    if (containmentStatus) {
      containmentStatus.textContent = 'Ready';
      containmentStatus.className = 'status-badge blue';
    }
    if (radiusResult) {
      radiusResult.textContent = 'Select an agent to inspect its live access envelope.';
    }
    if (runContainmentBtn) {
      runContainmentBtn.disabled = false;
      runContainmentBtn.textContent = 'Run Containment Test';
    }
    if (blastAgentSelector) blastAgentSelector.disabled = false;
    containmentRunning = false;
  };

  const runContainmentSimulation = async () => {
    if (containmentRunning) return;
    containmentRunning = true;
    resetContainmentSimulation();
    containmentRunning = true;

    const token = blastAgentSelector?.value || 'AIT-0041';

    if (containmentStatus) {
      containmentStatus.textContent = 'Testing';
      containmentStatus.className = 'status-badge warn';
    }
    if (runContainmentBtn) {
      runContainmentBtn.disabled = true;
      runContainmentBtn.textContent = 'Running simulation...';
    }
    if (blastAgentSelector) blastAgentSelector.disabled = true;

    setContainmentRowState(containmentSteps[0], 'running');
    triggerContainmentProbe('blocked1');
    await wait(800);

    setContainmentRowState(containmentSteps[0], 'blocked');
    showToast('🚫 Blocked', `write:financial-records is outside ${token} authorized scope.`);
    await wait(600);

    setContainmentRowState(containmentSteps[1], 'running');
    triggerContainmentProbe('blocked2');
    await wait(600);

    setContainmentRowState(containmentSteps[1], 'blocked');
    showToast('🚫 Blocked', 'read:full-PII exceeds blast radius.');
    await wait(600);

    setContainmentRowState(containmentSteps[2], 'running');
    triggerContainmentProbe('monitored');
    await wait(600);

    setContainmentRowState(containmentSteps[2], 'passed');
    showToast('✓ Escalation contained', 'Escalation routed through compliance review.');
    await wait(600);

    setContainmentRowState(containmentSteps[3], 'running');
    await wait(400);

    setContainmentRowState(containmentSteps[3], 'passed');
    showToast('✓ Ledger proof recorded', 'All actions hash-signed to tamper-evident ledger.');
    await wait(600);

    if (containmentStatus) {
      containmentStatus.textContent = 'Contained';
      containmentStatus.className = 'status-badge ok';
    }
    if (radiusResult) {
      radiusResult.innerHTML = 'Simulation complete. 2 attempts blocked · 2 routed to compliance. <a href="#" data-action="reset-simulation">Reset</a>';
    }
    if (runContainmentBtn) {
      runContainmentBtn.disabled = false;
      runContainmentBtn.textContent = 'Run Containment Test';
    }
    if (blastAgentSelector) blastAgentSelector.disabled = false;
    containmentRunning = false;
  };

  const positionTrustTooltip = (event) => {
    if (!trustTooltip || trustTooltip.style.display !== 'block') return;
    const left = Math.max(12, Math.min(event.clientX - (trustTooltip.offsetWidth / 2), window.innerWidth - trustTooltip.offsetWidth - 12));
    const top = Math.max(12, event.clientY - trustTooltip.offsetHeight - 16);
    trustTooltip.style.left = `${left}px`;
    trustTooltip.style.top = `${top}px`;
  };

  const showTrustTooltip = (event, node) => {
    if (!trustTooltip) return;
    trustTooltip.innerHTML = `
      <strong>${node.dataset.label}</strong>
      <div style="color:#86EFAC;font-family:ui-monospace,SFMono-Regular,monospace;margin-bottom:4px;">${node.dataset.token}</div>
      <div>Owner: ${node.dataset.owner}</div>
      <div>Status: ${node.dataset.status}</div>
      <div>Last active: ${node.dataset.last}</div>
    `;
    trustTooltip.style.display = 'block';
    trustTooltip.setAttribute('aria-hidden', 'false');
    positionTrustTooltip(event);
  };

  const hideTrustTooltip = () => {
    if (!trustTooltip) return;
    trustTooltip.style.display = 'none';
    trustTooltip.setAttribute('aria-hidden', 'true');
  };

  const setTrustSelection = (nodes = [], edges = []) => {
    if (!trustGraph) return;
    const hasSelection = nodes.length > 0 || edges.length > 0;
    trustGraph.classList.toggle('dimmed', hasSelection);

    trustNodes.forEach((node) => {
      node.classList.toggle('active-node', nodes.includes(node.dataset.node));
    });

    trustEdges.forEach((edge) => {
      edge.classList.toggle('active-edge', edges.includes(edge.dataset.edge));
    });
  };

  const resetTrustSelection = () => setTrustSelection();

  trustNodes.forEach((node) => {
    node.addEventListener('mouseenter', (event) => showTrustTooltip(event, node));
    node.addEventListener('mousemove', positionTrustTooltip);
    node.addEventListener('mouseleave', hideTrustTooltip);
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      const nodeId = node.dataset.node;
      const isAlreadySolo = trustGraph?.classList.contains('dimmed')
        && node.classList.contains('active-node')
        && trustNodes.filter((item) => item.classList.contains('active-node')).length === 1;

      if (isAlreadySolo) {
        resetTrustSelection();
        return;
      }

      setTrustSelection([nodeId]);
    });
  });

  if (trustGraph) {
    trustGraph.addEventListener('click', (event) => {
      if (event.target === trustGraph || event.target.id === 'trustGraphBg') {
        resetTrustSelection();
      }
    });
  }

  if (blastAgentSelector) {
    setBlastProfile(blastAgentSelector.value);
    blastAgentSelector.addEventListener('change', () => {
      resetContainmentSimulation();
      setBlastProfile(blastAgentSelector.value);
    });
  }

  if (issueAgentForm) {
    resetIssueAgentForm();
    issueAgentForm.addEventListener('submit', async (submitEvent) => {
      submitEvent.preventDefault();

      const selectedScopes = Array.from(issueAgentForm.querySelectorAll('input[name="scope"]:checked')).map((input) => input.value);
      const selectedMcps = Array.from(issueAgentForm.querySelectorAll('input[name="mcp"]:checked')).map((input) => input.value);
      const name = issueAgentName?.value.trim() || '';

      issueAgentName?.classList.remove('field-error');
      issueAgentScopeGroup?.classList.remove('field-error');
      if (issueAgentNameError) issueAgentNameError.style.display = 'none';
      if (issueAgentScopeError) issueAgentScopeError.style.display = 'none';

      let hasError = false;
      if (!name) {
        hasError = true;
        issueAgentName?.classList.add('field-error');
        if (issueAgentNameError) issueAgentNameError.style.display = 'block';
      }
      if (!selectedScopes.length) {
        hasError = true;
        issueAgentScopeGroup?.classList.add('field-error');
        if (issueAgentScopeError) issueAgentScopeError.style.display = 'block';
      }
      if (hasError) return;

      if (issueAgentSubmit) {
        issueAgentSubmit.disabled = true;
        issueAgentSubmit.innerHTML = '<span class="spin">◌</span> Signing token...';
      }

      await wait(800);

      const token = `AIT-${String(nextAgentTokenId).padStart(4, '0')}`;
      nextAgentTokenId += 1;
      demoAgentCount += 1;
      updateRegistryCount();

      const principal = issueAgentPrincipal?.value || 'Auto-policy';
      const agentType = issueAgentType?.value || 'Orchestrator';
      const expiration = issueAgentExpiration?.value || defaultExpiryDate();
      const newRow = prependRegistryRow({ name, token, principal, scopes: selectedScopes });

      agentDirectory[name] = {
        token,
        status: 'Active',
        tone: 'ok',
        model: 'gpt-4o-2024-11-20',
        type: agentType,
        environment: 'Production',
        owner: principal,
        issued: new Date().toISOString().slice(0, 10),
        expires: expiration,
        scope: selectedScopes,
        mcpServers: selectedMcps,
        recent: [
          { time: 'Just now', text: `${token} signed and registered to the hash ledger` },
          { time: 'Just now', text: `${agentType} permissions issued` },
          { time: 'Just now', text: 'Initial registry attestation complete' }
        ]
      };

      closeModal('issueAgentModal');
      resetIssueAgentForm();

      addActivityRow(registryActionLog, `<strong>Agent ${name}</strong> issued token ${token}.`);
      addFeedItem(`<strong>Agent ${name}</strong> issued token ${token}.`);
      prependLedgerEvent(`EVT-${9900 + demoAgentCount}`, 'Agent', name, 'Identity issuance', 'Pass', Math.random().toString(16).slice(2, 10));
      showToast(`✓ ${token} signed and registered to the hash ledger.`, '');

      if (newRow) {
        const button = newRow.querySelector('[data-action="view-agent"]');
        button?.focus();
      }
    });
  }

  const refreshLedgerRows = () => {
    ledgerRows = Array.from(ledgerTableBody?.querySelectorAll('tr') || []);
    const size = Number(ledgerPageSize?.value || 10);
    const totalPages = Math.max(1, Math.ceil(ledgerRows.length / size));
    ledgerPage = Math.max(0, Math.min(ledgerPage, totalPages - 1));

    ledgerRows.forEach((row, index) => {
      const start = ledgerPage * size;
      const end = start + size;
      row.style.display = index >= start && index < end ? '' : 'none';
    });

    if (ledgerPageText) {
      ledgerPageText.textContent = `Showing page ${ledgerPage + 1} of ${totalPages} · ${ledgerRows.length} total events`;
    }
    if (ledgerPrev) ledgerPrev.disabled = ledgerPage === 0;
    if (ledgerNext) ledgerNext.disabled = ledgerPage >= totalPages - 1;
  };

  const prependLedgerEvent = (eventId, type, actor, target, policy, hash) => {
    if (!ledgerTableBody) return;
    const row = document.createElement('tr');
    const tone = policy === 'Pass' ? 'ok' : policy === 'Warn' ? 'warn' : 'risk';
    row.innerHTML = `
      <td class="mono">${eventId}</td>
      <td><span class="status-badge ${tone}">${type}</span></td>
      <td>${actor}</td>
      <td>${target}</td>
      <td>${policy}</td>
      <td class="mono">${hash}</td>
    `;
    ledgerTableBody.prepend(row);
    ledgerPage = 0;
    refreshLedgerRows();
  };

  const addChatMessage = (who, text) => {
    if (!chatBox) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${who}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const botReplyFor = (message) => {
    const lower = message.toLowerCase();
    if (/(trust|delegation|a2a)/.test(lower)) {
      return 'The Trust Graph shows every agent-to-agent delegation chain in your environment. Green edges are cryptographically signed authorized handoffs. Amber edges are flagged paths requiring human review before any downstream action can proceed. Navigate to Agent Governance → Trust Graph to see the current state.';
    }
    if (/(blast|radius|scope|access)/.test(lower)) {
      return 'Blast Radius Control limits what each agent can touch — per task, not per lifetime. The bullseye diagram shows authorized (green), monitored (amber), and hard-blocked (red) zones for the selected agent. Run the containment simulator to see it block unauthorized access attempts in real time.';
    }
    if (/(audit|export|download|report)/.test(lower)) {
      return 'Your Q1 2026 audit package is ready. Go to Audit & Compliance and click Open Audit Pack to preview the regulator-ready export. Click Download Official Report to save it. The report includes SOC 2, HIPAA, EU AI Act, and NIST coverage with signed evidence from the hash ledger.';
    }
    if (/(mcp|server|tool call)/.test(lower)) {
      return 'MCP Server Governance tracks every Model Context Protocol server your agents can invoke. Each server has an authorized agent allowlist, call logging, and policy enforcement. Navigate to Agent Governance → MCP Governance to see the live call feed and server risk classifications.';
    }
    if (/(consent|privacy|data)/.test(lower)) {
      return 'The Consent Registry tracks lawful use records for every AI data interaction. DataBanq supports four consent types: Explicit, Implied, Inferred, and Contractual. Records nearing expiry are flagged automatically for renewal. Navigate to AI Governance → Consent Registry to review the current state.';
    }
    return 'I can help you navigate the demo. Try asking about: trust graph, blast radius, audit exports, MCP governance, or consent registry.';
  };

  const sendChat = (customText) => {
    const text = (customText || chatInput?.value || '').trim();
    if (!text) return;
    addChatMessage('user', text);
    if (chatInput) chatInput.value = '';
    setTimeout(() => addChatMessage('bot', botReplyFor(text)), 300);
  };

  document.querySelectorAll('[data-chat-prompt]').forEach((button) => {
    button.addEventListener('click', () => sendChat(button.dataset.chatPrompt));
  });

  if (chatInput) {
    chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendChat();
      }
    });
  }

  if (ledgerPageSize) {
    ledgerPageSize.addEventListener('change', () => {
      ledgerPage = 0;
      refreshLedgerRows();
    });
  }

  if (ledgerPrev) {
    ledgerPrev.addEventListener('click', () => {
      ledgerPage -= 1;
      refreshLedgerRows();
    });
  }

  if (ledgerNext) {
    ledgerNext.addEventListener('click', () => {
      ledgerPage += 1;
      refreshLedgerRows();
    });
  }

  if (requestForm) {
    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(requestForm);
      const system = data.get('system');
      const type = data.get('type');
      addConnectedRow(system, type, 'Pending Review', 'Awaiting scoped approval');
      closeModal('requestModal');
      requestForm.reset();
      addActivityRow(integrationActionLog, `<strong>${system}</strong> request created with pending scoped approval.`);
      addFeedItem(`<strong>${system}</strong> integration request submitted for review.`);
      showToast('Integration request submitted', `${system} was added to the review queue.`);
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case 'open-support':
        openModal('supportModal');
        showToast('Platform Guide opened', 'Quick help is ready for navigation, exports, and controls.');
        break;
      case 'open-audit':
        openModal('auditModal');
        showToast('Audit pack ready', 'The official report preview is open.');
        break;
      case 'open-catalog':
        openModal('catalogModal');
        break;
      case 'open-request-integration':
        openModal('requestModal');
        break;
      case 'dismiss-alert':
        if (dashboardAlert) dashboardAlert.style.display = 'none';
        break;
      case 'review-trust-now':
        setScreen('agents');
        activateTab('agent', 'agent-trust');
        setTrustSelection(['fraud-ai', 'case-escalator'], ['fraud-case-review']);
        requestAnimationFrame(() => trustGraphBox?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        showToast('Trust review opened', 'The high-risk delegation path is now in focus.');
        break;
      case 'open-agent-registry':
        setScreen('agents');
        activateTab('agent', 'agent-registry');
        requestAnimationFrame(() => agentRegistryBody?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        break;
      case 'open-ai-overview':
        setScreen('ai');
        activateTab('ai', 'ai-overview');
        requestAnimationFrame(() => demoMain?.scrollTo({ top: 0, behavior: 'smooth' }));
        break;
      case 'open-containment':
        setScreen('agents');
        activateTab('agent', 'agent-blast');
        requestAnimationFrame(() => runContainmentBtn?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        break;
      case 'run-radius-test':
        runContainmentSimulation().then(() => {
          prependLedgerEvent(`EVT-${9900 + demoAgentCount}`, 'Agent', 'Containment Simulator', 'Blocked overreach drill', 'Pass', Math.random().toString(16).slice(2, 10));
          addActivityRow(registryActionLog, '<strong>Containment test</strong> completed and signed to the registry.');
          addFeedItem('<strong>Containment test</strong> completed with no permission leakage.');
        });
        break;
      case 'trust-audit':
        if (trustNote) {
          trustNote.textContent = 'Trust boundary evidence has been queued for formal audit review and export.';
        }
        addActivityRow(registryActionLog, '<strong>Trust review</strong> launched for the fraud escalation path.');
        addFeedItem('<strong>Trust boundary audit</strong> launched for the fraud escalation path.');
        setScreen('audit');
        showToast('Audit & Compliance opened', 'Framework evidence for the trust path is ready for review.');
        break;
      case 'focus-risk-path':
        setScreen('agents');
        activateTab('agent', 'agent-trust');
        setTrustSelection(['fraud-ai', 'case-escalator'], ['fraud-case-review']);
        if (trustNote) {
          trustNote.textContent = 'Focused the high-risk path: Fraud AI to Case Escalator. Recommendation: require a second human approval on resolution actions.';
        }
        showToast('High-risk path focused', 'The amber review edge is now highlighted.');
        break;
      case 'export-governance':
        createHtmlDownload('databanq-governance-summary.html', buildGovernanceReport());
        showToast('Governance report exported', 'A styled governance summary was downloaded.');
        break;
      case 'download-report': {
        const trigger = target;
        if (trigger) {
          trigger.disabled = true;
          trigger.innerHTML = '<span class="spin">◌</span> Generating report...';
        }
        window.setTimeout(() => {
          createHtmlDownload('DataBanq-Q1-2026-Audit-Report.html', buildAuditReport());
          showToast('Audit report downloaded', 'The official compliance report was generated and exported.', 'success');
          if (trigger) {
            trigger.disabled = false;
            trigger.textContent = 'Download Official Report';
          }
        }, 1000);
        break;
      }
      case 'verify-ledger':
        showToast('Ledger verified', 'All visible hashes passed integrity checks.');
        break;
      case 'export-ledger':
        createHtmlDownload('databanq-ledger-appendix.html', buildLedgerReport());
        showToast('Ledger export complete', 'A styled ledger appendix was downloaded.');
        break;
      case 'save-settings': {
        const trigger = target;
        if (trigger) {
          trigger.disabled = true;
          trigger.innerHTML = '<span class="spin">◌</span> Saving...';
        }
        window.setTimeout(() => {
          showToast('✓ Settings saved successfully.', '', 'success');
          if (trigger) {
            trigger.disabled = false;
            trigger.textContent = 'Save Changes';
          }
        }, 600);
        break;
      }
      case 'integration-settings': {
        const profiles = {
          Salesforce: { sync: 'Every 5 minutes', auth: 'Scoped OAuth', scope: 'Read leads + governed notes', actions: ['Write-note scope approved', 'Credential rotation completed'] },
          Okta: { sync: 'Every 5 minutes', auth: 'Service Principal', scope: 'Users + groups + roles', actions: ['Role sync healthy', 'Signer key rotated today'] },
          Slack: { sync: 'Every 15 minutes', auth: 'Scoped OAuth', scope: 'Alerts only', actions: ['Alert routing narrowed to compliance', 'No unresolved issues'] },
          Snowflake: { sync: 'Hourly', auth: 'API Key Vault', scope: 'Read only', actions: ['Write scope denied', 'Residency control verified'] }
        };
        const name = target.dataset.name;
        const profile = profiles[name] || { sync: 'Hourly', auth: 'Scoped OAuth', scope: 'Read + governed alerting', actions: ['Connector reviewed', 'Awaiting next sync'] };

        if (integrationModalName) integrationModalName.value = name;
        if (integrationModalSync) integrationModalSync.value = profile.sync;
        if (integrationModalAuth) integrationModalAuth.value = profile.auth;
        if (integrationModalScope) integrationModalScope.value = profile.scope;
        if (integrationModalActions) {
          integrationModalActions.innerHTML = profile.actions.map((item) => `<div class="status-item"><strong>${name}</strong><span>${item}</span></div>`).join('');
        }
        openModal('integrationSettingsModal');
        showToast(`${name} settings opened`, 'Connector policy and scope controls are ready.');
        break;
      }
      case 'save-integration-settings': {
        const name = integrationModalName?.value || 'Connector';
        addActivityRow(integrationActionLog, `<strong>${name}</strong> settings updated and signed to the registry.`);
        addFeedItem(`<strong>${name}</strong> connector settings saved and sync policy refreshed.`);
        closeModal('integrationSettingsModal');
        showToast('Integration settings saved', 'Connector policy and sync rules were updated.');
        break;
      }
      case 'sync-all-integrations':
        addActivityRow(integrationActionLog, '<strong>Full sync</strong> executed for all approved connectors.');
        addFeedItem('<strong>Connector sync</strong> completed across governed systems.');
        showToast('Full sync complete', 'Connected systems were revalidated and refreshed.');
        break;
      case 'export-registry-log': {
        const items = [integrationActionLog, registryActionLog]
          .flatMap((container) => Array.from(container?.querySelectorAll('.feed-text') || []).map((el) => `<li>${el.textContent}</li>`))
          .join('');
        createHtmlDownload('databanq-registry-actions.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Registry Actions</title><style>body{font-family:Arial,sans-serif;background:#f5f8f7;color:#132018;padding:28px}main{background:#fff;border:1px solid #d7e6dd;border-radius:12px;padding:18px}</style></head><body><main><h1>Registry Actions Report</h1><p>Recent identity and connector governance activity.</p><ul>${items}</ul></main></body></html>`);
        showToast('Registry log exported', 'A clean action log report was downloaded.');
        break;
      }
      case 'connect-catalog': {
        const name = target.dataset.name;
        const type = target.dataset.type;
        addConnectedRow(name, type, 'Connected', 'Read + alert scope');
        addActivityRow(integrationActionLog, `<strong>${name}</strong> connected from the catalog with governed scope.`);
        target.disabled = true;
        target.textContent = 'Connected';
        addFeedItem(`<strong>${name}</strong> connected from the integration catalog.`);
        showToast('Integration connected', `${name} is now part of the governed workspace.`);
        break;
      }
      case 'view-agent': {
        const name = target.dataset.name;
        const row = target.closest('tr');
        const profile = getAgentProfileFromRow(row, name);
        renderAgentRecord(profile);
        openModal('agentModal');
        showToast(`${name} opened`, 'Agent identity, scope, and recent registry activity are available for review.');
        break;
      }
      case 'download-agent-summary': {
        const name = agentModalName?.textContent || 'Agent';
        const token = agentModalToken?.textContent || 'AIT-0000';
        const meta = agentModalMeta?.textContent || 'Governed profile';
        createHtmlDownload('databanq-agent-summary.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Agent Summary</title><style>body{font-family:Arial,sans-serif;background:#f5f8f7;color:#132018;padding:28px}main{background:#fff;border:1px solid #d7e6dd;border-radius:12px;padding:18px}</style></head><body><main><h1>${name}</h1><p><strong>${token}</strong></p><p>${meta}</p><p>This summary includes governance posture, trust review status, and recent registry actions.</p></main></body></html>`);
        showToast('Agent summary downloaded', 'The selected agent record was exported.');
        break;
      }
      case 'issue-agent':
        resetIssueAgentForm();
        openModal('issueAgentModal');
        break;
      case 'revoke-agent': {
        openRevokeDialog({
          name: target.dataset.name,
          token: target.dataset.token,
          row: target.closest('tr')
        });
        break;
      }
      case 'modal-revoke-agent': {
        const name = agentModal?.dataset.name || agentModalName?.textContent || 'Agent';
        const token = agentModal?.dataset.token || agentModalToken?.textContent || 'AIT-0000';
        const row = Array.from(agentRegistryBody?.querySelectorAll('tr') || []).find((entry) => entry.children[1]?.textContent.trim() === token);
        openRevokeDialog({ name, token, row });
        break;
      }
      case 'confirm-revoke-agent':
        if (pendingRevoke) {
          applyRevokeState(pendingRevoke);
          addActivityRow(registryActionLog, `<strong>${pendingRevoke.name}</strong> token ${pendingRevoke.token} revoked.`);
          addFeedItem(`<strong>${pendingRevoke.name}</strong> token ${pendingRevoke.token} revoked.`);
          closeModal('revokeConfirmModal');
          showToast(`${pendingRevoke.token} has been revoked and invalidated.`, '');
          pendingRevoke = null;
        }
        break;
      case 'audit-agent':
        setScreen('audit');
        showToast('Audit review opened', 'The warning path is ready for executive review.');
        break;
      case 'view-mcp':
        showToast(`${target.dataset.name} opened`, 'Server policy details and recent calls are available for review.');
        break;
      case 'edit-mcp':
        showToast('Policy editor ready', `${target.dataset.name} policy controls can now be updated.`);
        break;
      case 'verify-agent':
        showToast('Verification queued', `${target.dataset.name} has been sent for registry validation.`);
        break;
      case 'block-agent':
        showToast('Process blocked', `${target.dataset.name} has been isolated pending investigation.`);
        break;
      case 'reset-simulation':
        event.preventDefault();
        resetContainmentSimulation();
        break;
      case 'send-chat':
        sendChat();
        break;
      default:
        break;
    }
  });

  applyMetricTargets();
  observeMetrics();
  syncRouteFromHash();
  window.addEventListener('hashchange', syncRouteFromHash);

  updateRegistryCount();
  renderDashboardFeed();
  renderMcpFeed();
  refreshLedgerRows();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((modal) => closeModal(modal.id));
      resetTrustSelection();
      return;
    }

    if (event.key === '?') {
      event.preventDefault();
      openModal('supportModal');
      return;
    }

    if (document.getElementById('agents')?.classList.contains('active') && /^[1-6]$/.test(event.key)) {
      const mapping = ['agent-registry', 'agent-trust', 'agent-blast', 'agent-lineage', 'agent-mcp', 'agent-workflow'];
      activateTab('agent', mapping[Number(event.key) - 1]);
    }
  });

  setInterval(renderDashboardFeed, 30000);

  setInterval(() => {
    const events = [
      'AIT-0029 scope checked against policy P-001',
      'MCP call logged: crm-mcp → customer-support-ai',
      'Shadow AI detected: new tool usage flagged in Marketing',
      'Consent record CNS-2798 flagged for renewal (expires soon)',
      'RevenueOps Agent completed CRM note sync — 14 records',
      'Policy P-006 evaluated: no violations',
      `Audit hash committed: EVT-${String(Math.floor(Math.random() * 9000) + 1000)}`
    ];
    const choice = events[Math.floor(Math.random() * events.length)];
    addFeedItem(choice);
  }, 20000);

  setInterval(() => {
    const entries = [
      ['compliance-checker', 'audit-mcp', '✓ Pass', 'ok'],
      ['fraud-detection-ai', 'payment-gateway-mcp', '⚠ Flagged', 'warn'],
      ['revenue-ops-agent', 'crm-mcp', '✓ Pass', 'ok'],
      ['contract-reviewer', 'doc-retrieval-mcp', '✓ Pass', 'ok'],
      ['unknown-proc-881', 'external-llm-mcp', '✕ Blocked', 'risk'],
      ['customer-support', 'crm-mcp', '✓ Pass', 'ok']
    ];
    const next = entries[Math.floor(Math.random() * entries.length)];
    addMcpFeedItem(next[0], next[1], next[2], next[3]);
  }, 5000);
});
