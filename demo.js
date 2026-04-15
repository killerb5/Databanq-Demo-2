document.addEventListener('DOMContentLoaded', () => {
  const screenTitles = {
    dashboard: 'Agent Governance Dashboard — DataBanq',
    registry: 'Agent Registry — DataBanq',
    trust: 'A2A Trust Map — DataBanq',
    radius: 'Blast Radius — DataBanq',
    lineage: 'Model Lineage — DataBanq',
    mcp: 'MCP Governance — DataBanq',
    workflow: 'Workflow Compliance — DataBanq',
    shadow: 'Shadow AI — DataBanq',
    consent: 'Consent Registry — DataBanq',
    policy: 'Policy Engine — DataBanq',
    vendor: 'Vendor Chain — DataBanq',
    audit: 'Audit Pack — DataBanq',
    usage: 'Usage Ledger — DataBanq'
  };

  const breadcrumbTitles = {
    dashboard: 'Dashboard',
    registry: 'Agent Registry',
    trust: 'A2A Trust Map',
    radius: 'Blast Radius',
    lineage: 'Model Lineage',
    mcp: 'MCP Governance',
    workflow: 'Workflow Compliance',
    shadow: 'Shadow AI',
    consent: 'Consent Registry',
    policy: 'Policy Engine',
    vendor: 'Vendor Chain',
    audit: 'Audit Pack',
    usage: 'Usage Ledger'
  };

  const frameworkData = {
    soc2: {
      title: 'SOC 2 Coverage: 87 of 100 controls mapped',
      summary: '87 Covered · 13 Gaps',
      fill: '87%',
      rows: `
        <tr><td>CC6.1</td><td>Logical access controls</td><td>Agent identity tokens, scope enforcement</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr><td>CC6.2</td><td>New access provisioning</td><td>AIT issuance, approval chain</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr><td>CC7.1</td><td>System monitoring</td><td>Activity feed, MCP call logging</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr class="row-warning"><td>CC9.2</td><td>Risk mitigation</td><td>Blast radius, A2A trust</td><td>●●○○ Partial</td><td><span class="status warning">⚠</span></td></tr>
        <tr class="row-warning"><td>A1.1</td><td>Availability commitments</td><td>Agent health monitoring</td><td>●○○○ Weak</td><td><span class="status danger">✕</span></td></tr>`
    },
    hipaa: {
      title: 'HIPAA Coverage: 34 of 38 safeguards mapped',
      summary: '34 Covered · 4 Open Items',
      fill: '89%',
      rows: `
        <tr><td>164.308</td><td>Administrative safeguards</td><td>Principal approval chain and policy enforcement</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr><td>164.312(a)</td><td>Access control</td><td>Scoped agent identities for PHI systems</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr><td>164.312(b)</td><td>Audit controls</td><td>Usage ledger and signed event exports</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr class="row-warning"><td>164.312(e)</td><td>Transmission security</td><td>MCP transfer restrictions</td><td>●●○○ Partial</td><td><span class="status warning">⚠</span></td></tr>`
    },
    euai: {
      title: 'EU AI Act: 22 of 27 duties covered',
      summary: '22 Covered · 5 Gaps',
      fill: '81%',
      rows: `
        <tr><td>Art. 9</td><td>Risk management</td><td>Blast radius controls and policy checks</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr><td>Art. 12</td><td>Record-keeping</td><td>Immutable agent event logging</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr><td>Art. 13</td><td>Transparency</td><td>Model lineage and explanation trail</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr class="row-warning"><td>Art. 14</td><td>Human oversight</td><td>Escalation rules for regulated actions</td><td>●●○○ Partial</td><td><span class="status warning">⚠</span></td></tr>`
    },
    nist: {
      title: 'NIST AI RMF: 31 of 36 outcomes aligned',
      summary: '31 Aligned · 5 In Progress',
      fill: '86%',
      rows: `
        <tr><td>GOV-1</td><td>Governance policies</td><td>Central policy engine and approval workflow</td><td>●●●● Full</td><td><span class="status active">✓</span></td></tr>
        <tr><td>MAP-2</td><td>Context mapping</td><td>Workflow-level control mapping</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr><td>MANAGE-3</td><td>Risk response</td><td>Delegation blocking and incident response</td><td>●●●○ Strong</td><td><span class="status active">✓</span></td></tr>
        <tr class="row-warning"><td>MEASURE-4</td><td>Monitoring depth</td><td>Cross-agent drift review</td><td>●●○○ Partial</td><td><span class="status warning">⚠</span></td></tr>`
    }
  };

  const navItems = document.querySelectorAll('.demo-nav-item');
  const screens = document.querySelectorAll('.screen');
  const breadcrumb = document.querySelector('[data-breadcrumb]');
  const sidebar = document.querySelector('.demo-sidebar');
  const sidebarToggle = document.querySelector('[data-demo-menu-toggle]');
  const toastStack = document.querySelector('.toast-stack');
  const issueModal = document.querySelector('[data-issue-modal]');
  const openIssue = document.querySelector('[data-open-issue]');
  const closeIssue = document.querySelectorAll('[data-close-issue]');
  const issueForm = document.querySelector('[data-issue-form]');
  const registryTable = document.querySelector('[data-registry-body]');
  const registrySub = document.querySelector('[data-registry-sub]');
  const detailModal = document.querySelector('[data-detail-modal]');
  const detailTitle = document.querySelector('[data-detail-title]');
  const detailBody = document.querySelector('[data-detail-body]');
  const closeDetail = document.querySelector('[data-close-detail]');
  const activityFeed = document.querySelector('.activity-feed');
  const frameworkTitle = document.querySelector('[data-framework-title]');
  const frameworkSummary = document.querySelector('[data-framework-summary]');
  const frameworkFill = document.querySelector('[data-framework-fill]');
  const frameworkBody = document.querySelector('[data-framework-body]');

  const showToast = (title, message, tone = 'success') => {
    if (!toastStack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tone === 'success' ? '' : tone}`.trim();
    toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    toastStack.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  };

  const openDetailModal = (title, bodyHtml) => {
    if (!detailModal || !detailTitle || !detailBody) return;
    detailTitle.textContent = title;
    detailBody.innerHTML = bodyHtml;
    detailModal.classList.add('open');
  };

  const closeDetailModal = () => detailModal && detailModal.classList.remove('open');

  const updateRegistrySummary = () => {
    if (!registryTable || !registrySub) return;
    const rows = Array.from(registryTable.querySelectorAll('tr'));
    const registered = rows.length;
    const pending = rows.filter((row) => row.textContent.includes('Unverified')).length;
    const revoked = rows.filter((row) => row.textContent.includes('Revoked')).length;
    registrySub.textContent = `${registered} registered · ${pending} pending verification · ${revoked} revoked`;
  };

  const openScreen = (key, syncHash = true) => {
    if (!screenTitles[key]) key = 'dashboard';
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.screen === key));
    screens.forEach((screen) => screen.classList.toggle('active', screen.id === key));

    if (breadcrumb) {
      breadcrumb.textContent = `Acme Fintech Inc. / Agent Governance / ${breadcrumbTitles[key] || 'Dashboard'}`;
    }

    document.title = screenTitles[key] || 'DataBanq Demo';

    if (syncHash) {
      history.replaceState(null, '', `#${key}`);
    }

    if (window.innerWidth < 768 && sidebar) {
      sidebar.classList.remove('open');
      document.body.classList.remove('demo-menu-open');
    }
  };

  const applyFramework = (frameworkKey) => {
    const data = frameworkData[frameworkKey];
    if (!data) return;

    document.querySelectorAll('.tab[data-framework]').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.framework === frameworkKey);
    });

    if (frameworkTitle) frameworkTitle.textContent = data.title;
    if (frameworkSummary) frameworkSummary.textContent = data.summary;
    if (frameworkFill) frameworkFill.style.width = data.fill;
    if (frameworkBody) frameworkBody.innerHTML = data.rows;
  };

  const exportRegistry = () => {
    if (!registryTable) return;
    const rows = Array.from(registryTable.querySelectorAll('tr')).map((row) => {
      return Array.from(row.children).slice(0, 6).map((cell) => cell.textContent.trim().replace(/\s+/g, ' ')).join(',');
    });
    const blob = new Blob([
      'Agent Name,Token ID,Status,Authorized Scope,Authorized By,Last Active\n' + rows.join('\n')
    ], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'databanq-agent-registry.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Registry exported', 'A CSV snapshot of governed agents was generated.');
  };

  const addFeedItem = (title, detail) => {
    if (!activityFeed) return;
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
    activityFeed.prepend(item);
    while (activityFeed.children.length > 5) {
      activityFeed.removeChild(activityFeed.lastElementChild);
    }
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => openScreen(item.dataset.screen));
  });

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      document.body.classList.toggle('demo-menu-open', isOpen);
    });
  }

  if (openIssue && issueModal) {
    openIssue.addEventListener('click', () => issueModal.classList.add('open'));
  }

  closeIssue.forEach((button) => {
    button.addEventListener('click', () => issueModal && issueModal.classList.remove('open'));
  });

  if (closeDetail) {
    closeDetail.addEventListener('click', closeDetailModal);
  }

  if (detailModal) {
    detailModal.addEventListener('click', (event) => {
      if (event.target === detailModal) closeDetailModal();
    });
  }

  if (issueForm && registryTable) {
    issueForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(issueForm);
      const agentName = formData.get('agentName') || 'new-agent';
      const principal = formData.get('principal') || 'Auto-policy';
      const checkedScopes = Array.from(issueForm.querySelectorAll('input[name="scope"]:checked')).map((node) => node.value);
      const scopeText = checkedScopes.length ? checkedScopes.slice(0, 2).join(', ') : 'read:documents';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="name">${agentName}</td>
        <td class="mono">AIT-0043</td>
        <td><span class="status active">● Active</span></td>
        <td>${scopeText}</td>
        <td>${principal}</td>
        <td>just now</td>
        <td>
          <div class="action-row">
            <button class="action-pill">View</button>
            <button class="action-pill">Revoke</button>
          </div>
        </td>`;
      registryTable.prepend(row);
      updateRegistrySummary();
      issueModal.classList.remove('open');
      issueForm.reset();
      addFeedItem('🟢 Agent identity issued', `${agentName} · ${scopeText} · just now`);
      showToast('Identity issued', `Agent Identity Token AIT-0043 was signed and registered.`);
    });
  }

  document.querySelectorAll('.tab[data-framework]').forEach((tab) => {
    tab.addEventListener('click', () => applyFramework(tab.dataset.framework));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const openScreenButton = target.closest('[data-open-screen]');
    if (openScreenButton instanceof HTMLElement) {
      openScreen(openScreenButton.dataset.openScreen || 'dashboard');
      return;
    }

    if (target.matches('[data-export-registry]')) {
      exportRegistry();
      return;
    }

    if (target.matches('[data-review-chain]')) {
      openScreen('trust');
      showToast('Trust chain focused', 'The violating delegation path is now highlighted for review.', 'warning');
      return;
    }

    if (target.matches('[data-block-delegation]')) {
      const notice = document.querySelector('#trust .notice strong');
      if (notice) {
        notice.textContent = '✓ Delegation blocked and parent permissions tightened for loan-agent-v2.';
      }
      addFeedItem('🟢 Delegation blocked', 'loan-agent-v2 policy tightened · parent chain preserved');
      showToast('Delegation blocked', 'Parent and child scopes were reconciled and logged.');
      return;
    }

    if (target.matches('[data-generate-audit]')) {
      target.setAttribute('disabled', 'true');
      target.textContent = 'Building audit package…';
      setTimeout(() => {
        target.removeAttribute('disabled');
        target.textContent = 'Generate SOC 2 Audit Package';
        openScreen('audit');
        showToast('Audit package ready', 'Governance evidence for SOC 2 CC6.1–CC9.2 has been assembled.');
      }, 1400);
      return;
    }

    if (target.matches('.action-pill')) {
      const action = target.textContent.trim();
      const row = target.closest('tr');
      const cells = row ? Array.from(row.children).map((cell) => cell.textContent.trim()) : [];
      const subject = cells[0] || 'Selected record';

      if (action === 'View') {
        openDetailModal(subject, `
          <div class="inline-list">
            <div class="inline-item"><strong>Status</strong><span>${cells[2] || 'Tracked'}</span></div>
            <div class="inline-item"><strong>Scope / Coverage</strong><span>${cells[3] || 'Details available in the live audit ledger.'}</span></div>
            <div class="inline-item"><strong>Authorized By</strong><span>${cells[4] || 'DataBanq policy engine'}</span></div>
            <div class="inline-item"><strong>Last Activity</strong><span>${cells[5] || 'just now'}</span></div>
          </div>`);
        return;
      }

      if (action === 'Revoke' && row) {
        row.classList.remove('row-warning', 'row-unverified');
        row.classList.add('row-revoked');
        if (row.children[2]) row.children[2].innerHTML = '<span class="status revoked">✕ Revoked</span>';
        if (row.children[3]) row.children[3].textContent = '—';
        target.remove();
        updateRegistrySummary();
        addFeedItem('🔴 Agent revoked', `${subject} access withdrawn by policy admin`);
        showToast('Agent revoked', `${subject} can no longer act on enterprise systems.`, 'warning');
        return;
      }

      if (action === 'Verify' && row) {
        row.classList.remove('row-unverified');
        if (row.children[1]) row.children[1].textContent = 'AIT-0044';
        if (row.children[2]) row.children[2].innerHTML = '<span class="status active">● Active</span>';
        if (row.children[3]) row.children[3].textContent = 'read:documents';
        if (row.children[4]) row.children[4].textContent = 'Auto-policy';
        const actionsCell = row.querySelector('.action-row');
        if (actionsCell) actionsCell.innerHTML = '<button class="action-pill">View</button><button class="action-pill">Revoke</button>';
        updateRegistrySummary();
        addFeedItem('🟢 Unknown process verified', `${subject} converted into a governed agent identity`);
        showToast('Agent verified', `${subject} is now governed under an approved token.`);
        return;
      }

      if (action === 'Block' && row) {
        row.classList.remove('row-unverified');
        row.classList.add('row-revoked');
        if (row.children[2]) row.children[2].innerHTML = '<span class="status revoked">✕ Blocked</span>';
        const actionsCell = row.querySelector('.action-row');
        if (actionsCell) actionsCell.innerHTML = '<button class="action-pill">View</button>';
        updateRegistrySummary();
        addFeedItem('🔴 Process blocked', `${subject} was denied access and written to the audit ledger`);
        showToast('Process blocked', `${subject} has been contained.`, 'error');
        return;
      }

      if (action === 'Audit') {
        openScreen('audit');
        showToast('Audit view opened', `${subject} evidence trail is ready for export.`);
        return;
      }

      if (action === 'Edit Policy' || action === 'Unblock') {
        openDetailModal(subject, `
          <div class="inline-list">
            <div class="inline-item"><strong>Policy Mode</strong><span>Scoped allow-list with review thresholds</span></div>
            <div class="inline-item"><strong>Recent Calls</strong><span>${cells[3] || 'No recent calls'} monitored in the last 24 hours.</span></div>
            <div class="inline-item"><strong>Recommended Action</strong><span>Keep current guardrails and review exceptions weekly.</span></div>
          </div>`);
        showToast('Policy panel opened', `${subject} governance controls are available for review.`);
      }
    }
  });

  const feedMessages = [
    ['▣ MCP call logged', 'compliance-checker · audit-mcp · policy approved'],
    ['🟢 Policy sync complete', 'updated deny-list pushed to 4 governed agents'],
    ['🟡 Scope review requested', 'payment-gateway-mcp exceeded daily threshold'],
    ['🟢 Usage ledger sealed', 'latest governance events hash-signed successfully']
  ];

  let feedIndex = 0;
  setInterval(() => {
    const [title, detail] = feedMessages[feedIndex % feedMessages.length];
    addFeedItem(title, detail);
    feedIndex += 1;
  }, 9000);

  applyFramework('soc2');
  updateRegistrySummary();
  openScreen(location.hash.replace('#', '') || 'dashboard', false);
});
