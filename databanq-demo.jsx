import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg0: #080b10;
    --bg1: #0d1117;
    --bg2: #131920;
    --bg3: #1a2232;
    --bg4: #1f2b3e;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.10);
    --text0: #f0f4ff;
    --text1: #a8b8d0;
    --text2: #5c7a99;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --accent3: #10b981;
    --accent4: #f59e0b;
    --red: #ef4444;
    --orange: #f97316;
    --blue: #3b82f6;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius: 8px;
    --radius-lg: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --glow: 0 0 20px rgba(0,212,255,0.15);
  }

  html, body { height: 100%; background: var(--bg0); color: var(--text0); font-family: var(--font-body); font-size: 14px; overflow: hidden; }

  #root { height: 100%; display: flex; flex-direction: column; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 2px; }

  .layout { display: flex; height: 100%; overflow: hidden; }

  /* TOP NAV */
  .topnav {
    height: 52px; min-height: 52px;
    background: rgba(8,11,16,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 0;
    padding: 0 20px; z-index: 100;
    position: relative;
  }
  .topnav-logo {
    font-family: var(--font-display); font-size: 17px; font-weight: 800;
    letter-spacing: -0.5px; color: var(--text0);
    margin-right: 32px; white-space: nowrap;
    display: flex; align-items: center; gap: 8px;
  }
  .topnav-logo-mark {
    width: 26px; height: 26px; background: var(--accent);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: var(--bg0);
  }
  .topnav-tabs { display: flex; gap: 2px; flex: 1; }
  .topnav-tab {
    padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500;
    color: var(--text2); cursor: pointer; transition: all 0.15s; white-space: nowrap;
    border: none; background: transparent;
  }
  .topnav-tab:hover { color: var(--text1); background: var(--bg3); }
  .topnav-tab.active { color: var(--accent); background: rgba(0,212,255,0.08); }
  .topnav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .topnav-badge {
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    background: rgba(16,185,129,0.15); color: var(--accent3); border: 1px solid rgba(16,185,129,0.2);
  }
  .topnav-avatar {
    width: 30px; height: 30px; border-radius: 50%; background: var(--accent2);
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer;
  }

  /* SIDEBAR */
  .sidebar {
    width: 52px; background: var(--bg1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; padding: 12px 0; gap: 4px; z-index: 50;
    transition: width 0.2s ease; overflow: hidden;
  }
  .sidebar.expanded { width: 200px; }
  .sidebar-item {
    width: 100%; height: 38px; display: flex; align-items: center; gap: 10px;
    padding: 0 14px; border-radius: 0; cursor: pointer; transition: all 0.15s;
    color: var(--text2); font-size: 13px; font-weight: 500; white-space: nowrap;
    border: none; background: transparent; border-left: 2px solid transparent;
  }
  .sidebar-item:hover { color: var(--text1); background: var(--bg3); }
  .sidebar-item.active { color: var(--accent); background: rgba(0,212,255,0.06); border-left-color: var(--accent); }
  .sidebar-icon { min-width: 20px; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .sidebar-divider { width: calc(100% - 20px); height: 1px; background: var(--border); margin: 6px 0; }

  /* MAIN CONTENT */
  .main { flex: 1; overflow-y: auto; overflow-x: hidden; background: var(--bg0); }
  .page { padding: 24px; min-height: 100%; }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text0); }
  .section-subtitle { font-size: 13px; color: var(--text2); margin-top: 2px; }
  .section-actions { display: flex; gap: 8px; align-items: center; }

  /* CARDS & PANELS */
  .card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 16px; transition: border-color 0.2s;
  }
  .card:hover { border-color: var(--border2); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .card-title { font-size: 12px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; }
  .card-value { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--text0); line-height: 1; }
  .card-delta { font-size: 12px; font-weight: 500; margin-top: 4px; }
  .delta-up { color: var(--accent3); }
  .delta-down { color: var(--red); }

  /* GRIDS */
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }
  .grid-1-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; }

  /* BUTTONS */
  .btn {
    padding: 7px 14px; border-radius: var(--radius); font-family: var(--font-body);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
    border: 1px solid transparent; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: var(--bg0); border-color: var(--accent); }
  .btn-primary:hover { background: #00b8d9; box-shadow: 0 0 16px rgba(0,212,255,0.3); }
  .btn-ghost { background: transparent; color: var(--text1); border-color: var(--border2); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text0); }
  .btn-danger { background: transparent; color: var(--red); border-color: rgba(239,68,68,0.3); }
  .btn-danger:hover { background: rgba(239,68,68,0.1); }
  .btn-sm { padding: 4px 10px; font-size: 12px; }
  .btn-icon { padding: 7px; width: 32px; height: 32px; justify-content: center; }

  /* BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.3px;
  }
  .badge-green { background: rgba(16,185,129,0.12); color: var(--accent3); border: 1px solid rgba(16,185,129,0.2); }
  .badge-blue { background: rgba(59,130,246,0.12); color: var(--blue); border: 1px solid rgba(59,130,246,0.2); }
  .badge-orange { background: rgba(245,158,11,0.12); color: var(--accent4); border: 1px solid rgba(245,158,11,0.2); }
  .badge-red { background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .badge-purple { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
  .badge-cyan { background: rgba(0,212,255,0.08); color: var(--accent); border: 1px solid rgba(0,212,255,0.2); }
  .badge-gray { background: rgba(255,255,255,0.05); color: var(--text2); border: 1px solid var(--border); }

  /* TABLES */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid var(--border); }
  th { padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { padding: 10px 12px; font-size: 13px; color: var(--text1); border-bottom: 1px solid rgba(255,255,255,0.03); }
  tr:hover td { background: rgba(255,255,255,0.02); }
  tr:last-child td { border-bottom: none; }

  /* INPUTS */
  .input {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 8px 12px; font-family: var(--font-body); font-size: 13px; color: var(--text0);
    outline: none; transition: border-color 0.15s; width: 100%;
  }
  .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
  .input::placeholder { color: var(--text2); }

  /* SEARCH */
  .search-wrap { position: relative; }
  .search-wrap .input { padding-left: 32px; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text2); font-size: 14px; }

  /* PROGRESS BARS */
  .progress-bar { height: 4px; background: var(--bg4); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

  /* MINI SPARKLINES */
  .sparkline { display: flex; align-items: flex-end; gap: 2px; height: 28px; }
  .spark-bar { width: 4px; border-radius: 2px; transition: height 0.5s ease; }

  /* TABS */
  .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .tab-btn {
    padding: 8px 14px; font-size: 13px; font-weight: 500; color: var(--text2);
    cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s;
    background: transparent; border-top: none; border-left: none; border-right: none;
    font-family: var(--font-body);
  }
  .tab-btn:hover { color: var(--text1); }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* STATUS DOT */
  .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .dot-green { background: var(--accent3); box-shadow: 0 0 6px var(--accent3); }
  .dot-yellow { background: var(--accent4); }
  .dot-red { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .dot-blue { background: var(--accent); }
  .dot-gray { background: var(--text2); }

  /* LIVE FEED */
  .feed-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 12px; animation: fadeSlide 0.4s ease;
  }
  .feed-item:last-child { border-bottom: none; }
  @keyframes fadeSlide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .feed-time { font-family: var(--font-mono); font-size: 10px; color: var(--text2); min-width: 52px; margin-top: 1px; }
  .feed-text { color: var(--text1); line-height: 1.4; }
  .feed-text strong { color: var(--text0); font-weight: 500; }

  /* GRAPH SVG */
  .chart-svg { width: 100%; overflow: visible; }

  /* AGENT CARD */
  .agent-row {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    margin-bottom: 6px; cursor: pointer; transition: all 0.15s;
  }
  .agent-row:hover { border-color: var(--border2); background: var(--bg3); }
  .agent-icon {
    width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .agent-info { flex: 1; min-width: 0; }
  .agent-name { font-size: 13px; font-weight: 500; color: var(--text0); }
  .agent-meta { font-size: 11px; color: var(--text2); margin-top: 1px; }
  .agent-id { font-family: var(--font-mono); font-size: 10px; color: var(--accent); }

  /* PANEL DETAIL */
  .detail-panel {
    background: var(--bg1); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 16px;
  }
  .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: var(--text2); }
  .detail-value { color: var(--text0); font-weight: 500; }
  .detail-mono { font-family: var(--font-mono); font-size: 11px; color: var(--accent); }

  /* VENDOR CARD */
  .vendor-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 12px; display: flex; flex-direction: column; gap: 8px; transition: all 0.15s;
  }
  .vendor-card:hover { border-color: var(--border2); }
  .vendor-name { font-size: 13px; font-weight: 600; color: var(--text0); }
  .vendor-meta { font-size: 11px; color: var(--text2); }

  /* NOTIFICATION TOAST */
  .toast-container { position: fixed; top: 60px; right: 16px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
  .toast {
    background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius);
    padding: 10px 14px; font-size: 12px; color: var(--text0); max-width: 300px;
    box-shadow: var(--shadow); animation: toastIn 0.3s ease; pointer-events: all;
    display: flex; align-items: center; gap: 8px;
  }
  @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .toast-success { border-left: 3px solid var(--accent3); }
  .toast-warning { border-left: 3px solid var(--accent4); }
  .toast-error { border-left: 3px solid var(--red); }
  .toast-info { border-left: 3px solid var(--accent); }

  /* LOADING SHIMMER */
  .shimmer {
    background: linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%);
    background-size: 400% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius);
  }
  @keyframes shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

  /* NETWORK GRAPH */
  .network-node {
    cursor: pointer; transition: all 0.2s;
  }
  .network-node:hover circle { stroke-width: 2; filter: brightness(1.3); }

  /* HEATMAP */
  .heatmap { display: grid; gap: 3px; }
  .heat-cell { border-radius: 3px; height: 18px; transition: opacity 0.2s; cursor: pointer; }
  .heat-cell:hover { opacity: 0.8; }

  /* COMPLIANCE BAR */
  .compliance-item { margin-bottom: 10px; }
  .compliance-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
  .compliance-name { color: var(--text1); }
  .compliance-pct { font-weight: 600; color: var(--text0); font-family: var(--font-mono); font-size: 11px; }

  /* SEARCH BAR */
  .global-search { display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; min-width: 180px; }
  .global-search input { background: transparent; border: none; outline: none; font-size: 13px; color: var(--text0); font-family: var(--font-body); width: 120px; }
  .global-search input::placeholder { color: var(--text2); }

  /* TOGGLE */
  .toggle { position: relative; width: 36px; height: 20px; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; inset: 0; background: var(--bg4); border-radius: 10px; cursor: pointer; transition: 0.2s; }
  .toggle-slider::before { content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background: var(--text2); border-radius: 50%; transition: 0.2s; }
  .toggle input:checked + .toggle-slider { background: var(--accent); }
  .toggle input:checked + .toggle-slider::before { transform: translateX(16px); background: var(--bg0); }

  /* RISK GAUGE */
  .gauge-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }

  /* SCROLLABLE CONTAINER */
  .scroll-y { overflow-y: auto; }

  /* EMPTY STATE */
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 40px; color: var(--text2); text-align: center; }
  .empty-icon { font-size: 32px; opacity: 0.4; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal { background: var(--bg1); border: 1px solid var(--border2); border-radius: var(--radius-lg); padding: 24px; min-width: 420px; max-width: 560px; box-shadow: var(--shadow); }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; }
  .modal-close { background: transparent; border: none; color: var(--text2); cursor: pointer; font-size: 18px; padding: 2px; }
  .modal-close:hover { color: var(--text0); }

  /* SELECT */
  select.input { appearance: none; cursor: pointer; }

  /* SECTION TAG */
  .section-tag { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text2); padding: 2px 8px; background: var(--bg3); border-radius: 4px; }

  /* ANIMATIONS */
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .pulse { animation: pulse 2s infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; display: inline-block; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
    .grid-2-1, .grid-1-2 { grid-template-columns: 1fr; }
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const AGENTS = [
  { id: "DBQ-AGT-0041", name: "RevenueOps Agent", dept: "Finance", env: "Production", status: "active", scope: ["Salesforce", "NetSuite"], risk: "low", model: "GPT-4o", owner: "M. Chen", icon: "💹" },
  { id: "DBQ-AGT-0038", name: "Contract Reviewer", dept: "Legal", env: "Staging", status: "active", scope: ["SharePoint", "DocuSign"], risk: "medium", model: "Claude 3.5", owner: "A. Torres", icon: "⚖️" },
  { id: "DBQ-AGT-0029", name: "Customer Support AI", dept: "CX", env: "Production", status: "active", scope: ["Zendesk", "Slack"], risk: "low", model: "GPT-4o mini", owner: "J. Kim", icon: "🎧" },
  { id: "DBQ-AGT-0052", name: "Data Pipeline Agent", dept: "Engineering", env: "Production", status: "alert", scope: ["Snowflake", "S3", "Redshift"], risk: "high", model: "Claude 3 Opus", owner: "R. Patel", icon: "🔄" },
  { id: "DBQ-AGT-0017", name: "HR Onboarding Bot", dept: "HR", env: "Production", status: "active", scope: ["Workday", "Slack"], risk: "low", model: "Gemini 1.5", owner: "S. Johnson", icon: "👥" },
  { id: "DBQ-AGT-0063", name: "Fraud Detection AI", dept: "Risk", env: "Production", status: "active", scope: ["Core Banking", "Auth0"], risk: "critical", model: "Internal", owner: "D. Williams", icon: "🛡️" },
];

const CONSENT_RECORDS = [
  { id: "CNS-2841", subject: "Customer PII Data", type: "Explicit", status: "valid", date: "2025-11-12", expiry: "2026-11-12", agent: "Customer Support AI", risk: "low" },
  { id: "CNS-2839", subject: "Financial Records", type: "Contractual", status: "valid", date: "2025-09-03", expiry: "2026-09-03", agent: "RevenueOps Agent", risk: "low" },
  { id: "CNS-2822", subject: "Employee Performance", type: "Implied", status: "warning", date: "2025-06-18", expiry: "2026-06-18", agent: "HR Onboarding Bot", risk: "medium" },
  { id: "CNS-2798", subject: "Transaction History", type: "Inferred", status: "review", date: "2025-04-01", expiry: "2026-04-01", agent: "Fraud Detection AI", risk: "high" },
  { id: "CNS-2791", subject: "Contract Data", type: "Contractual", status: "valid", date: "2025-08-22", expiry: "2026-08-22", agent: "Contract Reviewer", risk: "low" },
  { id: "CNS-2780", subject: "Log Analytics", type: "Implied", status: "valid", date: "2025-07-15", expiry: "2026-07-15", agent: "Data Pipeline Agent", risk: "medium" },
];

const SHADOW_USERS = [
  { name: "Kyle Barnes", dept: "Marketing", tools: ["Midjourney", "ChatGPT", "Copy.ai"], risk: 92, exposure: "High", sessions: 847 },
  { name: "Priya Mehta", dept: "Sales", tools: ["Claude.ai", "Jasper"], risk: 74, exposure: "Medium", sessions: 312 },
  { name: "Dan Foster", dept: "Finance", tools: ["ChatGPT", "Copilot"], risk: 68, exposure: "Medium", sessions: 208 },
  { name: "Lisa Park", dept: "HR", tools: ["ChatGPT"], risk: 45, exposure: "Low", sessions: 143 },
  { name: "Omar Khalil", dept: "Engineering", tools: ["GitHub Copilot", "Cursor", "Tabnine"], risk: 38, exposure: "Low", sessions: 621 },
];

const VENDORS = [
  { name: "OpenAI", category: "LLM Provider", risk: "medium", status: "monitored", dataHandling: "US/EU", lastUpdate: "2d ago", contracts: 2, alerts: 1 },
  { name: "Anthropic", category: "LLM Provider", risk: "low", status: "compliant", dataHandling: "US", lastUpdate: "5d ago", contracts: 1, alerts: 0 },
  { name: "Microsoft Azure AI", category: "Platform", risk: "low", status: "compliant", dataHandling: "US/EU/APAC", lastUpdate: "1d ago", contracts: 3, alerts: 0 },
  { name: "Hugging Face", category: "Model Hub", risk: "high", status: "review", dataHandling: "US", lastUpdate: "12d ago", contracts: 1, alerts: 3 },
  { name: "Scale AI", category: "Training Data", risk: "medium", status: "monitored", dataHandling: "US", lastUpdate: "8d ago", contracts: 1, alerts: 1 },
  { name: "Cohere", category: "LLM Provider", risk: "low", status: "compliant", dataHandling: "CA/US", lastUpdate: "3d ago", contracts: 1, alerts: 0 },
];

const MCP_SERVERS = [
  { name: "filesystem", version: "1.2.1", risk: "high", agents: 3, invocations: 14820, status: "active", dataExfil: true },
  { name: "brave-search", version: "0.9.0", risk: "medium", agents: 5, invocations: 8341, status: "active", dataExfil: false },
  { name: "github", version: "2.1.0", risk: "medium", agents: 2, invocations: 3201, status: "active", dataExfil: false },
  { name: "postgres", version: "1.0.4", risk: "critical", agents: 1, invocations: 22100, status: "restricted", dataExfil: true },
  { name: "slack", version: "1.5.2", risk: "low", agents: 4, invocations: 6700, status: "active", dataExfil: false },
  { name: "custom-internal", version: "0.3.1", risk: "high", agents: 1, invocations: 891, status: "review", dataExfil: true },
];

const FEED_EVENTS = [
  { time: "00:12", text: <><strong>DBQ-AGT-0052</strong> triggered blast radius limit — Snowflake write blocked</>, type: "alert" },
  { time: "00:09", text: <><strong>SOC 2 evidence</strong> auto-tagged for workflow <code style={{fontSize:10,color:'#00d4ff'}}>WF-089</code></>, type: "info" },
  { time: "00:07", text: <><strong>Shadow AI</strong> detected: Kyle Barnes accessed Midjourney (unapproved)</>, type: "warning" },
  { time: "00:04", text: <><strong>Policy P-14</strong> enforced: PII export blocked in staging environment</>, type: "info" },
  { time: "00:02", text: <><strong>Vendor alert</strong>: Hugging Face updated data handling policy</>, type: "warning" },
  { time: "00:01", text: <><strong>Audit package</strong> generated for Q1 2026 HIPAA review</>, type: "success" },
];

const COMPLIANCE_FRAMEWORKS = [
  { name: "SOC 2 Type II", pct: 87, color: "#00d4ff", gaps: 3 },
  { name: "HIPAA", pct: 76, color: "#10b981", gaps: 7 },
  { name: "EU AI Act", pct: 62, color: "#f59e0b", gaps: 12 },
  { name: "ISO 27001", pct: 91, color: "#3b82f6", gaps: 2 },
  { name: "NIST AI RMF", pct: 73, color: "#a78bfa", gaps: 8 },
  { name: "SEC", pct: 82, color: "#10b981", gaps: 4 },
];

const POLICIES = [
  { id: "P-001", name: "PII Data Access Control", status: "enforced", targets: 6, version: "v3.2", scope: "Global", lastEdit: "2d ago" },
  { id: "P-002", name: "Agent Output Rate Limits", status: "enforced", targets: 4, version: "v1.8", scope: "Production", lastEdit: "5d ago" },
  { id: "P-003", name: "EU Data Residency", status: "enforced", targets: 8, version: "v2.0", scope: "EU Region", lastEdit: "12d ago" },
  { id: "P-004", name: "Model Version Pinning", status: "draft", targets: 0, version: "v0.3", scope: "Engineering", lastEdit: "1d ago" },
  { id: "P-005", name: "Shadow AI Blocking", status: "enforced", targets: 12, version: "v4.1", scope: "Global", lastEdit: "3d ago" },
  { id: "P-006", name: "Consent Expiry Cascade", status: "warning", targets: 3, version: "v2.2", scope: "CX Dept", lastEdit: "7d ago" },
];

const INTEGRATIONS = [
  { name: "Okta", cat: "Identity", icon: "🔐", status: "connected", lastSync: "2m ago" },
  { name: "Azure AD", cat: "Identity", icon: "🏢", status: "connected", lastSync: "5m ago" },
  { name: "AWS", cat: "Cloud", icon: "☁️", status: "connected", lastSync: "1m ago" },
  { name: "Google Cloud", cat: "Cloud", icon: "🌐", status: "connected", lastSync: "8m ago" },
  { name: "Splunk", cat: "SIEM", icon: "📊", status: "connected", lastSync: "3m ago" },
  { name: "Elastic", cat: "SIEM", icon: "🔍", status: "pending", lastSync: "—" },
  { name: "Slack", cat: "Comms", icon: "💬", status: "connected", lastSync: "real-time" },
  { name: "Salesforce", cat: "CRM", icon: "☁️", status: "connected", lastSync: "15m ago" },
  { name: "Microsoft Copilot", cat: "AI Platform", icon: "🤖", status: "connected", lastSync: "1m ago" },
  { name: "OpenAI", cat: "LLM", icon: "⚡", status: "connected", lastSync: "real-time" },
  { name: "LangChain", cat: "AI Framework", icon: "🔗", status: "pending", lastSync: "—" },
  { name: "AutoGen", cat: "AI Framework", icon: "🔄", status: "review", lastSync: "—" },
];

const AUDIT_EVENTS = [
  { id: "EVT-9921", time: "2026-04-15 00:12:04", type: "BLAST_RADIUS_TRIGGER", agent: "DBQ-AGT-0052", hash: "a3f9e2b1c4d7", status: "signed", severity: "high" },
  { id: "EVT-9920", time: "2026-04-15 00:09:11", type: "POLICY_ENFORCE", agent: "Policy Engine", hash: "b8c1d4e7f2a3", status: "signed", severity: "info" },
  { id: "EVT-9919", time: "2026-04-15 00:07:33", type: "SHADOW_AI_DETECT", agent: "Shadow Monitor", hash: "c2d5e8f1a4b7", status: "signed", severity: "warning" },
  { id: "EVT-9918", time: "2026-04-14 23:58:02", type: "CONSENT_REVOKE", agent: "CNS-2798", hash: "d6e9f2a5b8c1", status: "signed", severity: "medium" },
  { id: "EVT-9917", time: "2026-04-14 23:41:18", type: "TOKEN_ROTATE", agent: "DBQ-AGT-0029", hash: "e1f4a7b2c5d8", status: "signed", severity: "info" },
  { id: "EVT-9916", time: "2026-04-14 23:30:55", type: "VENDOR_ALERT", agent: "Vendor Chain", hash: "f5a8b3c6d9e2", status: "signed", severity: "warning" },
];

// ─── MINI CHART COMPONENT ─────────────────────────────────────────────────────
const SparkChart = ({ data, color = "#00d4ff", height = 40, width = 100 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#sg${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

const BarSparkline = ({ data, color = "#00d4ff" }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "28px" }}>
      {data.map((v, i) => (
        <div key={i} style={{
          width: "5px", borderRadius: "2px",
          height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}55`,
        }} />
      ))}
    </div>
  );
};

const DonutChart = ({ value, color, size = 60, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
};

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, add };
};

// ─── OVERVIEW PAGE ────────────────────────────────────────────────────────────
const trendData = [42, 47, 44, 51, 48, 55, 53, 60, 58, 64, 61, 68];
const riskTrend = [8, 12, 9, 15, 11, 14, 10, 8, 13, 7, 11, 6];
const eventTrend = [120, 145, 132, 180, 162, 195, 178, 210, 192, 225, 208, 243];

const OverviewPage = ({ toast }) => {
  const [tick, setTick] = useState(0);
  const [feed, setFeed] = useState(FEED_EVENTS);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (tick > 0 && tick % 2 === 0) {
      const newEvents = [
        { time: "just now", text: <><strong>DBQ-AGT-{String(Math.floor(Math.random()*80)+10).padStart(4,'0')}</strong> identity token refreshed</>, type: "info" },
        { time: "just now", text: <><strong>Policy P-{Math.floor(Math.random()*6)+1}</strong> evaluated — {Math.floor(Math.random()*5)+1} decisions</>, type: "success" },
        { time: "just now", text: <><strong>Audit hash</strong> written to immutable ledger</>, type: "info" },
      ];
      setFeed(f => [newEvents[tick % 3], ...f].slice(0, 8));
    }
  }, [tick]);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Command Center</div>
          <div className="section-subtitle">Enterprise AI Governance Overview · Live</div>
        </div>
        <div className="section-actions">
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--accent3)" }}>
            <span className="status-dot dot-green" style={{ animation: "pulse 2s infinite" }} /> LIVE
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => toast("Exporting executive report...", "info")}>↓ Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("Dashboard refreshed", "success")}>↻ Refresh</button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid-4" style={{ marginBottom: 12 }}>
        {[
          { label: "Governed AI Systems", value: 68 + tick % 3, delta: "+3 this week", color: "#00d4ff", trend: trendData, up: true },
          { label: "Active Agents", value: 41 + tick % 2, delta: "+2 today", color: "#10b981", trend: [30,32,31,35,34,38,36,40,39,42,40,41], up: true },
          { label: "Governance Score", value: "94%", delta: "+1.2 pts", color: "#a78bfa", trend: [88,89,89,90,91,90,92,91,93,93,94,94], up: true },
          { label: "Open Risks", value: 7 - (tick > 5 ? 1 : 0), delta: "-2 resolved", color: "#ef4444", trend: riskTrend, up: false },
        ].map((k, i) => (
          <div key={i} className="card" style={{ borderColor: `${k.color}20` }}>
            <div className="card-header">
              <span className="card-title">{k.label}</span>
              <BarSparkline data={k.trend} color={k.color} />
            </div>
            <div className="card-value" style={{ color: k.color }}>{k.value}</div>
            <div className={`card-delta ${k.up ? "delta-up" : "delta-down"}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { label: "Shadow AI Detections", value: 23, delta: "+5 today", color: "#f59e0b" },
          { label: "Policy Violations", value: 4, delta: "-1 from yesterday", color: "#ef4444" },
          { label: "Audit Readiness", value: "87%", delta: "3 gaps remain", color: "#00d4ff" },
          { label: "Signed Events Today", value: "1,248", delta: "Ledger current", color: "#10b981" },
        ].map((k, i) => (
          <div key={i} className="card">
            <div className="card-title" style={{ marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {/* Live Feed */}
        <div className="card" style={{ gridColumn: "span 1" }}>
          <div className="card-header"><span className="card-title">Live Events</span><span className="badge badge-green pulse">● LIVE</span></div>
          {feed.map((e, i) => (
            <div key={i} className="feed-item">
              <span className="feed-time">{e.time}</span>
              <span className="feed-text">{e.text}</span>
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        <div className="card">
          <div className="card-header"><span className="card-title">Framework Coverage</span><span className="badge badge-blue">6 Active</span></div>
          {COMPLIANCE_FRAMEWORKS.map((f, i) => (
            <div key={i} className="compliance-item">
              <div className="compliance-label">
                <span className="compliance-name">{f.name}</span>
                <span className="compliance-pct">{f.pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${f.pct}%`, background: f.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Score + Region */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Trust Network Snapshot</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
              {[
                { label: "Agents", value: 41, icon: "🤖" },
                { label: "Trust Paths", value: 127, icon: "🔗" },
                { label: "Violations", value: 2, icon: "⚠️" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "8px", background: "var(--bg2)", borderRadius: "var(--radius)" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text0)" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text2)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Event Trend (30d)</div>
            <SparkChart data={eventTrend} color="#00d4ff" height={60} width={240} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AGENT GOVERNANCE PAGE ────────────────────────────────────────────────────
const AgentGovernancePage = ({ toast }) => {
  const [activeTab, setActiveTab] = useState("identity");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [issueModal, setIssueModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");

  const tabs = [
    { id: "identity", label: "Agent Identity" },
    { id: "a2a", label: "A2A Trust" },
    { id: "blast", label: "Blast Radius" },
    { id: "lineage", label: "Model Lineage" },
    { id: "mcp", label: "MCP Servers" },
    { id: "workflow", label: "Workflow Compliance" },
  ];

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Agent Governance</div>
          <div className="section-subtitle">Identity · Trust · Authorization · Compliance</div>
        </div>
        <div className="section-actions">
          <button className="btn btn-ghost btn-sm">↓ Export Registry</button>
          <button className="btn btn-primary btn-sm" onClick={() => setIssueModal(true)}>+ Issue Agent Identity</button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {activeTab === "identity" && (
        <div className="grid-2-1">
          <div>
            {AGENTS.map(a => (
              <div key={a.id} className={`agent-row ${selectedAgent?.id === a.id ? "active" : ""}`} onClick={() => setSelectedAgent(a)}
                style={selectedAgent?.id === a.id ? { borderColor: "var(--accent)", background: "rgba(0,212,255,0.04)" } : {}}>
                <div className="agent-icon" style={{ background: a.risk === "critical" ? "rgba(239,68,68,0.1)" : a.risk === "high" ? "rgba(245,158,11,0.1)" : "rgba(0,212,255,0.08)" }}>{a.icon}</div>
                <div className="agent-info">
                  <div className="agent-name">{a.name}</div>
                  <div className="agent-meta">{a.dept} · {a.env} · {a.model}</div>
                  <div className="agent-id">{a.id}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className={`badge ${a.status === "active" ? "badge-green" : a.status === "alert" ? "badge-red" : "badge-orange"}`}>
                    {a.status}
                  </span>
                  <span className={`badge ${a.risk === "critical" ? "badge-red" : a.risk === "high" ? "badge-orange" : a.risk === "medium" ? "badge-orange" : "badge-green"}`} style={{ fontSize: 10 }}>
                    {a.risk} risk
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div>
            {selectedAgent ? (
              <div className="detail-panel">
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{selectedAgent.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>{selectedAgent.name}</div>
                    <div className="agent-id">{selectedAgent.id}</div>
                  </div>
                </div>
                {[
                  ["Owner", selectedAgent.owner],
                  ["Department", selectedAgent.dept],
                  ["Environment", selectedAgent.env],
                  ["Model", selectedAgent.model],
                  ["Risk Level", selectedAgent.risk],
                  ["Token Expiry", "2026-07-15"],
                  ["Last Rotated", "14d ago"],
                ].map(([l, v]) => (
                  <div key={l} className="detail-row">
                    <span className="detail-label">{l}</span>
                    <span className="detail-value">{v}</span>
                  </div>
                ))}
                <div className="detail-row">
                  <span className="detail-label">Access Scope</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {selectedAgent.scope.map(s => <span key={s} className="badge badge-cyan" style={{ fontSize: 10 }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => toast(`Token rotated for ${selectedAgent.name}`, "success")}>↻ Rotate Token</button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => toast(`${selectedAgent.name} access revoked`, "warning")}>✕ Revoke</button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="empty-state"><div className="empty-icon">🤖</div><div>Select an agent to inspect</div></div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "a2a" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Agent Trust Graph</span><span className="badge badge-blue">6 Nodes</span></div>
            <svg width="100%" height="260" style={{ overflow: "visible" }}>
              {/* Edges */}
              {[[200,80,320,160],[200,80,100,180],[320,160,240,230],[100,180,200,260],[320,160,380,230]].map(([x1,y1,x2,y2],i)=>(
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
              ))}
              {[
                {x:200,y:80,label:"RevenueOps",color:"#00d4ff",r:22},
                {x:320,y:160,label:"Contract",color:"#a78bfa",r:18},
                {x:100,y:180,label:"Support AI",color:"#10b981",r:18},
                {x:240,y:230,label:"Pipeline",color:"#ef4444",r:20},
                {x:380,y:230,label:"Fraud AI",color:"#f59e0b",r:16},
                {x:100,y:260,label:"HR Bot",color:"#10b981",r:14},
              ].map((n,i) => (
                <g key={i} className="network-node">
                  <circle cx={n.x} cy={n.y} r={n.r} fill={`${n.color}18`} stroke={n.color} strokeWidth="1.5" />
                  <text x={n.x} y={n.y+4} textAnchor="middle" fill={n.color} fontSize="9" fontFamily="DM Sans">{n.label.substring(0,8)}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Delegation Chains</span></div>
            {[
              { from: "RevenueOps Agent", to: "Contract Reviewer", perm: "Read Only", signed: true },
              { from: "Data Pipeline Agent", to: "RevenueOps Agent", perm: "Write Access", signed: false },
              { from: "Fraud Detection AI", to: "Customer Support AI", perm: "Alert Trigger", signed: true },
            ].map((c, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, fontSize: 12 }}>
                  <span style={{ color: "var(--text0)", fontWeight: 500 }}>{c.from}</span>
                  <span style={{ color: "var(--text2)", margin: "0 6px" }}>→</span>
                  <span style={{ color: "var(--text0)", fontWeight: 500 }}>{c.to}</span>
                  <div style={{ color: "var(--text2)", fontSize: 11, marginTop: 2 }}>{c.perm}</div>
                </div>
                <span className={`badge ${c.signed ? "badge-green" : "badge-red"}`}>{c.signed ? "✓ Signed" : "⚠ Unsigned"}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" style={{ width: "100%" }} onClick={() => toast("Trust boundary audit initiated", "info")}>Audit Trust Boundaries</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "blast" && (
        <div className="grid-2">
          {AGENTS.map(a => (
            <div key={a.id} className="card">
              <div className="card-header">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</span>
                </span>
                <span className={`badge ${a.risk === "critical" ? "badge-red" : a.risk === "high" ? "badge-orange" : "badge-green"}`}>{a.risk} risk</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>Access Scope ({a.scope.length} systems)</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {a.scope.map(s => <span key={s} className="badge badge-cyan">{s}</span>)}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => toast(`Scope reduced for ${a.name}`, "success")}>↓ Reduce Scope</button>
                <button className="btn btn-danger btn-sm" onClick={() => toast(`${a.name} suspended`, "warning")}>Suspend</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "lineage" && (
        <div className="card">
          <div className="card-header"><span className="card-title">Model Lineage Registry</span></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Agent</th><th>Model</th><th>Version Hash</th><th>Fine-tuned</th><th>Drift</th><th>Last Audit</th><th>Status</th></tr>
              </thead>
              <tbody>
                {AGENTS.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, color: "var(--text0)" }}>{a.name}</td>
                    <td><span className="badge badge-purple">{a.model}</span></td>
                    <td><span className="detail-mono">{Math.random().toString(16).slice(2,10)}</span></td>
                    <td>{a.risk === "high" || a.risk === "critical" ? <span className="badge badge-orange">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${a.risk === "critical" ? 78 : a.risk === "high" ? 45 : a.risk === "medium" ? 22 : 8}%`, background: a.risk === "critical" ? "#ef4444" : a.risk === "high" ? "#f59e0b" : "#10b981" }} />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text2)" }}>{a.risk === "critical" ? "78%" : a.risk === "high" ? "45%" : a.risk === "medium" ? "22%" : "8%"}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)", fontSize: 12 }}>3d ago</td>
                    <td><span className={`badge ${a.risk === "critical" ? "badge-red" : a.risk === "high" ? "badge-orange" : "badge-green"}`}>{a.risk === "critical" ? "Review" : a.risk === "high" ? "Monitor" : "Healthy"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "mcp" && (
        <div>
          <div className="grid-2" style={{ marginBottom: 12 }}>
            {MCP_SERVERS.map(s => (
              <div key={s.name} className="card">
                <div className="card-header">
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)" }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>v{s.version}</span>
                  </span>
                  <span className={`badge ${s.risk === "critical" ? "badge-red" : s.risk === "high" ? "badge-orange" : s.risk === "medium" ? "badge-orange" : "badge-green"}`}>{s.risk}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                  {[["Agents", s.agents], ["Invocations", s.invocations.toLocaleString()], ["Status", s.status]].map(([l, v]) => (
                    <div key={l} style={{ textAlign: "center", padding: "6px 4px", background: "var(--bg2)", borderRadius: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text0)" }}>{v}</div>
                      <div style={{ fontSize: 10, color: "var(--text2)" }}>{l}</div>
                    </div>
                  ))}
                </div>
                {s.dataExfil && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "var(--red)", marginBottom: 8 }}>⚠ Data exfiltration risk detected</div>}
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => toast(`Logs exported for ${s.name}`, "info")}>View Logs</button>
                  {s.status !== "restricted" ?
                    <button className="btn btn-danger btn-sm" onClick={() => toast(`${s.name} restricted`, "warning")}>Restrict</button> :
                    <button className="btn btn-primary btn-sm" onClick={() => toast(`${s.name} allowed`, "success")}>Allow</button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "workflow" && (
        <div className="card">
          <div className="card-header"><span className="card-title">Workflow → Control Mapping</span><button className="btn btn-primary btn-sm" onClick={() => toast("Audit package generated", "success")}>↓ Generate Audit Package</button></div>
          <table>
            <thead><tr><th>Workflow</th><th>SOC 2</th><th>HIPAA</th><th>EU AI Act</th><th>NIST</th><th>Missing Controls</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { wf: "Agent Identity Issuance", soc: true, hipaa: true, eu: true, nist: true, missing: 0 },
                { wf: "Consent Collection Flow", soc: true, hipaa: true, eu: false, nist: true, missing: 1 },
                { wf: "Data Pipeline Processing", soc: true, hipaa: false, eu: false, nist: true, missing: 2 },
                { wf: "Shadow AI Detection", soc: true, hipaa: true, eu: true, nist: false, missing: 1 },
                { wf: "Vendor Risk Assessment", soc: false, hipaa: true, eu: true, nist: true, missing: 1 },
                { wf: "Audit Log Generation", soc: true, hipaa: true, eu: true, nist: true, missing: 0 },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: "var(--text0)" }}>{r.wf}</td>
                  {[r.soc, r.hipaa, r.eu, r.nist].map((v, j) => (
                    <td key={j}><span className={`badge ${v ? "badge-green" : "badge-red"}`}>{v ? "✓" : "✗"}</span></td>
                  ))}
                  <td><span className={`badge ${r.missing === 0 ? "badge-green" : r.missing === 1 ? "badge-orange" : "badge-red"}`}>{r.missing} gaps</span></td>
                  <td><span className={`badge ${r.missing === 0 ? "badge-green" : "badge-orange"}`}>{r.missing === 0 ? "Ready" : "Incomplete"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {issueModal && (
        <div className="modal-overlay" onClick={() => setIssueModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Issue Agent Identity Token</span>
              <button className="modal-close" onClick={() => setIssueModal(false)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Agent Name", "e.g. Payment Processor Agent"], ["Department", "e.g. Finance"], ["Environment", ""], ["Owner", ""]].map(([l, ph]) => (
                <div key={l}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{l}</div>
                  <input className="input" placeholder={ph} onChange={e => l === "Agent Name" && setNewAgentName(e.target.value)} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Model</div>
                <select className="input">
                  {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3", "Internal Model"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
                onClick={() => { setIssueModal(false); toast(`Identity token issued: DBQ-AGT-${String(Math.floor(Math.random()*100)).padStart(4,'0')} — ${newAgentName || "New Agent"}`, "success"); }}>
                Issue Identity Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AI GOVERNANCE PAGE ───────────────────────────────────────────────────────
const AIGovernancePage = ({ toast }) => {
  const [activeTab, setActiveTab] = useState("consent");
  const [consentSearch, setConsentSearch] = useState("");
  const [shadowSearch, setShadowSearch] = useState("");

  const tabs = [
    { id: "consent", label: "Consent Registry" },
    { id: "shadow", label: "Shadow AI Monitor" },
    { id: "vendor", label: "Vendor Intelligence" },
    { id: "policy", label: "Policy Engine" },
    { id: "audit", label: "Audit & Hash Ledger" },
    { id: "vault", label: "Enterprise Vault" },
  ];

  const filteredConsent = CONSENT_RECORDS.filter(r =>
    r.subject.toLowerCase().includes(consentSearch.toLowerCase()) ||
    r.agent.toLowerCase().includes(consentSearch.toLowerCase())
  );

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">AI Governance</div>
          <div className="section-subtitle">Consent · Shadow AI · Vendors · Policy · Audit</div>
        </div>
        <div className="section-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => toast("Governance report exported", "info")}>↓ Export</button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {activeTab === "consent" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <span className="search-icon">🔍</span>
              <input className="input" placeholder="Search consent records..." value={consentSearch} onChange={e => setConsentSearch(e.target.value)} style={{ paddingLeft: 32 }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => toast("New consent record created", "success")}>+ New Record</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Subject</th><th>Type</th><th>Status</th><th>Agent</th><th>Granted</th><th>Expiry</th><th>Risk</th><th></th></tr></thead>
              <tbody>
                {filteredConsent.map(r => (
                  <tr key={r.id}>
                    <td className="detail-mono">{r.id}</td>
                    <td style={{ fontWeight: 500, color: "var(--text0)" }}>{r.subject}</td>
                    <td><span className={`badge ${r.type === "Explicit" ? "badge-green" : r.type === "Contractual" ? "badge-blue" : r.type === "Implied" ? "badge-orange" : "badge-purple"}`}>{r.type}</span></td>
                    <td><span className={`badge ${r.status === "valid" ? "badge-green" : r.status === "warning" ? "badge-orange" : "badge-red"}`}>{r.status}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>{r.agent}</td>
                    <td style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{r.date}</td>
                    <td style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{r.expiry}</td>
                    <td><span className={`badge ${r.risk === "low" ? "badge-green" : r.risk === "medium" ? "badge-orange" : "badge-red"}`}>{r.risk}</span></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => toast(`Revocation cascade triggered for ${r.id}`, "warning")}>Revoke</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "shadow" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Unsanctioned Tools", value: 23, color: "#ef4444" },
              { label: "High Risk Users", value: 3, color: "#f59e0b" },
              { label: "Data Exposure Events", value: 8, color: "#ef4444" },
              { label: "Unknown Vendors", value: 11, color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} className="card">
                <div className="card-title" style={{ marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <span className="search-icon">🔍</span>
              <input className="input" placeholder="Search users, tools..." value={shadowSearch} onChange={e => setShadowSearch(e.target.value)} style={{ paddingLeft: 32 }} />
            </div>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>User</th><th>Department</th><th>Unsanctioned Tools</th><th>Sessions</th><th>Exposure</th><th>Risk Score</th><th>Actions</th></tr></thead>
              <tbody>
                {SHADOW_USERS.filter(u => u.name.toLowerCase().includes(shadowSearch.toLowerCase()) || u.dept.toLowerCase().includes(shadowSearch.toLowerCase())).map((u, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: "var(--text0)" }}>{u.name}</td>
                    <td style={{ color: "var(--text2)", fontSize: 12 }}>{u.dept}</td>
                    <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{u.tools.map(t => <span key={t} className="badge badge-gray" style={{ fontSize: 10 }}>{t}</span>)}</div></td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{u.sessions}</td>
                    <td><span className={`badge ${u.exposure === "High" ? "badge-red" : u.exposure === "Medium" ? "badge-orange" : "badge-green"}`}>{u.exposure}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${u.risk}%`, background: u.risk > 80 ? "#ef4444" : u.risk > 60 ? "#f59e0b" : "#10b981" }} />
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: u.risk > 80 ? "var(--red)" : u.risk > 60 ? "var(--accent4)" : "var(--accent3)" }}>{u.risk}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`${u.tools[0]} approved for ${u.name}`, "success")}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => toast(`Access blocked for ${u.name}`, "warning")}>Block</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "vendor" && (
        <div>
          <div className="grid-3" style={{ marginBottom: 12 }}>
            {VENDORS.map(v => (
              <div key={v.name} className="vendor-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="vendor-name">{v.name}</div>
                    <div className="vendor-meta">{v.category}</div>
                  </div>
                  <span className={`badge ${v.risk === "low" ? "badge-green" : v.risk === "medium" ? "badge-orange" : "badge-red"}`}>{v.risk} risk</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[["Status", v.status], ["Data Handling", v.dataHandling], ["Contracts", v.contracts], ["Alerts", v.alerts]].map(([l, val]) => (
                    <div key={l} style={{ fontSize: 11 }}>
                      <span style={{ color: "var(--text2)" }}>{l}: </span>
                      <span style={{ color: val > 0 && l === "Alerts" ? "var(--red)" : "var(--text1)", fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => toast(`${v.name} details opened`, "info")}>View</button>
                  {v.alerts > 0 && <button className="btn btn-danger btn-sm" onClick={() => toast(`${v.name} alert reviewed`, "warning")}>⚠ {v.alerts}</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "policy" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={() => toast("Policy builder opened", "info")}>+ New Policy</button>
            <button className="btn btn-ghost btn-sm" onClick={() => toast("Simulation mode activated", "success")}>⚡ Simulate</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Policy Name</th><th>Status</th><th>Targets</th><th>Scope</th><th>Version</th><th>Last Edit</th><th>Actions</th></tr></thead>
              <tbody>
                {POLICIES.map(p => (
                  <tr key={p.id}>
                    <td className="detail-mono">{p.id}</td>
                    <td style={{ fontWeight: 500, color: "var(--text0)" }}>{p.name}</td>
                    <td><span className={`badge ${p.status === "enforced" ? "badge-green" : p.status === "draft" ? "badge-gray" : "badge-orange"}`}>{p.status}</span></td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{p.targets}</td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>{p.scope}</td>
                    <td><span className="badge badge-blue">{p.version}</span></td>
                    <td style={{ fontSize: 11, color: "var(--text2)" }}>{p.lastEdit}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`Editing ${p.name}`, "info")}>Edit</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`${p.name} rolled back`, "success")}>↩ Rollback</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
            {[
              { label: "Signed Events", value: "1,248", color: "#10b981" },
              { label: "Hash Verifications", value: "1,248", color: "#00d4ff" },
              { label: "Ledger Integrity", value: "100%", color: "#10b981" },
              { label: "Incidents Logged", value: 7, color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} className="card">
                <div className="card-title" style={{ marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Immutable Event Ledger</span>
              <button className="btn btn-primary btn-sm" onClick={() => toast("Audit package exported", "success")}>↓ Export Package</button>
            </div>
            <table>
              <thead><tr><th>Event ID</th><th>Timestamp</th><th>Type</th><th>Source</th><th>Hash</th><th>Severity</th><th>Status</th></tr></thead>
              <tbody>
                {AUDIT_EVENTS.map(e => (
                  <tr key={e.id}>
                    <td className="detail-mono">{e.id}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>{e.time}</td>
                    <td><span className="badge badge-cyan" style={{ fontSize: 10 }}>{e.type}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text1)" }}>{e.agent}</td>
                    <td><span className="detail-mono">{e.hash}</span></td>
                    <td><span className={`badge ${e.severity === "high" || e.severity === "warning" ? "badge-orange" : e.severity === "info" ? "badge-blue" : "badge-green"}`}>{e.severity}</span></td>
                    <td><span className="badge badge-green">✓ Signed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "vault" && (
        <div className="grid-3">
          {[
            { category: "Model Cards", count: 14, icon: "🧠", items: ["GPT-4o Model Card", "Claude 3.5 Card", "Internal Model v2"] },
            { category: "Vendor Contracts", count: 9, icon: "📄", items: ["OpenAI MSA 2025", "Anthropic Agreement", "Azure AI Addendum"] },
            { category: "Certifications", count: 4, icon: "🏅", items: ["SOC 2 Type I", "ISO 27001", "HIPAA BAA", "EU GDPR DPA"] },
            { category: "Policy Documents", count: 22, icon: "📋", items: ["AI Acceptable Use", "Data Retention Policy", "Access Control Policy"] },
            { category: "Audit Reports", count: 7, icon: "📊", items: ["Q4 2025 SOC 2", "Q1 2026 HIPAA", "Annual Risk Assessment"] },
            { category: "Board Reports", count: 3, icon: "🏢", items: ["Q4 2025 AI Governance", "Q1 2026 Risk Summary"] },
          ].map(c => (
            <div key={c.category} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text0)" }}>{c.category}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{c.count} documents</div>
                </div>
              </div>
              {c.items.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "var(--text1)", cursor: "pointer" }}
                  onClick={() => toast(`Opening ${item}`, "info")}>
                  <span style={{ color: "var(--text2)" }}>📎</span>{item}
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 10 }} onClick={() => toast(`Uploading to ${c.category}`, "info")}>+ Upload</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── AUDIT & COMPLIANCE PAGE ──────────────────────────────────────────────────
const AuditPage = ({ toast }) => {
  const [activeFramework, setActiveFramework] = useState("SOC 2");
  const frameworks = {
    "SOC 2": { pct: 87, gaps: 3, color: "#00d4ff", controls: 24, ready: 21, highrisk: ["CC6.1 Logical Access", "CC7.2 System Monitoring"], required: ["Implement MFA for all AI systems", "Complete penetration test", "Finalize incident response runbook"] },
    "HIPAA": { pct: 76, gaps: 7, color: "#10b981", controls: 18, ready: 14, highrisk: ["164.312(a) Access Control", "164.308(a)(5) Security Awareness"], required: ["PHI data map completion", "BAA for 3 vendors", "Risk analysis update", "Encryption key rotation"] },
    "EU AI Act": { pct: 62, gaps: 12, color: "#f59e0b", controls: 31, ready: 19, highrisk: ["Art. 13 Transparency", "Art. 17 Quality Mgmt", "Art. 9 Risk Mgmt"], required: ["Complete conformity assessment", "Register high-risk AI systems", "Implement post-market monitoring"] },
    "ISO 27001": { pct: 91, gaps: 2, color: "#3b82f6", controls: 28, ready: 26, highrisk: ["A.9.1 Access Control Policy"], required: ["Update access control policy", "Complete supplier assessment"] },
    "NIST AI RMF": { pct: 73, gaps: 8, color: "#a78bfa", controls: 22, ready: 16, highrisk: ["GOVERN 1.1", "MAP 3.5", "MEASURE 2.2"], required: ["Complete AI risk profile", "Document AI impact assessments", "Establish AI oversight committee"] },
    "SEC": { pct: 82, gaps: 4, color: "#10b981", controls: 15, ready: 12, highrisk: ["Rule 10b-5 Disclosures", "Form ADV Updates"], required: ["Disclose AI model usage", "Update risk factor disclosures"] },
    "OCC": { pct: 79, gaps: 5, color: "#f59e0b", controls: 18, ready: 14, highrisk: ["Model Risk Management", "Third-Party Risk"], required: ["Model inventory completion", "Vendor due diligence refresh"] },
    "CFPB": { pct: 85, gaps: 3, color: "#00d4ff", controls: 14, ready: 12, highrisk: ["Fair Lending AI Bias", "Adverse Action Notice"], required: ["Bias testing documentation", "Explainability audit"] },
  };

  const f = frameworks[activeFramework];

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Audit & Compliance</div>
          <div className="section-subtitle">Framework coverage · Evidence readiness · Gap analysis</div>
        </div>
        <div className="section-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => toast("Generating executive summary...", "info")}>📄 Exec Summary</button>
          <button className="btn btn-primary btn-sm" onClick={() => toast(`${activeFramework} audit package downloaded`, "success")}>↓ Download Audit Report</button>
        </div>
      </div>

      <div className="tabs">
        {Object.keys(frameworks).map(fw => (
          <button key={fw} className={`tab-btn ${activeFramework === fw ? "active" : ""}`} onClick={() => setActiveFramework(fw)}>{fw}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DonutChart value={f.pct} color={f.color} size={100} stroke={9} />
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text0)", fontFamily: "var(--font-display)" }}>{f.pct}%</div>
                  <div style={{ fontSize: 10, color: "var(--text2)" }}>Coverage</div>
                </div>
              </div>
            </div>
            <div className="card-title">{activeFramework} Readiness</div>
          </div>

          <div className="card">
            {[
              ["Total Controls", f.controls],
              ["Evidence Ready", f.ready],
              ["Gaps Remaining", f.gaps],
            ].map(([l, v]) => (
              <div key={l} className="detail-row">
                <span className="detail-label">{l}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: l === "Gaps Remaining" ? (f.gaps > 5 ? "var(--red)" : "var(--accent4)") : "var(--text0)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">High Risk Areas</span></div>
            {f.highrisk.map(area => (
              <div key={area} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "var(--red)" }}>⚠</span>
                <span style={{ fontSize: 13, color: "var(--text0)", fontWeight: 500 }}>{area}</span>
                <span className="badge badge-red" style={{ marginLeft: "auto" }}>High Risk</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Required Actions</span><span className="badge badge-orange">{f.required.length} Pending</span></div>
            {f.required.map((action, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <input type="checkbox" style={{ accentColor: "var(--accent)" }} onChange={() => toast(`Marked complete: ${action}`, "success")} />
                <span style={{ fontSize: 12, color: "var(--text1)" }}>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INTEGRATIONS PAGE ────────────────────────────────────────────────────────
const IntegrationsPage = ({ toast }) => {
  const [statuses, setStatuses] = useState({});
  const toggleConnect = (name, current) => {
    setStatuses(s => ({ ...s, [name]: current === "connected" ? "disconnected" : "connected" }));
    toast(current === "connected" ? `${name} disconnected` : `${name} connected successfully`, current === "connected" ? "warning" : "success");
  };
  return (
    <div className="page">
      <div className="section-header">
        <div>
          <div className="section-title">Integrations</div>
          <div className="section-subtitle">Connect your AI stack to DataBanq</div>
        </div>
        <div className="section-actions">
          <button className="btn btn-ghost btn-sm">Browse Catalog</button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("Integration request submitted", "info")}>+ Request Integration</button>
        </div>
      </div>

      <div className="grid-3">
        {INTEGRATIONS.map(intg => {
          const status = statuses[intg.name] || intg.status;
          return (
            <div key={intg.name} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, background: "var(--bg3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{intg.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text0)" }}>{intg.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{intg.cat}</div>
                </div>
                <span className={`badge ${status === "connected" ? "badge-green" : status === "pending" ? "badge-orange" : status === "review" ? "badge-red" : "badge-gray"}`} style={{ marginLeft: "auto" }}>
                  {status}
                </span>
              </div>
              {status === "connected" && (
                <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>
                  Last sync: <span style={{ color: "var(--accent3)" }}>{intg.lastSync}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => toggleConnect(intg.name, status)}>
                  {status === "connected" ? "Disconnect" : "Connect"}
                </button>
                {status === "connected" && <button className="btn btn-ghost btn-sm" onClick={() => toast(`${intg.name} syncing...`, "info")}>↻ Sync</button>}
                <button className="btn btn-ghost btn-sm" onClick={() => toast(`${intg.name} settings opened`, "info")}>⚙</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = ({ toast }) => (
  <div className="page">
    <div className="section-header">
      <div><div className="section-title">Settings</div><div className="section-subtitle">Platform configuration and preferences</div></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {["General", "Security", "Notifications", "Team Access", "Data Residency", "API Keys", "Billing"].map(s => (
          <button key={s} className="sidebar-item" style={{ borderRadius: "var(--radius)" }} onClick={() => toast(`${s} settings opened`, "info")}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Organization</div>
          {[["Organization Name", "Acme Financial Corp"], ["Admin Email", "admin@acmefinancial.com"], ["Plan", "Enterprise"], ["Region", "US East"]].map(([l, v]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{l}</div>
              <input className="input" defaultValue={v} style={{ maxWidth: 360 }} />
            </div>
          ))}
          <button className="btn btn-primary btn-sm" onClick={() => toast("Settings saved", "success")}>Save Changes</button>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Notifications</div>
          {[
            ["Critical Risk Alerts", true],
            ["Shadow AI Detections", true],
            ["Policy Violations", true],
            ["Vendor Updates", false],
            ["Weekly Digest", true],
          ].map(([label, def]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13, color: "var(--text1)" }}>{label}</span>
              <label className="toggle"><input type="checkbox" defaultChecked={def} onChange={() => toast(`${label} notifications updated`, "info")} /><span className="toggle-slider" /></label>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DataBanqDemo() {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, add: toast } = useToasts();

  const navItems = [
    { id: "overview", label: "Overview", icon: "⬡" },
    { id: "agents", label: "Agent Governance", icon: "🤖" },
    { id: "governance", label: "AI Governance", icon: "🏛" },
    { id: "audit", label: "Audit & Compliance", icon: "🔏" },
    { id: "integrations", label: "Integrations", icon: "🔗" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <>
      <style>{css}</style>
      <div id="root">
        {/* TOP NAV */}
        <nav className="topnav">
          <div className="topnav-logo">
            <div className="topnav-logo-mark">D</div>
            DataBanq
          </div>
          <div className="topnav-tabs">
            {navItems.map(n => (
              <button key={n.id} className={`topnav-tab ${activeNav === n.id ? "active" : ""}`} onClick={() => setActiveNav(n.id)}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="topnav-right">
            <div className="global-search">
              <span style={{ color: "var(--text2)", fontSize: 12 }}>🔍</span>
              <input placeholder="Search platform..." />
            </div>
            <span className="topnav-badge">Enterprise</span>
            <div style={{ width: 1, height: 20, background: "var(--border)" }} />
            <div className="topnav-avatar">AC</div>
          </div>
        </nav>

        {/* LAYOUT */}
        <div className="layout">
          {/* SIDEBAR */}
          <aside className={`sidebar ${sidebarOpen ? "expanded" : ""}`} onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)}>
            {navItems.map(n => (
              <button key={n.id} className={`sidebar-item ${activeNav === n.id ? "active" : ""}`} onClick={() => setActiveNav(n.id)}>
                <span className="sidebar-icon">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
            <div className="sidebar-divider" />
            <button className="sidebar-item" onClick={() => toast("Support chat opened", "info")}>
              <span className="sidebar-icon">💬</span>
              <span>Support</span>
            </button>
          </aside>

          {/* MAIN */}
          <main className="main">
            {activeNav === "overview" && <OverviewPage toast={toast} />}
            {activeNav === "agents" && <AgentGovernancePage toast={toast} />}
            {activeNav === "governance" && <AIGovernancePage toast={toast} />}
            {activeNav === "audit" && <AuditPage toast={toast} />}
            {activeNav === "integrations" && <IntegrationsPage toast={toast} />}
            {activeNav === "settings" && <SettingsPage toast={toast} />}
          </main>
        </div>

        {/* TOASTS */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <span>{t.type === "success" ? "✓" : t.type === "warning" ? "⚠" : t.type === "error" ? "✕" : "ℹ"}</span>
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
