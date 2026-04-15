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
  const radiusResult = document.getElementById('radiusResult');
  const trustNote = document.getElementById('trustNote');
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const requestForm = document.getElementById('requestIntegrationForm');

  let toastTimer = null;
  let demoAgentCount = 18;

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
    if (modal) modal.classList.add('open');
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
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
      if (event.target === modal) modal.classList.remove('open');
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
      return 'You can open the audit pack from the top right or from the Audit & Compliance page. It exports the combined agent registry, ledger, and compliance evidence.';
    }
    if (lower.includes('integration')) {
      return 'Use Browse Catalog to connect supported systems instantly, or Request Integration to push a new connector into review.';
    }
    if (lower.includes('trust')) {
      return 'The trust graph shows parent-child delegation. Green paths are signed and verified. The highlighted warning path needs a second human review.';
    }
    if (lower.includes('settings')) {
      return 'Settings are now split into organization, access, notifications, and audit defaults so each area is easier to manage.';
    }
    return 'I can help with audit exports, governance pages, connected systems, or support workflows. Ask me about any part of the demo.';
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

  if (requestForm) {
    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(requestForm);
      const system = data.get('system');
      const type = data.get('type');
      addConnectedRow(system, type, 'Pending Review', 'Awaiting scoped approval');
      closeModal('requestModal');
      requestForm.reset();
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
        showToast('Support assistant opened', 'The virtual assistant is ready to help.');
        break;
      case 'open-audit':
        openModal('auditModal');
        showToast('Audit pack ready', 'The compliance preview is open.');
        break;
      case 'open-catalog':
        openModal('catalogModal');
        break;
      case 'open-request-integration':
        openModal('requestModal');
        break;
      case 'run-radius-test':
        if (radiusResult) {
          radiusResult.textContent = 'Containment test passed. Payment APIs stayed blocked, the escalation was logged, and the policy trail was written to the ledger.';
        }
        addFeedItem('<strong>Containment test</strong> completed with no permission leakage.');
        showToast('Containment test complete', 'Blocked systems stayed outside the active scope.');
        break;
      case 'trust-audit':
        if (trustNote) {
          trustNote.textContent = 'Trust boundary audit initiated. Signed parent-child permissions are being revalidated for the flagged escalation path.';
        }
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
        createDownload('databanq-governance-report.json', JSON.stringify({ exportedAt: new Date().toISOString(), sections: ['usage governance', 'data governance'], score: 94 }, null, 2));
        showToast('Governance report exported', 'A JSON snapshot was downloaded.');
        break;
      case 'download-report':
        createDownload('databanq-audit-pack.json', JSON.stringify({ exportedAt: new Date().toISOString(), frameworks: ['SOC 2', 'HIPAA', 'EU AI Act', 'NIST AI RMF'], readiness: { soc2: 87, hipaa: 89, euai: 81 } }, null, 2));
        showToast('Audit report downloaded', 'The demo audit pack was exported.');
        break;
      case 'verify-ledger':
        showToast('Ledger verified', 'All visible hashes passed integrity checks.');
        break;
      case 'export-ledger':
        createDownload('databanq-usage-ledger.json', JSON.stringify({ exportedAt: new Date().toISOString(), records: 2363, includes: ['agent actions', 'AI inferences'] }, null, 2));
        showToast('Ledger export complete', 'The combined ledger was downloaded.');
        break;
      case 'save-settings':
        showToast('Settings saved', 'Configuration changes were applied in the demo workspace.');
        break;
      case 'integration-settings':
        showToast(`${target.dataset.name} settings opened`, 'Connector policy and scope controls are available.');
        break;
      case 'connect-catalog': {
        const name = target.dataset.name;
        const type = target.dataset.type;
        addConnectedRow(name, type, 'Connected', 'Read + alert scope');
        target.disabled = true;
        target.textContent = 'Connected';
        addFeedItem(`<strong>${name}</strong> connected from the integration catalog.`);
        showToast('Integration connected', `${name} is now part of the governed workspace.`);
        break;
      }
      case 'view-agent':
        showToast(`${target.dataset.name} opened`, 'Agent identity, model lineage, and policy state are available for review.');
        break;
      case 'issue-agent':
        demoAgentCount += 1;
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
