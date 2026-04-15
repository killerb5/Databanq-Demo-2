document.addEventListener('DOMContentLoaded', () => {
  const screenNames = {
    dashboard: 'Overview / Dashboard',
    integrations: 'Connections / Integrations',
    agents: 'Governance / Agent Governance',
    ai: 'Governance / AI Governance',
    audit: 'Compliance / Audit & Compliance',
    usage: 'Evidence / Usage & Hash Ledger',
    settings: 'Admin / Settings'
  };

  const navItems = Array.from(document.querySelectorAll('.demo-nav-item[data-screen]'));
  const screens = Array.from(document.querySelectorAll('.screen'));
  const breadcrumb = document.getElementById('demoBreadcrumb');
  const toastEl = document.getElementById('demoToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const liveFeed = document.getElementById('liveFeed');
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
  const agentModalName = document.getElementById('agentModalName');
  const agentModalMeta = document.getElementById('agentModalMeta');
  const agentModalStatus = document.getElementById('agentModalStatus');
  const agentModalActions = document.getElementById('agentModalActions');

  let toastTimer = null;
  let demoAgentCount = 18;
  let ledgerRows = [];
  let ledgerPage = 0;

  const showToast = (title, description) => {
    if (!toastEl) return;
    toastTitle.textContent = title;
    toastDesc.textContent = description || '';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
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
    const generatedAt = new Date().toLocaleString();
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DataBanq Audit Report</title>
<style>
body{font-family:Arial,sans-serif;background:#f4f7f6;color:#132018;margin:0;padding:32px}
.report{max-width:900px;margin:0 auto;background:#fff;border:1px solid #d7e6dd;border-radius:14px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.08)}
.hero{padding:28px 32px;background:linear-gradient(135deg,#0d1a10,#134e34);color:#fff}
.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:4px 0;color:#d1fae5}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px 32px}
.card{border:1px solid #d7e6dd;border-radius:10px;padding:14px;background:#f9fbfa}
.section{padding:0 32px 24px}.section h2{font-size:16px;margin:10px 0}.muted{color:#4b6356;font-size:13px}
table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #e5efea;text-align:left;font-size:13px}th{background:#f0f7f4}
.footer{padding:18px 32px;background:#f7faf8;font-size:12px;color:#4b6356}
</style>
</head>
<body>
<div class="report">
  <div class="hero">
    <h1>DataBanq AI Governance Audit Report</h1>
    <p>Prepared for Acme Fintech Inc.</p>
    <p>Generated ${generatedAt} · Signed evidence bundle · Regulator-ready summary</p>
  </div>
  <div class="grid">
    <div class="card"><strong>SOC 2</strong><div>87% readiness</div></div>
    <div class="card"><strong>HIPAA</strong><div>89% readiness</div></div>
    <div class="card"><strong>EU AI Act</strong><div>81% readiness</div></div>
  </div>
  <div class="section">
    <h2>Executive Summary</h2>
    <p class="muted">The environment is operating with governed agents, signed connector scopes, active shadow AI controls, and a verified usage ledger. The only elevated review path remains the fraud escalation workflow, which is currently contained and supervised.</p>
  </div>
  <div class="section">
    <h2>Control Coverage</h2>
    <table>
      <thead><tr><th>Area</th><th>Status</th><th>Evidence</th></tr></thead>
      <tbody>
        <tr><td>Agent registry</td><td>Operational</td><td>Signed identities and owner approvals</td></tr>
        <tr><td>Trust boundaries</td><td>Monitored</td><td>Delegation review and escalation controls</td></tr>
        <tr><td>Usage ledger</td><td>Verified</td><td>Hash-signed AI and agent events</td></tr>
        <tr><td>Vendor governance</td><td>Active</td><td>Residency review and contract tracking</td></tr>
      </tbody>
    </table>
  </div>
  <div class="footer">Prepared by DataBanq demo workspace · Official-looking export for presentation use</div>
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

  const animateMetric = (el) => {
    if (!el || el.dataset.animated === 'true') return;
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();
    el.dataset.animated = 'true';

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      el.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const animateMetricsIn = (screen) => {
    if (!screen) return;
    screen.querySelectorAll('.metric').forEach(animateMetric);
  };

  const setScreen = (screenId) => {
    screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.screen === screenId));
    if (breadcrumb) breadcrumb.textContent = screenNames[screenId] || 'Overview / Dashboard';
    document.title = `DataBanq — ${screenNames[screenId] || 'Platform Demo'}`;
    history.replaceState(null, '', `#${screenId}`);
    animateMetricsIn(document.getElementById(screenId));
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => setScreen(item.dataset.screen));
  });

  document.querySelectorAll('[data-screen-jump]').forEach((button) => {
    button.addEventListener('click', () => setScreen(button.dataset.screenJump));
  });

  document.querySelectorAll('.subtab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.tabGroup;
      const targetId = tab.dataset.tabTarget;
      document.querySelectorAll(`.subtab[data-tab-group="${group}"]`).forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll(`#${tab.closest('.screen').id} .tab-pane`).forEach((pane) => pane.classList.remove('active'));
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
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

  const addFeedItem = (text) => {
    if (!liveFeed) return;
    const item = document.createElement('div');
    item.className = 'feed-row';
    item.innerHTML = `<div class="feed-time">now</div><div class="feed-text">${text}</div>`;
    liveFeed.prepend(item);
    while (liveFeed.children.length > 6) {
      liveFeed.removeChild(liveFeed.lastElementChild);
    }
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
    if (lower.includes('audit')) {
      return 'Open the Audit page or the top-right audit button to preview and download the official-looking report package with signed evidence.';
    }
    if (lower.includes('integration')) {
      return 'Use the Integrations page to review connected systems, open live connector settings, and download registry actions.';
    }
    if (lower.includes('trust')) {
      return 'The trust graph maps signed delegation between agents. Green animated paths are approved flows, while the amber route is contained and awaiting human oversight.';
    }
    if (lower.includes('navigate') || lower.includes('screen')) {
      return 'Use the left sidebar for major pages. Each screen now starts with a quick guide explaining what it does and the best next step.';
    }
    if (lower.includes('ledger')) {
      return 'The Usage and Hash Ledger page lets you page through records, verify integrity, and export a clean appendix report.';
    }
    if (lower.includes('settings')) {
      return 'Settings are organized into company profile, access rules, notifications, and audit defaults with cleaner forms and managed company details.';
    }
    return 'I can help with audit exports, governance screens, connector settings, containment tests, and navigation across the demo.';
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
        showToast('Support assistant opened', 'Quick help is ready for navigation, exports, and controls.');
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
      case 'run-radius-test': {
        const stepLabels = [
          ['Payment write attempt', 'Blocked by signed finance allowlist'],
          ['PII export attempt', 'Held for human approval'],
          ['Cross-agent escalation', 'Contained to supervised review'],
          ['Ledger proof', 'Hash-signed event committed']
        ];

        containmentSteps.forEach((step, index) => {
          const [label, outcome] = stepLabels[index];
          step.className = 'test-step pass';
          step.innerHTML = `<strong>${label}</strong><div>${outcome}</div>`;
        });

        if (containmentStatus) {
          containmentStatus.textContent = 'Passed';
          containmentStatus.className = 'status-badge ok';
        }
        if (radiusResult) {
          radiusResult.textContent = 'Containment test passed. Payment APIs remained blocked, sensitive exports stayed supervised, the escalation path stayed contained, and the proof was written to the ledger.';
        }

        prependLedgerEvent(`EVT-${9900 + demoAgentCount}`, 'Agent', 'Containment Simulator', 'Blocked overreach drill', 'Pass', Math.random().toString(16).slice(2, 10));
        addActivityRow(registryActionLog, '<strong>Containment test</strong> completed and signed to the registry.');
        addFeedItem('<strong>Containment test</strong> completed with no permission leakage.');
        showToast('Containment test complete', 'Blocked systems stayed outside the active scope and the proof was logged.');
        break;
      }
      case 'trust-audit':
        if (trustNote) {
          trustNote.textContent = 'Trust boundary audit initiated. Signed parent-child permissions are being revalidated for the flagged escalation path.';
        }
        addActivityRow(registryActionLog, '<strong>Trust review</strong> launched for the fraud escalation path.');
        addFeedItem('<strong>Trust boundary audit</strong> launched for the fraud escalation path.');
        showToast('Trust audit started', 'The flagged delegation path is under review.');
        break;
      case 'focus-risk-path':
        if (trustNote) {
          trustNote.textContent = 'Focused the high-risk path: Fraud AI to Case Escalator. Recommendation: require a second human approval on resolution actions.';
        }
        showToast('High-risk path focused', 'The professional trust review has been highlighted.');
        break;
      case 'export-governance':
        createHtmlDownload('databanq-governance-summary.html', buildGovernanceReport());
        showToast('Governance report exported', 'A styled governance summary was downloaded.');
        break;
      case 'download-report':
        createHtmlDownload('databanq-audit-report.html', buildAuditReport());
        showToast('Audit report downloaded', 'The executive audit report was exported.');
        break;
      case 'verify-ledger':
        showToast('Ledger verified', 'All visible hashes passed integrity checks.');
        break;
      case 'export-ledger':
        createHtmlDownload('databanq-ledger-appendix.html', buildLedgerReport());
        showToast('Ledger export complete', 'A styled ledger appendix was downloaded.');
        break;
      case 'save-settings':
        showToast('Settings saved', 'Organization and audit defaults were updated in the demo workspace.');
        break;
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
        const profiles = {
          'RevenueOps Agent': { meta: 'DBQ-AGT-0041 · M. Chen · Production', status: 'Active', tone: 'ok', actions: ['Token rotation completed 9:41', 'CRM write scope attested', 'No unsigned delegation'] },
          'Contract Reviewer': { meta: 'DBQ-AGT-0038 · A. Torres · Staging', status: 'Active', tone: 'ok', actions: ['Legal owner approval confirmed', 'Model lineage reviewed', 'Staging policy pack verified'] },
          'Customer Support AI': { meta: 'DBQ-AGT-0029 · J. Kim · Production', status: 'Active', tone: 'ok', actions: ['Consent evidence mapped', 'PII guardrails active', 'Prompt logging enabled'] },
          'Fraud Detection AI': { meta: 'DBQ-AGT-0063 · D. Williams · Production', status: 'Review', tone: 'warn', actions: ['Trust escalation path under oversight', 'Critical risk review open', 'Containment controls verified'] }
        };
        const name = target.dataset.name;
        const profile = profiles[name] || { meta: 'Governed agent profile', status: 'Active', tone: 'ok', actions: ['Registry review complete'] };
        if (agentModalName) agentModalName.textContent = name;
        if (agentModalMeta) agentModalMeta.textContent = profile.meta;
        if (agentModalStatus) {
          agentModalStatus.textContent = profile.status;
          agentModalStatus.className = `status-badge ${profile.tone}`;
        }
        if (agentModalActions) {
          agentModalActions.innerHTML = profile.actions.map((item) => `<div class="status-item"><strong>${name}</strong><span>${item}</span></div>`).join('');
        }
        openModal('agentModal');
        showToast(`${name} opened`, 'Agent identity, lineage, and registry activity are available for review.');
        break;
      }
      case 'download-agent-summary': {
        const name = agentModalName?.textContent || 'Agent';
        const meta = agentModalMeta?.textContent || 'Governed profile';
        createHtmlDownload('databanq-agent-summary.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Agent Summary</title><style>body{font-family:Arial,sans-serif;background:#f5f8f7;color:#132018;padding:28px}main{background:#fff;border:1px solid #d7e6dd;border-radius:12px;padding:18px}</style></head><body><main><h1>${name}</h1><p>${meta}</p><p>This summary includes governance posture, trust review status, and recent registry actions.</p></main></body></html>`);
        showToast('Agent summary downloaded', 'The selected agent record was exported.');
        break;
      }
      case 'issue-agent':
        demoAgentCount += 1;
        addActivityRow(registryActionLog, `<strong>New identity</strong> issued as DBQ-AGT-00${demoAgentCount}.`);
        prependLedgerEvent(`EVT-${9900 + demoAgentCount}`, 'Agent', 'Registry Service', 'Agent identity issuance', 'Pass', Math.random().toString(16).slice(2, 10));
        addFeedItem(`<strong>New agent identity</strong> issued as DBQ-AGT-00${demoAgentCount}.`);
        showToast('Agent identity issued', 'A new governed agent entry has been created.');
        break;
      case 'send-chat':
        sendChat();
        break;
      default:
        break;
    }
  });

  const hash = (window.location.hash || '#dashboard').replace('#', '');
  setScreen(screenNames[hash] ? hash : 'dashboard');

  screens.forEach((screen) => animateMetricsIn(screen));
  refreshLedgerRows();

  setInterval(() => {
    if (!document.getElementById('dashboard')?.classList.contains('active')) return;
    const events = [
      '<strong>Usage ledger</strong> wrote a new signed event for AI policy enforcement.',
      '<strong>Agent registry</strong> synced owner metadata from Okta.',
      '<strong>Audit evidence</strong> package updated with a fresh trust review.',
      '<strong>Consent registry</strong> recorded a downstream renewal acknowledgment.'
    ];
    const choice = events[Math.floor(Math.random() * events.length)];
    addFeedItem(choice);
  }, 9000);
});
