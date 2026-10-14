(function () {
  "use strict";

  const SAVE_KEY = "ceo-build-or-bust-v1";
  const SAVE_VERSION = 1;
  const TUTORIAL_KEY = "ceo-build-or-bust-tutorial-seen-v1";
  const ACCESS_KEY = "ceo-build-or-bust-accessibility-v1";
  let tutorialStep = 0;
  let accessibility = { largeText: false, highContrast: false, calmMotion: false };
  try {
    const savedAccess = JSON.parse(localStorage.getItem(ACCESS_KEY) || "null");
    if (savedAccess && typeof savedAccess === "object") {
      accessibility = {
        largeText: savedAccess.largeText === true,
        highContrast: savedAccess.highContrast === true,
        calmMotion: savedAccess.calmMotion === true
      };
    }
  } catch {}
  function applyAccessibility() {
    document.body.classList.toggle("large-text", accessibility.largeText);
    document.body.classList.toggle("high-contrast", accessibility.highContrast);
    document.body.classList.toggle("calm-motion", accessibility.calmMotion);
  }
  function saveAccessibility() {
    try { localStorage.setItem(ACCESS_KEY, JSON.stringify(accessibility)); } catch {}
    applyAccessibility();
  }

  const FIRST = ["Ada","Lin","Marco","Priya","Jonah","Elena","Kenji","Amira","Soren","Tess","Rafael","Mei","Omar","Nina","Felix","Hana","Victor","Leila","Dario","Quinn","Ivy","Noel","Samir","Clara","Theo","Aisha","Hugo","Yara","Owen","Sana"];
  const LAST = ["Chen","Okonkwo","Berg","Patel","Alvarez","Sato","Rossi","Khan","Novak","Walsh","Ibrahim","Park","Silva","Costa","Varga","Ng","Brooks","Keller","Duarte","Frost","Rahman","Larsen","Moreau","Shah","Vogel"];

  const ROLES = {
    Developer: { salary: 720, hire: 4200, skill: "dev" },
    Designer: { salary: 640, hire: 3600, skill: "design" },
    Marketer: { salary: 600, hire: 3200, skill: "mkt" },
    Sales: { salary: 620, hire: 3400, skill: "sales" },
    HR: { salary: 560, hire: 2800, skill: "hr" },
    Finance: { salary: 680, hire: 3800, skill: "fin" },
    Researcher: { salary: 740, hire: 4500, skill: "rd" },
    Manager: { salary: 800, hire: 5000, skill: "mgmt" }
  };

  const INDUSTRIES = {
    Technology: {
      blurb: "Stronger R&D and product efficiency. Higher development costs.",
      rd: 1.25, quality: 1.12, devCost: 1.28, viral: 0.92, sales: 1.0, val: 1.15, opex: 1.05, demandVar: 1.0
    },
    Gaming: {
      blurb: "High viral potential and faster customer growth. Unpredictable demand.",
      rd: 0.95, quality: 0.98, devCost: 1.05, viral: 1.42, sales: 1.1, val: 1.1, opex: 1.0, demandVar: 1.55
    },
    AI: {
      blurb: "High growth and valuation multiple. Expensive, slow research.",
      rd: 1.2, quality: 1.08, devCost: 1.45, viral: 1.05, sales: 0.95, val: 1.55, opex: 1.12, demandVar: 1.2
    },
    "E-commerce": {
      blurb: "Strong sales potential. High operating costs.",
      rd: 0.9, quality: 0.96, devCost: 0.95, viral: 1.05, sales: 1.42, val: 0.95, opex: 1.35, demandVar: 1.1
    },
    Software: {
      blurb: "Efficient products and sticky recurring revenue. Weaker marketing punch.",
      rd: 1.1, quality: 1.1, devCost: 1.1, viral: 0.88, sales: 1.18, val: 1.2, opex: 0.95, demandVar: 0.9
    },
    Hardware: {
      blurb: "Higher quality and longer cycles. Heavy operating load.",
      rd: 1.0, quality: 1.18, devCost: 1.35, viral: 0.8, sales: 1.05, val: 0.9, opex: 1.4, demandVar: 0.95
    },
    Entertainment: {
      blurb: "Hits can explode. Reputation and reviews swing harder.",
      rd: 0.92, quality: 1.0, devCost: 1.1, viral: 1.32, sales: 1.08, val: 1.18, opex: 1.08, demandVar: 1.4
    }
  };

  const PRODUCT_CATS = {
    Technology: ["Platform","Cloud","Device OS","Analytics","API"],
    Gaming: ["Action title","Studio tool","Live service","Mobile game","Engine"],
    AI: ["Model API","Copilot","Vision suite","Agent platform","Data engine"],
    "E-commerce": ["Storefront","Marketplace","Fulfillment","Checkout","Loyalty"],
    Software: ["SaaS suite","Productivity","Devtools","Security app","CRM"],
    Hardware: ["Device","Accessory","Chip module","Sensor pack","Workstation"],
    Entertainment: ["Series","Streaming app","Studio kit","Live show","Catalog"]
  };

  const CAMPAIGNS = [
    { id: "social", name: "Social Media", cost: 4500, weeks: 3, reach: 0.9, conv: 0.035, viral: 0.12, var: 0.45 },
    { id: "ads", name: "Advertising", cost: 12000, weeks: 4, reach: 1.4, conv: 0.04, viral: 0.04, var: 0.25 },
    { id: "influencers", name: "Influencers", cost: 18000, weeks: 3, reach: 1.1, conv: 0.05, viral: 0.22, var: 0.7 },
    { id: "search", name: "Search Ads", cost: 8000, weeks: 4, reach: 1.0, conv: 0.055, viral: 0.02, var: 0.2 },
    { id: "events", name: "Events", cost: 22000, weeks: 2, reach: 0.7, conv: 0.08, viral: 0.08, var: 0.35 },
    { id: "pr", name: "PR Campaign", cost: 15000, weeks: 5, reach: 0.85, conv: 0.03, viral: 0.15, var: 0.5 }
  ];

  const RESEARCH = [
    { id: "ai_engine", name: "Advanced AI Engine", cat: "AI", cost: 75000, weeks: 8, desc: "+15% product efficiency", apply: (s) => { s.bonuses.productEff += 0.15; } },
    { id: "perf", name: "Performance Suite", cat: "Performance", cost: 40000, weeks: 6, desc: "+10% product quality", apply: (s) => { s.bonuses.quality += 0.10; } },
    { id: "sec", name: "Security Hardening", cat: "Security", cost: 35000, weeks: 5, desc: "+reputation resilience, fewer outages", apply: (s) => { s.bonuses.security += 0.25; s.reputation = clamp(s.reputation + 3, 0, 100); } },
    { id: "auto", name: "Automation Layer", cat: "Automation", cost: 50000, weeks: 7, desc: "-12% operating costs", apply: (s) => { s.bonuses.opex -= 0.12; } },
    { id: "design", name: "Product Design Lab", cat: "Product Design", cost: 45000, weeks: 6, desc: "+12% customer satisfaction", apply: (s) => { s.bonuses.satisfy += 0.12; } },
    { id: "infra", name: "Infrastructure Mesh", cat: "Infrastructure", cost: 60000, weeks: 8, desc: "+capacity, lower infra incidents", apply: (s) => { s.bonuses.infra += 0.2; s.bonuses.capacity += 0.15; } },
    { id: "conv", name: "Conversion Engine", cat: "Product Design", cost: 30000, weeks: 4, desc: "+8% sales conversion", apply: (s) => { s.bonuses.conv += 0.08; } },
    { id: "viral", name: "Growth Toolkit", cat: "Automation", cost: 25000, weeks: 4, desc: "+18% marketing effectiveness", apply: (s) => { s.bonuses.mkt += 0.18; } },
    { id: "scale", name: "Distributed Compute", cat: "Infrastructure", cost: 90000, weeks: 10, desc: "+25% user capacity", apply: (s) => { s.bonuses.capacity += 0.25; } },
    { id: "trust", name: "Privacy Architecture", cat: "Security", cost: 42000, weeks: 6, desc: "+4 reputation, better retention", apply: (s) => { s.bonuses.retain += 0.08; s.reputation = clamp(s.reputation + 4, 0, 100); } },
    { id: "llmops", name: "Model Operations", cat: "AI", cost: 82000, weeks: 9, desc: "+AI industry leverage", apply: (s) => { s.bonuses.productEff += 0.08; s.bonuses.val += 0.08; } },
    { id: "edge", name: "Edge Delivery", cat: "Performance", cost: 38000, weeks: 5, desc: "+7% demand capture", apply: (s) => { s.bonuses.demand += 0.07; } }
  ];

  const UPGRADES = {
    office: {
      name: "Office",
      hint: "Space, product slots, morale.",
      levels: [
        { cost: 0, label: "Loft", slots: 1, morale: 0, cap: 8 },
        { cost: 22000, label: "Studio", slots: 2, morale: 2, cap: 16 },
        { cost: 55000, label: "Floor", slots: 3, morale: 4, cap: 32 },
        { cost: 120000, label: "HQ", slots: 4, morale: 6, cap: 64 },
        { cost: 280000, label: "Campus", slots: 5, morale: 8, cap: 140 },
        { cost: 700000, label: "Global HQ", slots: 7, morale: 10, cap: 400 }
      ]
    },
    servers: {
      name: "Servers",
      hint: "User capacity and reliability.",
      levels: [
        { cost: 0, label: "Shared box", cap: 1, rel: 0 },
        { cost: 18000, label: "Dedicated", cap: 1.25, rel: 0.05 },
        { cost: 48000, label: "Cluster", cap: 1.6, rel: 0.1 },
        { cost: 110000, label: "Region", cap: 2.1, rel: 0.16 },
        { cost: 260000, label: "Multi-region", cap: 3, rel: 0.22 },
        { cost: 620000, label: "Edge fabric", cap: 4.2, rel: 0.3 }
      ]
    },
    infrastructure: {
      name: "Infrastructure",
      hint: "Ops cost and incident risk.",
      levels: [
        { cost: 0, label: "Basic", opex: 1, risk: 1 },
        { cost: 16000, label: "Monitored", opex: 0.96, risk: 0.85 },
        { cost: 42000, label: "Hardened", opex: 0.9, risk: 0.7 },
        { cost: 98000, label: "SRE desk", opex: 0.84, risk: 0.55 },
        { cost: 220000, label: "Platform eng", opex: 0.76, risk: 0.4 },
        { cost: 520000, label: "Autonomous ops", opex: 0.68, risk: 0.28 }
      ]
    },
    automation: {
      name: "Automation",
      hint: "Fewer people needed per unit of output.",
      levels: [
        { cost: 0, label: "Manual", prod: 1, opex: 1 },
        { cost: 20000, label: "Scripts", prod: 1.06, opex: 0.97 },
        { cost: 52000, label: "Pipelines", prod: 1.14, opex: 0.93 },
        { cost: 125000, label: "Plant", prod: 1.24, opex: 0.88 },
        { cost: 300000, label: "Factory", prod: 1.36, opex: 0.82 },
        { cost: 750000, label: "Lights-out", prod: 1.5, opex: 0.75 }
      ]
    },
    marketingDept: {
      name: "Marketing department",
      hint: "Campaign reach and conversion.",
      levels: [
        { cost: 0, label: "Founder posts", mkt: 1 },
        { cost: 15000, label: "Desk", mkt: 1.12 },
        { cost: 40000, label: "Squad", mkt: 1.26 },
        { cost: 95000, label: "Team", mkt: 1.42 },
        { cost: 210000, label: "Org", mkt: 1.6 },
        { cost: 500000, label: "Machine", mkt: 1.85 }
      ]
    },
    rdLab: {
      name: "R&D lab",
      hint: "Research speed and parallel projects.",
      levels: [
        { cost: 0, label: "Whiteboard", speed: 1, parallel: 1 },
        { cost: 24000, label: "Bench", speed: 1.15, parallel: 1 },
        { cost: 60000, label: "Lab", speed: 1.3, parallel: 2 },
        { cost: 140000, label: "Institute", speed: 1.5, parallel: 2 },
        { cost: 320000, label: "Campus lab", speed: 1.7, parallel: 3 },
        { cost: 800000, label: "Skunkworks", speed: 2.0, parallel: 3 }
      ]
    },
    salesDept: {
      name: "Sales department",
      hint: "Conversion and average revenue.",
      levels: [
        { cost: 0, label: "Inbox", sales: 1 },
        { cost: 14000, label: "Closer", sales: 1.1 },
        { cost: 38000, label: "Pod", sales: 1.22 },
        { cost: 90000, label: "Floor", sales: 1.36 },
        { cost: 200000, label: "Enterprise", sales: 1.52 },
        { cost: 480000, label: "Global sales", sales: 1.72 }
      ]
    }
  };

  const MARKET_STATES = {
    Boom: { demand: 1.28, mkt: 1.2, growth: 0.04, prices: 1.08 },
    Growing: { demand: 1.12, mkt: 1.08, growth: 0.02, prices: 1.03 },
    Stable: { demand: 1.0, mkt: 1.0, growth: 0.005, prices: 1.0 },
    Declining: { demand: 0.88, mkt: 0.9, growth: -0.015, prices: 0.97 },
    Recession: { demand: 0.72, mkt: 0.78, growth: -0.035, prices: 0.9 },
    Crisis: { demand: 0.55, mkt: 0.62, growth: -0.06, prices: 0.82 }
  };

  const COMP_SEED = [
    { name: "Nova Systems", industry: "Technology" },
    { name: "Helixworks", industry: "AI" },
    { name: "PixelForge", industry: "Gaming" },
    { name: "Harbor Cart", industry: "E-commerce" },
    { name: "Lumen Soft", industry: "Software" },
    { name: "Ironthread", industry: "Hardware" },
    { name: "Stage North", industry: "Entertainment" },
    { name: "Kite Analytics", industry: "Technology" }
  ];

  const ACHIEVEMENTS = [
    { id: "rev100k", name: "First $100K week", desc: "Weekly revenue hits $100,000.", test: (s) => s.last.revenue >= 100000 },
    { id: "profit1", name: "In the black", desc: "Post a profitable week.", test: (s) => s.last.profit > 0 },
    { id: "emp100", name: "Century staff", desc: "Employ 100 people.", test: (s) => s.employees.length >= 100 },
    { id: "cust1m", name: "Million users", desc: "Reach 1,000,000 customers.", test: (s) => s.customers >= 1000000 },
    { id: "val1m", name: "Million-dollar shop", desc: "$1M valuation.", test: (s) => s.valuation >= 1e6 },
    { id: "val10m", name: "Series scale", desc: "$10M valuation.", test: (s) => s.valuation >= 1e7 },
    { id: "val100m", name: "Hundred million", desc: "$100M valuation.", test: (s) => s.valuation >= 1e8 },
    { id: "val1b", name: "Unicorn", desc: "$1B valuation.", test: (s) => s.valuation >= 1e9 },
    { id: "w100", name: "Two years", desc: "Survive 100 weeks.", test: (s) => s.week >= 100 },
    { id: "recession", name: "Weather the storm", desc: "Survive a recession.", test: (s) => s.flags.survivedRecession },
    { id: "noloan", name: "Bootstrapped", desc: "Reach $10M without ever taking a loan.", test: (s) => s.valuation >= 1e7 && s.stats.loansTaken === 0 },
    { id: "crisis", name: "Turnaround", desc: "Recover from a major crisis.", test: (s) => s.flags.recoveredCrisis },
    { id: "beatall", name: "Top of the board", desc: "Outvalue every competitor.", test: (s) => s.competitors.every((c) => c.bankrupt || s.valuation > c.valuation) && s.week > 12 },
    { id: "prod10", name: "Catalog", desc: "Launch 10 products.", test: (s) => s.stats.productsLaunched >= 10 },
    { id: "hire50", name: "Hiring machine", desc: "Hire 50 employees (lifetime).", test: (s) => s.stats.hired >= 50 },
    { id: "rep90", name: "Beloved", desc: "Reach 90 reputation.", test: (s) => s.reputation >= 90 },
    { id: "cust1k", name: "First thousand", desc: "1,000 customers.", test: (s) => s.customers >= 1000 },
    { id: "emp10", name: "Real team", desc: "10 employees on payroll.", test: (s) => s.employees.length >= 10 },
    { id: "launch1", name: "Shipped", desc: "Launch your first product.", test: (s) => s.stats.productsLaunched >= 1 },
    { id: "rd1", name: "Lab notes", desc: "Complete a research project.", test: (s) => s.stats.researchDone >= 1 },
    { id: "mkt1", name: "On the air", desc: "Finish a marketing campaign.", test: (s) => s.stats.campaigns >= 1 },
    { id: "w52", name: "One year", desc: "Survive 52 weeks.", test: (s) => s.week >= 52 },
    { id: "profitm", name: "Money printer", desc: "A week with $1M profit.", test: (s) => s.last.profit >= 1e6 },
    { id: "noemp", name: "Clean house", desc: "Fire 10 employees.", test: (s) => s.stats.fired >= 10 },
    { id: "loanpaid", name: "Debt free", desc: "Fully repay a loan.", test: (s) => s.stats.loansRepaid >= 1 },
    { id: "rep30", name: "Reputation risk", desc: "Let reputation fall below 30.", test: (s) => s.reputation < 30 },
    { id: "upgrade5", name: "Fitted out", desc: "Reach combined upgrade level 15.", test: (s) => Object.values(s.upgrades).reduce((a, b) => a + b, 0) >= 15 },
    { id: "viral", name: "It spread", desc: "A campaign goes viral.", test: (s) => s.flags.wentViral },
    { id: "compdead", name: "Vacated chair", desc: "A competitor goes bankrupt.", test: (s) => s.flags.compBankrupt },
    { id: "invest", name: "Diluted", desc: "Accept investor funding.", test: (s) => s.flags.tookInvestment }
  ];

  const EVENTS = [
    {
      id: "server_outage", title: "Server outage", minWeek: 3,
      ok: (s) => liveProducts(s).length > 0,
      text: () => "Your infrastructure failed. Customers are staring at error pages.",
      choices: [
        { label: "Pay for emergency recovery", detail: "Spend $18,000. Restore service, small reputation hit.", apply: (s) => { spend(s, 18000); addRep(s, -1); news(s, "COMPANY", "Emergency recovery restored service."); } },
        { label: "Ignore it", detail: "Users churn. Reputation drops.", apply: (s) => { churnUsers(s, 0.12); addRep(s, -6); s.flags.needInfra = true; } },
        { label: "Invest in infrastructure", detail: "Spend $28,000. Gain a reliability bonus.", apply: (s) => { spend(s, 28000); s.bonuses.infra += 0.08; addRep(s, 1); } }
      ]
    },
    {
      id: "comp_launch", title: "Competitor launch", minWeek: 5,
      text: (s) => rival(s) + " released a competing product.",
      choices: [
        { label: "Lower prices 12%", detail: "Keep users. Margins suffer.", apply: (s) => { liveProducts(s).forEach((p) => { p.price = Math.max(1, Math.round(p.price * 0.88)); }); news(s, "COMPANY", "Prices were cut to match a rival."); } },
        { label: "Increase marketing", detail: "Spend $10,000 on a counter-campaign.", apply: (s) => { spend(s, 10000); s.bonuses.mkt += 0.05; } },
        { label: "Improve your product", detail: "Spend $14,000. Quality +6.", apply: (s) => { spend(s, 14000); liveProducts(s).forEach((p) => { p.quality = clamp(p.quality + 6, 1, 100); }); } },
        { label: "Ignore them", detail: "They take some share.", apply: (s) => { churnUsers(s, 0.06); } }
      ]
    },
    {
      id: "viral", title: "Viral moment", minWeek: 6,
      ok: (s) => liveProducts(s).length > 0,
      text: () => "Your product is suddenly everywhere.",
      choices: [
        { label: "Scale infrastructure", detail: "Spend $16,000. Capture the wave.", apply: (s) => { spend(s, 16000); burstUsers(s, 0.35); s.flags.wentViral = true; addRep(s, 4); } },
        { label: "Spend on marketing", detail: "Spend $12,000. Even more reach.", apply: (s) => { spend(s, 12000); burstUsers(s, 0.28); s.bonuses.mkt += 0.04; s.flags.wentViral = true; addRep(s, 3); } },
        { label: "Do nothing", detail: "Some new users. Servers may buckle.", apply: (s) => { burstUsers(s, 0.12); if (Math.random() > 0.45) { addRep(s, -3); churnUsers(s, 0.05); } s.flags.wentViral = true; } }
      ]
    },
    {
      id: "poach", title: "Employee poaching", minWeek: 4,
      ok: (s) => s.employees.length > 1,
      text: (s) => rival(s) + " wants your best " + bestEmployee(s).role.toLowerCase() + ", " + bestEmployee(s).name + ".",
      choices: [
        { label: "Give a raise", detail: "+25% salary, morale up.", apply: (s) => { const e = bestEmployee(s); e.salary = Math.round(e.salary * 1.25); e.morale = clamp(e.morale + 18, 0, 100); e.stress = clamp(e.stress - 6, 0, 100); } },
        { label: "Promote them", detail: "They become a manager.", apply: (s) => { const e = bestEmployee(s); e.role = "Manager"; e.salary = Math.round(e.salary * 1.2); e.morale = clamp(e.morale + 12, 0, 100); } },
        { label: "Let them leave", detail: "They walk. Team morale dips.", apply: (s) => { const e = bestEmployee(s); s.employees = s.employees.filter((x) => x.id !== e.id); s.stats.fired += 1; teamMorale(s, -8); addRep(s, -1); } }
      ]
    },
    {
      id: "investor", title: "Investor offer", minWeek: 8,
      text: () => "An investor offers cash for a slice of the company.",
      choices: [
        { label: "Accept 12% for a check", detail: "Cash in. Dilution. Valuation bump.", apply: (s) => { const amt = Math.max(80000, Math.round(s.valuation * 0.12)); s.cash += amt; s.flags.equity = (s.flags.equity || 0) + 12; s.flags.tookInvestment = true; s.valuation = Math.round(s.valuation * 1.08); news(s, "COMPANY", "Took an investor check."); } },
        { label: "Reject", detail: "Stay independent.", apply: (s) => { news(s, "COMPANY", "Turned down an investor."); } },
        { label: "Negotiate", detail: "50/50: better terms or they walk.", apply: (s) => {
          if (Math.random() < 0.5 + s.reputation / 300) {
            const amt = Math.max(70000, Math.round(s.valuation * 0.08));
            s.cash += amt; s.flags.equity = (s.flags.equity || 0) + 8; s.flags.tookInvestment = true;
            toast("Negotiated 8% for " + money(amt));
          } else { toast("They walked."); addRep(s, -1); }
        } }
      ]
    },
    {
      id: "recession", title: "Recession", minWeek: 12,
      text: () => "The market contracts. Demand, marketing, and prices all weaken.",
      choices: [
        { label: "Cut costs", detail: "Freeze hiring flag. Morale -6.", apply: (s) => { setMarket(s, "Recession"); s.flags.hiringFreeze = 8; teamMorale(s, -6); s.flags.sawRecession = true; } },
        { label: "Double down", detail: "Spend $20,000 to keep growing.", apply: (s) => { setMarket(s, "Recession"); spend(s, 20000); s.bonuses.mkt += 0.06; s.flags.sawRecession = true; } },
        { label: "Hold cash", detail: "Ride it out conservatively.", apply: (s) => { setMarket(s, "Recession"); s.flags.sawRecession = true; } }
      ]
    },
    {
      id: "reg", title: "Regulatory change", minWeek: 10,
      text: (s) => "New rules hit the " + s.company.industry + " sector.",
      choices: [
        { label: "Comply fully", detail: "Spend $22,000. Reputation +4.", apply: (s) => { spend(s, 22000); addRep(s, 4); s.bonuses.opex += 0.03; } },
        { label: "Lobby", detail: "Spend $12,000. Uncertain outcome.", apply: (s) => { spend(s, 12000); if (Math.random() < 0.5) addRep(s, 2); else { addRep(s, -3); s.bonuses.opex += 0.05; } } },
        { label: "Delay", detail: "Save cash. Risk a fine later.", apply: (s) => { s.flags.regRisk = (s.flags.regRisk || 0) + 1; addRep(s, -2); } }
      ]
    },
    {
      id: "review", title: "Influencer review", minWeek: 5,
      ok: (s) => liveProducts(s).length > 0,
      text: () => "A major creator is reviewing your product.",
      choices: [
        { label: "Send a brief and access", detail: "Spend $4,000. Bias the odds slightly.", apply: (s) => { spend(s, 4000); influencer(s, 0.15); } },
        { label: "Stay hands-off", detail: "Pure roll of the dice.", apply: (s) => influencer(s, 0) },
        { label: "Ask for a delay", detail: "Skip the review. Missed chance.", apply: (s) => { news(s, "COMPANY", "Passed on an influencer review."); } }
      ]
    },
    {
      id: "bug", title: "Product bug", minWeek: 4,
      ok: (s) => liveProducts(s).length > 0,
      text: () => "A major bug is damaging reputation.",
      choices: [
        { label: "All-hands patch", detail: "Spend $9,000. Quality recovers.", apply: (s) => { spend(s, 9000); liveProducts(s).forEach((p) => { p.quality = clamp(p.quality + 4, 1, 100); }); addRep(s, -1); } },
        { label: "Quiet hotfix", detail: "Cheap. Some users leave.", apply: (s) => { spend(s, 2500); churnUsers(s, 0.05); addRep(s, -3); } },
        { label: "Public apology", detail: "Reputation +2 after a dip. $6,000 credits.", apply: (s) => { spend(s, 6000); addRep(s, 1); liveProducts(s).forEach((p) => { p.quality = clamp(p.quality + 2, 1, 100); }); } }
      ]
    },
    {
      id: "comp_bankrupt", title: "Competitor bankruptcy", minWeek: 16,
      ok: (s) => s.competitors.some((c) => !c.bankrupt),
      text: (s) => { const c = weakest(s); return c.name + " is collapsing. Their customers are looking for a home."; },
      choices: [
        { label: "Acquire scraps", detail: "Spend $30,000. Absorb users.", apply: (s) => { const c = weakest(s); spend(s, 30000); burstUsers(s, 0.2); c.bankrupt = true; s.flags.compBankrupt = true; addRep(s, 2); } },
        { label: "Hire their talent", detail: "Spend $12,000. Two mid hires.", apply: (s) => { spend(s, 12000); hireInstant(s, "Developer", 62); hireInstant(s, "Designer", 58); const c = weakest(s); c.bankrupt = true; s.flags.compBankrupt = true; } },
        { label: "Let the market settle", detail: "Modest organic gain.", apply: (s) => { burstUsers(s, 0.08); weakest(s).bankrupt = true; s.flags.compBankrupt = true; } }
      ]
    },
    {
      id: "talent", title: "Talent shortage", minWeek: 6,
      text: () => "Hiring is expensive this month. Every shop is bidding.",
      choices: [
        { label: "Pay the premium", detail: "Hiring costs +35% for 10 weeks.", apply: (s) => { s.flags.hirePremium = 10; } },
        { label: "Train internally", detail: "Spend $8,000. Team skill up.", apply: (s) => { spend(s, 8000); s.employees.forEach((e) => { e.skill = clamp(e.skill + 4, 1, 100); e.stress += 4; }); } },
        { label: "Freeze hiring", detail: "No new hires for 8 weeks.", apply: (s) => { s.flags.hiringFreeze = 8; } }
      ]
    },
    {
      id: "lease", title: "Lease increase", minWeek: 8,
      text: () => "The landlord is raising the office lease.",
      choices: [
        { label: "Accept", detail: "Office costs +18%.", apply: (s) => { s.bonuses.officeCost += 0.18; } },
        { label: "Renegotiate", detail: "Spend $5,000 in legal. 60% chance to blunt it.", apply: (s) => { spend(s, 5000); s.bonuses.officeCost += Math.random() < 0.6 ? 0.06 : 0.18; } },
        { label: "Go remote-heavy", detail: "Costs down, morale mixed.", apply: (s) => { s.bonuses.officeCost -= 0.08; teamMorale(s, -4); s.bonuses.prod += -0.03; } }
      ]
    },
    {
      id: "breach", title: "Data scare", minWeek: 7,
      text: () => "A researcher claims your stack is leaking metadata.",
      choices: [
        { label: "Audit and patch", detail: "Spend $19,000. Reputation +2.", apply: (s) => { spend(s, 19000); addRep(s, 2); s.bonuses.security += 0.1; } },
        { label: "Deny", detail: "If they are right, it gets worse.", apply: (s) => { if (Math.random() < 0.5) { addRep(s, -8); churnUsers(s, 0.1); } else addRep(s, -1); } },
        { label: "Quiet fix", detail: "Spend $7,000. Mild churn.", apply: (s) => { spend(s, 7000); addRep(s, -2); } }
      ]
    },
    {
      id: "award", title: "Award nomination", minWeek: 14,
      ok: (s) => s.reputation >= 55 && liveProducts(s).length > 0,
      text: () => "The industry shortlisted you for a product award.",
      choices: [
        { label: "Campaign for it", detail: "Spend $11,000. Likely reputation win.", apply: (s) => { spend(s, 11000); addRep(s, 5); burstUsers(s, 0.08); } },
        { label: "Stay humble", detail: "Small reputation bump.", apply: (s) => addRep(s, 2) }
      ]
    },
    {
      id: "supply", title: "Supply delay", minWeek: 5,
      ok: (s) => s.company.industry === "Hardware" || s.company.industry === "E-commerce" || Math.random() < 0.4,
      text: () => "A supplier slipped. Delivery dates moved.",
      choices: [
        { label: "Air freight", detail: "Spend $15,000. Stay on schedule.", apply: (s) => spend(s, 15000) },
        { label: "Wait", detail: "Development +2 weeks on active products.", apply: (s) => { s.products.forEach((p) => { if (p.status === "development") p.weeksLeft += 2; }); } },
        { label: "Switch vendor", detail: "Spend $8,000. Quality -3 risk.", apply: (s) => { spend(s, 8000); if (Math.random() < 0.4) liveProducts(s).forEach((p) => { p.quality = clamp(p.quality - 3, 1, 100); }); } }
      ]
    },
    {
      id: "audit", title: "Tax audit", minWeek: 18,
      text: () => "Revenue service wants a closer look at the books.",
      choices: [
        { label: "Cooperate", detail: "Spend $9,000 in accounting. Clean.", apply: (s) => { spend(s, 9000); addRep(s, 1); } },
        { label: "Aggressive defense", detail: "Spend $16,000. May save more.", apply: (s) => { spend(s, 16000); if (Math.random() < 0.3) { s.cash -= 25000; addRep(s, -4); toast("Penalties applied."); } } }
      ]
    },
    {
      id: "partner", title: "Partnership offer", minWeek: 9,
      text: (s) => rival(s) + " wants a distribution partnership.",
      choices: [
        { label: "Accept", detail: "Users +8%. Revenue share 6%.", apply: (s) => { s.flags.revShare = (s.flags.revShare || 0) + 0.06; burstUsers(s, 0.08); addRep(s, 2); } },
        { label: "Decline", detail: "Stay independent.", apply: () => {} },
        { label: "Exclusive, expensive", detail: "Spend $20,000. Users +14%.", apply: (s) => { spend(s, 20000); burstUsers(s, 0.14); addRep(s, 3); } }
      ]
    },
    {
      id: "burnout", title: "Key burnout", minWeek: 7,
      ok: (s) => s.employees.some((e) => e.stress > 60) || s.employees.length > 0,
      text: () => "A core employee is close to walking out.",
      choices: [
        { label: "Force vacation", detail: "They sit out 3 weeks. Stress down.", apply: (s) => { const e = s.employees.slice().sort((a, b) => b.stress - a.stress)[0]; e.stress = 20; e.morale = clamp(e.morale + 10, 0, 100); e.off = 3; } },
        { label: "Bonus", detail: "Spend $6,000. Morale up, stress slightly down.", apply: (s) => { spend(s, 6000); const e = s.employees.slice().sort((a, b) => b.stress - a.stress)[0]; e.morale = clamp(e.morale + 14, 0, 100); e.stress = clamp(e.stress - 8, 0, 100); } },
        { label: "Push through", detail: "They might quit.", apply: (s) => { const e = s.employees.slice().sort((a, b) => b.stress - a.stress)[0]; if (Math.random() < 0.45) { s.employees = s.employees.filter((x) => x.id !== e.id); teamMorale(s, -6); toast(e.name + " quit."); } else e.stress = clamp(e.stress + 10, 0, 100); } }
      ]
    },
    {
      id: "boom", title: "Market boom", minWeek: 10,
      text: () => "Capital is cheap and buyers are loud.",
      choices: [
        { label: "Ride it", detail: "Market shifts to Boom.", apply: (s) => setMarket(s, "Boom") },
        { label: "Raise prices", detail: "Boom + 8% price hike.", apply: (s) => { setMarket(s, "Boom"); liveProducts(s).forEach((p) => { p.price = Math.round(p.price * 1.08); }); } }
      ]
    },
    {
      id: "press", title: "Negative press", minWeek: 6,
      text: () => "A trade desk ran a harsh piece on culture and delivery.",
      choices: [
        { label: "Respond in public", detail: "Reputation -2, then +1 next weeks if you ship.", apply: (s) => { addRep(s, -2); s.flags.needShip = true; } },
        { label: "Internal only", detail: "Reputation -5.", apply: (s) => addRep(s, -5) },
        { label: "PR retainers", detail: "Spend $13,000. Blunt the story.", apply: (s) => { spend(s, 13000); addRep(s, -1); } }
      ]
    },
    {
      id: "patent", title: "Patent dispute", minWeek: 15,
      text: () => "A holding company claims your core loop is theirs.",
      choices: [
        { label: "Settle", detail: "Spend $35,000. It goes away.", apply: (s) => spend(s, 35000) },
        { label: "Fight", detail: "Spend $12,000 now. 50% chance of a $60,000 loss later.", apply: (s) => { spend(s, 12000); s.flags.patentFight = Math.random() < 0.5 ? 6 : 0; if (!s.flags.patentFight) addRep(s, 2); } },
        { label: "Redesign", detail: "Spend $18,000. Quality -4, legal risk gone.", apply: (s) => { spend(s, 18000); liveProducts(s).forEach((p) => { p.quality = clamp(p.quality - 4, 1, 100); }); } }
      ]
    },
    {
      id: "grant", title: "Government grant", minWeek: 11,
      text: () => "A public R&D grant is available if you accept reporting overhead.",
      choices: [
        { label: "Take it", detail: "+$40,000. Research slightly slower paperwork.", apply: (s) => { s.cash += 40000; s.bonuses.rdSpeed -= 0.05; addRep(s, 2); } },
        { label: "Pass", detail: "No strings.", apply: () => {} }
      ]
    },
    {
      id: "pricing_protest", title: "Customer protest", minWeek: 8,
      ok: (s) => liveProducts(s).some((p) => p.price > 20),
      text: () => "Users are organizing against your pricing.",
      choices: [
        { label: "Cut 10%", detail: "Goodwill. Less revenue per user.", apply: (s) => { liveProducts(s).forEach((p) => { p.price = Math.max(1, Math.round(p.price * 0.9)); }); addRep(s, 3); } },
        { label: "Hold the line", detail: "Churn and a reputation nick.", apply: (s) => { churnUsers(s, 0.07); addRep(s, -3); } },
        { label: "Add a cheaper tier", detail: "Spend $6,000. Softens the blow.", apply: (s) => { spend(s, 6000); burstUsers(s, 0.04); addRep(s, 1); } }
      ]
    },
    {
      id: "conf", title: "Industry conference", minWeek: 6,
      text: () => "The annual conference is next week. Presence is optional, and expensive.",
      choices: [
        { label: "Keynote booth", detail: "Spend $17,000. Reach and reputation.", apply: (s) => { spend(s, 17000); addRep(s, 3); s.bonuses.mkt += 0.05; burstUsers(s, 0.05); } },
        { label: "Send two people", detail: "Spend $4,000.", apply: (s) => { spend(s, 4000); addRep(s, 1); } },
        { label: "Skip", detail: "Save the cash.", apply: () => {} }
      ]
    },
    {
      id: "hwfail", title: "Hardware failure", minWeek: 4,
      text: () => "A rack failed in the middle of the day.",
      choices: [
        { label: "Replace now", detail: "Spend $11,000.", apply: (s) => spend(s, 11000) },
        { label: "Degrade service", detail: "Quality -5 for a while.", apply: (s) => { liveProducts(s).forEach((p) => { p.quality = clamp(p.quality - 5, 1, 100); p.tempQual = 6; }); } }
      ]
    },
    {
      id: "casestudy", title: "Case study", minWeek: 12,
      ok: (s) => s.customers > 500,
      text: () => "A flagship customer wants to publish a case study.",
      choices: [
        { label: "Greenlight", detail: "Reputation +5, modest user bump.", apply: (s) => { addRep(s, 5); burstUsers(s, 0.06); } },
        { label: "Negotiate quotes", detail: "Spend $3,000. Safer quotes.", apply: (s) => { spend(s, 3000); addRep(s, 3); } }
      ]
    },
    {
      id: "pr_intern", title: "Public misstep", minWeek: 5,
      text: () => "Someone on the team posted something they should not have.",
      choices: [
        { label: "Own it", detail: "Reputation -2. Culture +.", apply: (s) => { addRep(s, -2); teamMorale(s, 4); } },
        { label: "Quietly fire", detail: "If you have staff to spare.", apply: (s) => { if (s.employees.length > 1) { s.employees.pop(); s.stats.fired += 1; teamMorale(s, -7); addRep(s, -1); } else addRep(s, -4); } },
        { label: "Ignore", detail: "Reputation -6.", apply: (s) => addRep(s, -6) }
      ]
    },
    {
      id: "acq_offer", title: "Acquisition offer", minWeek: 24,
      ok: (s) => s.valuation > 400000,
      text: (s) => "A larger firm offers " + money(Math.round(s.valuation * 0.85)) + " to buy you outright. The game would continue as an independent — this is a cash-out event, not an ending.",
      choices: [
        { label: "Take a partial sale", detail: "Cash equal to 40% of valuation. Give 25% equity.", apply: (s) => { s.cash += Math.round(s.valuation * 0.4); s.flags.equity = (s.flags.equity || 0) + 25; s.flags.tookInvestment = true; addRep(s, 2); } },
        { label: "Refuse", detail: "Stay the course.", apply: (s) => addRep(s, 1) }
      ]
    },
    {
      id: "rates", title: "Interest rate shock", minWeek: 9,
      text: () => "Credit just got more expensive.",
      choices: [
        { label: "Refinance later", detail: "New loans cost more for 20 weeks.", apply: (s) => { s.flags.rateHike = 20; } },
        { label: "Pay down debt", detail: "Dump 30% of cash into loans if any.", apply: (s) => {
          s.flags.rateHike = 10;
          if (!s.loans.length) return;
          const pay = Math.round(s.cash * 0.3);
          repayLoans(s, pay);
        } }
      ]
    },
    {
      id: "cloudhike", title: "Cloud price hike", minWeek: 8,
      text: () => "Your provider is raising infrastructure prices 20%.",
      choices: [
        { label: "Accept", detail: "Infra costs up.", apply: (s) => { s.bonuses.infraCost += 0.2; } },
        { label: "Migrate", detail: "Spend $14,000 and 3 weeks of drag.", apply: (s) => { spend(s, 14000); s.bonuses.prod -= 0.04; s.flags.migrateDrag = 3; } },
        { label: "Commit annual", detail: "Spend $25,000 now, lock old rates.", apply: (s) => spend(s, 25000) }
      ]
    },
    {
      id: "oss", title: "Open source love", minWeek: 10,
      ok: (s) => s.company.industry === "Software" || s.company.industry === "Technology" || s.company.industry === "AI",
      text: () => "The community is forking, starring, and writing about you.",
      choices: [
        { label: "Open a core module", detail: "Reputation +6, slightly easier hiring.", apply: (s) => { addRep(s, 6); s.bonuses.hireCost -= 0.08; } },
        { label: "Keep closed", detail: "Smaller bump.", apply: (s) => addRep(s, 2) }
      ]
    },
    {
      id: "seasonal", title: "Seasonal spike", minWeek: 6,
      text: () => "Demand is about to jump for four weeks.",
      choices: [
        { label: "Staff up temps", detail: "Spend $9,000. Capture more of the spike.", apply: (s) => { spend(s, 9000); s.flags.season = 4; s.flags.seasonPow = 1.25; } },
        { label: "Ride organic", detail: "A smaller spike.", apply: (s) => { s.flags.season = 4; s.flags.seasonPow = 1.12; } }
      ]
    },
    {
      id: "whistle", title: "Whistleblower threat", minWeek: 20,
      ok: (s) => s.employees.length >= 6,
      text: () => "Someone claims the books or the culture would not survive daylight.",
      choices: [
        { label: "Independent review", detail: "Spend $20,000. Reputation +3.", apply: (s) => { spend(s, 20000); addRep(s, 3); teamMorale(s, 5); } },
        { label: "Settlement quiet", detail: "Spend $28,000. Risk remains.", apply: (s) => { spend(s, 28000); addRep(s, -2); } },
        { label: "Ignore", detail: "High risk of a later hit.", apply: (s) => { if (Math.random() < 0.55) { addRep(s, -10); s.cash -= 40000; } } }
      ]
    },
    {
      id: "pricewar", title: "Price war", minWeek: 13,
      text: (s) => rival(s) + " slashed prices across their catalog.",
      choices: [
        { label: "Match", detail: "Prices -15%.", apply: (s) => liveProducts(s).forEach((p) => { p.price = Math.max(1, Math.round(p.price * 0.85)); }) },
        { label: "Differentiate", detail: "Spend $12,000 on quality.", apply: (s) => { spend(s, 12000); liveProducts(s).forEach((p) => { p.quality = clamp(p.quality + 5, 1, 100); }); } },
        { label: "Hold premium", detail: "You will lose price-sensitive users.", apply: (s) => churnUsers(s, 0.08) }
      ]
    },
    {
      id: "keynote", title: "Platform keynote", minWeek: 16,
      ok: (s) => s.reputation >= 48,
      text: () => "A platform company wants you on their stage.",
      choices: [
        { label: "Accept", detail: "Burst of users. You owe a launch.", apply: (s) => { burstUsers(s, 0.16); addRep(s, 4); s.flags.needShip = true; } },
        { label: "Decline", detail: "Stay heads-down.", apply: () => {} }
      ]
    }
  ];

  /* ---------- utils ---------- */
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function irand(a, b) { return Math.floor(rand(a, b + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function money(n) {
    const v = Math.round(n);
    const sign = v < 0 ? "-" : "";
    const a = Math.abs(v);
    if (a >= 1e12) return sign + "$" + (a / 1e12).toFixed(2) + "T";
    if (a >= 1e9) return sign + "$" + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return sign + "$" + (a / 1e6).toFixed(2) + "M";
    return sign + "$" + a.toLocaleString("en-US");
  }
  function pct(n) { return (n >= 0 ? "+" : "") + n.toFixed(0) + "%"; }
  function el(id) { return document.getElementById(id); }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function industry(s) { return INDUSTRIES[s.company.industry] || INDUSTRIES.Technology; }
  function liveProducts(s) { return s.products.filter((p) => ["launch", "growth", "maturity", "decline"].includes(p.status)); }
  function roleCount(s, role) { return s.employees.filter((e) => e.role === role && !e.off).length; }
  function skillSum(s, role) {
    return s.employees.filter((e) => e.role === role && !e.off).reduce((a, e) => a + effectiveProd(e), 0);
  }
  function effectiveProd(e) {
    const morale = 0.6 + e.morale / 250;
    const stress = 1 - e.stress / 280;
    return e.skill * morale * stress * (e.productivity || 1);
  }
  function bestEmployee(s) {
    return s.employees.slice().sort((a, b) => effectiveProd(b) - effectiveProd(a))[0] || s.employees[0];
  }
  function rival(s) {
    const alive = s.competitors.filter((c) => !c.bankrupt);
    return (alive[0] || s.competitors[0]).name;
  }
  function weakest(s) {
    return s.competitors.filter((c) => !c.bankrupt).slice().sort((a, b) => a.valuation - b.valuation)[0] || s.competitors[0];
  }

  function addRep(s, n) { s.reputation = clamp(Math.round(s.reputation + n), 0, 100); }
  function teamMorale(s, n) { s.employees.forEach((e) => { e.morale = clamp(e.morale + n, 0, 100); }); }
  function spend(s, n) { s.cash -= n; }
  function news(s, tag, text) {
    s.news.unshift({ week: s.week, year: s.year, tag, text });
    if (s.news.length > 80) s.news.length = 80;
  }
  function activity(s, text) {
    s.activity.unshift({ week: s.week, text });
    if (s.activity.length > 40) s.activity.length = 40;
  }
  function toast(title, body) {
    const wrap = el("toasts");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = "<strong>" + esc(title) + "</strong>" + (body ? "<div>" + esc(body) + "</div>" : "");
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 4200);
  }
  function esc(str) {
    const map = {
      "&": "\u0026amp;",
      "<": "\u0026lt;",
      ">": "\u0026gt;",
      '"': "\u0026quot;",
      "'": "\u0026#39;"
    };
    return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
  }
  function setMarket(s, name) {
    s.market.state = name;
    Object.assign(s.market, MARKET_STATES[name]);
    news(s, "MARKET", "Market is now " + name + ".");
  }
  function churnUsers(s, frac) {
    liveProducts(s).forEach((p) => { const lost = Math.round(p.users * frac); p.users = Math.max(0, p.users - lost); });
    recalcCustomers(s);
  }
  function burstUsers(s, frac) {
    const base = Math.max(80, s.customers);
    liveProducts(s).forEach((p) => { p.users += Math.round(Math.max(p.users, base * 0.2) * frac * (0.6 + p.quality / 200)); });
    if (!liveProducts(s).length && s.products.length) s.products[0].users += Math.round(120 * frac * 10);
    recalcCustomers(s);
  }
  function recalcCustomers(s) {
    s.customers = s.products.reduce((a, p) => a + (p.users || 0), 0);
  }
  function influencer(s, bias) {
    const roll = Math.random() + bias;
    if (roll > 0.66) { addRep(s, 6); burstUsers(s, 0.18); news(s, "COMPANY", "Influencer review was glowing."); toast("Glowing review"); }
    else if (roll > 0.33) { addRep(s, 1); burstUsers(s, 0.04); news(s, "COMPANY", "Influencer review was mixed."); toast("Mixed review"); }
    else { addRep(s, -6); churnUsers(s, 0.08); news(s, "COMPANY", "Influencer review was harsh."); toast("Harsh review"); }
  }
  function hireInstant(s, role, skill) {
    s.employees.push(makeEmployee(role, skill));
    s.stats.hired += 1;
  }
  function makeEmployee(role, skill) {
    const spec = ROLES[role];
    const sk = skill || irand(38, 72);
    return {
      id: uid(),
      name: pick(FIRST) + " " + pick(LAST),
      role,
      skill: sk,
      productivity: 1,
      salary: Math.round(spec.salary * (0.75 + sk / 150)),
      morale: irand(55, 78),
      stress: irand(15, 40),
      off: 0
    };
  }
  function productSlots(s) {
    return UPGRADES.office.levels[s.upgrades.office].slots;
  }

  /* ---------- state ---------- */
  let state = null;
  let view = "dashboard";
  let autoTimer = 0;
  let autoLeft = 0;
  let paused = false;
  let modalOpen = false;
  let selectedIndustry = "Technology";
  let lastEventId = "";
  let warnedCash = false;
  let unicornShown = false;

  function defaultStats() {
    return {
      totalRevenue: 0, totalProfit: 0, highestRevenue: 0, highestValuation: 100000,
      customersPeak: 0, hired: 1, fired: 0, productsLaunched: 0, productsRetired: 0,
      campaigns: 0, researchDone: 0, weeks: 0, loansTaken: 0, loansRepaid: 0,
      bankruptcies: 0, achievements: 0, employeesQuit: 0
    };
  }

  function newState(company, ceo, ind) {
    const comps = COMP_SEED.map((c, i) => ({
      id: uid(),
      name: c.name,
      industry: c.industry,
      revenue: 8000 + i * 3500 + irand(0, 4000),
      customers: 400 + i * 220 + irand(0, 200),
      valuation: 180000 + i * 90000 + irand(0, 50000),
      reputation: 40 + i * 4,
      growth: rand(0.002, 0.02),
      bankrupt: false
    }));
    const founder = makeEmployee("Developer", 64);
    founder.name = ceo.split(" ")[0] + " " + (ceo.split(" ")[1] || pick(LAST));
    founder.salary = 600;
    founder.morale = 78;
    return {
      version: SAVE_VERSION,
      company: { name: company, ceo: ceo, industry: ind, foundedWeek: 1, foundedYear: 1 },
      week: 1, year: 1, cash: 100000,
      employees: [founder],
      products: [],
      campaigns: [],
      research: [],
      researchDone: [],
      upgrades: { office: 0, servers: 0, infrastructure: 0, automation: 0, marketingDept: 0, rdLab: 0, salesDept: 0 },
      competitors: comps,
      market: { state: "Stable", ...MARKET_STATES.Stable },
      loans: [],
      invested: 0,
      reputation: 50,
      customers: 0,
      valuation: 100000,
      bonuses: { productEff: 0, quality: 0, security: 0, opex: 0, satisfy: 0, infra: 0, capacity: 0, conv: 0, mkt: 0, retain: 0, val: 0, demand: 0, prod: 0, officeCost: 0, infraCost: 0, rdSpeed: 0, hireCost: 0, sales: 0 },
      history: { revenue: [0], profit: [0], customers: [0], valuation: [100000] },
      news: [{ week: 1, year: 1, tag: "COMPANY", text: company + " incorporated in " + ind + "." }],
      activity: [{ week: 1, text: company + " opened its doors." }],
      achievements: {},
      stats: defaultStats(),
      flags: { equity: 0 },
      last: { revenue: 0, expenses: 0, profit: 0, customers: 0, reputation: 0, valuation: 0 },
      historyLog: [{ week: 1, title: "Founded", text: company + " was founded by " + ceo + "." }],
      milestones: []
    };
  }

  /* ---------- persistence ---------- */
  function save(reason) {
    if (!state) return;
    try {
      const prev = localStorage.getItem(SAVE_KEY);
      if (prev && reason !== "bankrupt") localStorage.setItem(SAVE_KEY + ":bak", prev);
      const blob = JSON.stringify(state);
      localStorage.setItem(SAVE_KEY, blob);
      if (reason === "new") localStorage.setItem(SAVE_KEY + ":bak", blob);
    } catch (err) { /* private mode / quota */ }
  }
  function loadRaw(raw) {
    const s = JSON.parse(raw);
    const isRecord = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
    const finite = (v) => typeof v === "number" && Number.isFinite(v);
    const requireArray = (v, name) => { if (!Array.isArray(v)) throw new Error("Invalid save: " + name); };
    if (!isRecord(s)) throw new Error("Invalid save");
    if (!isRecord(s.company) || typeof s.company.name !== "string" || !s.company.name.trim() ||
        s.company.name.length > 80 || typeof s.company.industry !== "string" || !INDUSTRIES[s.company.industry]) {
      throw new Error("Invalid save: company");
    }
    const version = s.version == null ? 1 : s.version;
    if (!Number.isInteger(version) || version < 1 || version > SAVE_VERSION) throw new Error("Unsupported save version");
    if (!finite(s.cash) || !finite(s.week) || s.week < 1 || !Number.isInteger(s.week)) throw new Error("Invalid save: finances");
    ["employees", "products"].forEach((k) => requireArray(s[k], k));
    if (s.employees.some((v) => !isRecord(v)) || s.products.some((v) => !isRecord(v))) throw new Error("Invalid save: entries");
    s.employees.forEach((e) => {
      if (typeof e.id !== "string" || typeof e.name !== "string" || !ROLES[e.role] ||
          !["skill", "salary", "morale", "stress"].every((k) => finite(e[k])) ||
          (e.off != null && (!finite(e.off) || e.off < 0))) throw new Error("Invalid save: employee");
    });
    const statuses = ["idea", "development", "ready", "launch", "growth", "maturity", "decline", "retired"];
    s.products.forEach((p) => {
      if (typeof p.id !== "string" || typeof p.name !== "string" || !statuses.includes(p.status) ||
          !["quality", "price", "users", "demand", "age", "weeksLeft", "devCost"].every((k) => finite(p[k]))) {
        throw new Error("Invalid save: product");
      }
    });
    s.version = version;
    const defaults = newState("x", "y", "Technology");
    s.bonuses = Object.assign({}, defaults.bonuses, isRecord(s.bonuses) ? s.bonuses : {});
    s.stats = Object.assign(defaultStats(), isRecord(s.stats) ? s.stats : {});
    s.flags = isRecord(s.flags) ? s.flags : {};
    s.last = isRecord(s.last) ? s.last : { revenue: 0, expenses: 0, profit: 0, customers: 0, reputation: 0, valuation: 0 };
    s.upgrades = Object.assign({ office: 0, servers: 0, infrastructure: 0, automation: 0, marketingDept: 0, rdLab: 0, salesDept: 0 }, isRecord(s.upgrades) ? s.upgrades : {});
    Object.keys(s.upgrades).forEach((k) => {
      if (!UPGRADES[k] || !Number.isInteger(s.upgrades[k]) || s.upgrades[k] < 0 || !UPGRADES[k].levels[s.upgrades[k]]) throw new Error("Invalid save: upgrade level");
    });
    s.history = isRecord(s.history) ? s.history : { revenue: [], profit: [], customers: [], valuation: [] };
    ["revenue", "profit", "customers", "valuation"].forEach((k) => {
      if (!Array.isArray(s.history[k]) || s.history[k].some((v) => !finite(v))) throw new Error("Invalid save: history");
    });
    s.news = Array.isArray(s.news) ? s.news : [];
    s.activity = Array.isArray(s.activity) ? s.activity : [];
    s.achievements = isRecord(s.achievements) ? s.achievements : {};
    s.campaigns = Array.isArray(s.campaigns) ? s.campaigns : [];
    s.research = Array.isArray(s.research) ? s.research : [];
    s.researchDone = Array.isArray(s.researchDone) ? s.researchDone : [];
    s.loans = Array.isArray(s.loans) ? s.loans : [];
    s.competitors = Array.isArray(s.competitors) ? s.competitors : [];
    if (s.competitors.some((c) => !isRecord(c) || typeof c.name !== "string" ||
        typeof c.industry !== "string" || !INDUSTRIES[c.industry] ||
        !["valuation", "customers", "revenue", "reputation", "growth"].every((k) => finite(c[k])))) throw new Error("Invalid save: competitors");
    if (s.campaigns.some((c) => !isRecord(c) || !["cost", "weeksLeft", "totalWeeks", "reach", "conv", "viral", "var"].every((k) => finite(c[k])))) throw new Error("Invalid save: campaigns");
    if (s.research.some((r) => !isRecord(r) || typeof r.id !== "string" || !finite(r.weeksLeft))) throw new Error("Invalid save: research");
    if (s.loans.some((l) => !isRecord(l) || !["principal", "apr", "weeksLeft", "remaining", "payment"].every((k) => finite(l[k])))) throw new Error("Invalid save: loans");
    s.market = isRecord(s.market) ? s.market : { state: "Stable", ...MARKET_STATES.Stable };
    if (typeof s.market.state !== "string" || !MARKET_STATES[s.market.state] ||
        !["demand", "mkt", "prices", "growth"].every((k) => finite(s.market[k]))) throw new Error("Invalid save: market");
    s.historyLog = Array.isArray(s.historyLog) ? s.historyLog : [];
    s.milestones = Array.isArray(s.milestones) ? s.milestones : [];
    return s;
  }
  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
  }
  function exportSave() {
    if (!state) return;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (state.company.name || "company").replace(/\s+/g, "-").toLowerCase() + "-save.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Save exported");
  }
  function importSaveFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = loadRaw(reader.result);
        save("import");
        showGame();
        toast("Save imported", state.company.name);
      } catch (err) {
        openModal({ title: "Import failed", body: "<p>" + esc(err.message) + "</p>", buttons: [{ label: "OK", primary: true }] });
      }
    };
    reader.readAsText(file);
  }

  /* ---------- economy helpers ---------- */
  function weeklyOffice(s) {
    const base = 880 * (1 + s.upgrades.office * 0.55) * (1 + s.bonuses.officeCost);
    return Math.round(base * industry(s).opex);
  }
  function weeklyInfra(s) {
    const users = Math.max(0, s.customers);
    const base = 480 + users * 0.025 + s.upgrades.servers * 180;
    return Math.round(base * (1 + s.bonuses.infraCost) * UPGRADES.infrastructure.levels[s.upgrades.infrastructure].opex * industry(s).opex);
  }
  function weeklyOps(s) {
    const head = s.employees.length;
    const auto = UPGRADES.automation.levels[s.upgrades.automation].opex;
    return Math.round((280 + head * 48 + liveProducts(s).length * 140) * (1 + s.bonuses.opex) * auto * industry(s).opex);
  }
  function weeklySalaries(s) {
    const fin = 1 - Math.min(0.12, skillSum(s, "Finance") / 4000);
    return Math.round(s.employees.reduce((a, e) => a + (e.salary || 0), 0) * fin);
  }
  function weeklyRdBurn(s) {
    return s.research.reduce((a, r) => a + Math.round(r.cost / Math.max(1, r.totalWeeks) * 0.15), 0);
  }
  // Campaign costs are charged upfront when a campaign starts.
  function weeklyMktBurn(s) {
    return 0;
  }
  function weeklyLoan(s) {
    return s.loans.reduce((a, l) => a + l.payment, 0);
  }
  function expensesBreakdown(s) {
    const x = {
      salaries: weeklySalaries(s),
      office: weeklyOffice(s),
      infrastructure: weeklyInfra(s),
      marketing: weeklyMktBurn(s),
      rd: weeklyRdBurn(s),
      operations: weeklyOps(s),
      debt: weeklyLoan(s)
    };
    x.total = x.salaries + x.office + x.infrastructure + x.marketing + x.rd + x.operations + x.debt;
    return x;
  }
  function investYield(s) {
    return Math.round(s.invested * 0.03 / 52);
  }

  function capacityMult(s) {
    const srv = UPGRADES.servers.levels[s.upgrades.servers].cap;
    return srv * (1 + s.bonuses.capacity);
  }
  function mktMult(s) {
    return UPGRADES.marketingDept.levels[s.upgrades.marketingDept].mkt * (1 + s.bonuses.mkt) * s.market.mkt * industry(s).viral;
  }
  function salesMult(s) {
    return UPGRADES.salesDept.levels[s.upgrades.salesDept].sales * (1 + s.bonuses.conv + s.bonuses.sales) * industry(s).sales;
  }

  /* ---------- simulation ---------- */
  function simulateWeek(opts) {
    if (!state || modalOpen) return;
    const quiet = opts && opts.quiet;
    const s = state;
    const prev = { cash: s.cash, customers: s.customers, reputation: s.reputation, valuation: s.valuation };

    if (s.flags.hiringFreeze) s.flags.hiringFreeze = Math.max(0, s.flags.hiringFreeze - 1);
    if (s.flags.hirePremium) s.flags.hirePremium = Math.max(0, s.flags.hirePremium - 1);
    if (s.flags.rateHike) s.flags.rateHike = Math.max(0, s.flags.rateHike - 1);
    if (s.flags.season) s.flags.season = Math.max(0, s.flags.season - 1);
    if (s.flags.migrateDrag) {
      s.flags.migrateDrag -= 1;
      if (!s.flags.migrateDrag) s.bonuses.prod += 0.04;
    }
    if (s.flags.patentFight) {
      s.flags.patentFight -= 1;
      if (!s.flags.patentFight) { s.cash -= 60000; addRep(s, -4); toast("Patent fight lost", "A $60,000 hit."); }
    }

    tickEmployees(s);
    tickResearch(s);
    tickProducts(s);
    tickCampaigns(s);
    const rev = tickRevenue(s);
    const exp = expensesBreakdown(s);
    const yieldCash = investYield(s);
    const share = s.flags.revShare ? rev * s.flags.revShare : 0;
    const profit = rev + yieldCash - exp.total - share;

    // Decrement after production so off=3 means three complete weeks away.
    s.employees.forEach((e) => { if (e.off > 0) e.off -= 1; });
    s.cash += profit;
    tickLoans(s);
    tickMarket(s);
    tickCompetitors(s);
    recalcCustomers(s);
    tickValuation(s, rev, profit);
    tickRandomNews(s);

    s.last = {
      revenue: Math.round(rev),
      expenses: exp.total,
      profit: Math.round(profit),
      customers: s.customers - prev.customers,
      reputation: s.reputation - prev.reputation,
      valuation: s.valuation - prev.valuation
    };
    s.stats.totalRevenue += Math.max(0, rev);
    s.stats.totalProfit += profit;
    s.stats.highestRevenue = Math.max(s.stats.highestRevenue, rev);
    s.stats.highestValuation = Math.max(s.stats.highestValuation, s.valuation);
    s.stats.customersPeak = Math.max(s.stats.customersPeak, s.customers);
    s.stats.weeks += 1;

    s.history.revenue.push(Math.round(rev));
    s.history.profit.push(Math.round(profit));
    s.history.customers.push(s.customers);
    s.history.valuation.push(s.valuation);
    ["revenue", "profit", "customers", "valuation"].forEach((k) => { if (s.history[k].length > 160) s.history[k].shift(); });

    s.week += 1;
    if ((s.week - 1) % 52 === 0 && s.week > 1) s.year += 1;

    if (s.market.state === "Recession" || s.market.state === "Crisis") s.flags.sawRecession = true;
    if (s.flags.sawRecession && (s.market.state === "Growing" || s.market.state === "Boom" || s.market.state === "Stable") && s.last.profit > 0) {
      s.flags.survivedRecession = true;
    }
    if (s.market.state === "Crisis" && s.last.profit > 0 && s.cash > 0) s.flags.recoveredCrisis = true;

    checkMilestones(s);
    checkAchievements(s);
    save("week");

    const event = rollEvent(s);
    if (quiet && !event) {
      if (checkBankruptcyFlow()) return;
      renderTop();
      return;
    }
    showWeeklyReport(s.last, event);
  }

  function tickEmployees(s) {
    const hr = skillSum(s, "HR");
    const mgmt = skillSum(s, "Manager");
    s.employees.forEach((e) => {
      const load = 1 + s.employees.length / 80;
      e.stress = clamp(e.stress + (load > 1.2 ? 1 : -0.3) - mgmt / 8000, 0, 100);
      e.morale = clamp(e.morale + hr / 9000 - (e.stress > 70 ? 1.2 : 0) + (e.salary > ROLES[e.role].salary ? 0.2 : -0.15), 0, 100);
      if (e.morale < 22 && Math.random() < 0.08 && e.salary !== 0) {
        activity(s, e.name + " quit.");
        s.employees = s.employees.filter((x) => x.id !== e.id);
        s.stats.employeesQuit = (s.stats.employeesQuit || 0) + 1;
      }
    });
    const cap = UPGRADES.office.levels[s.upgrades.office].cap;
    if (s.employees.length > cap) teamMorale(s, -1);
  }

  function tickResearch(s) {
    const speed = UPGRADES.rdLab.levels[s.upgrades.rdLab].speed * (1 + s.bonuses.rdSpeed) * industry(s).rd * (1 + skillSum(s, "Researcher") / 800);
    s.research.forEach((r) => { r.weeksLeft -= speed; });
    const done = s.research.filter((r) => r.weeksLeft <= 0);
    s.research = s.research.filter((r) => r.weeksLeft > 0);
    done.forEach((r) => {
      const spec = RESEARCH.find((x) => x.id === r.id);
      if (spec) spec.apply(s);
      s.researchDone.push(r.id);
      s.stats.researchDone += 1;
      activity(s, "Research completed: " + r.name + ".");
      news(s, "COMPANY", s.company.name + " finished " + r.name + ".");
      toast("Research complete", r.name);
    });
  }

  function tickProducts(s) {
    const dev = skillSum(s, "Developer") + skillSum(s, "Designer") * 0.5;
    const auto = UPGRADES.automation.levels[s.upgrades.automation].prod * (1 + s.bonuses.prod);
    s.products.forEach((p) => {
      if (p.status === "development") {
        const pace = (0.65 + dev / 140) * auto * industry(s).rd;
        p.weeksLeft -= pace;
        p.quality = clamp(p.quality + 0.15 * (1 + skillSum(s, "Designer") / 400) * industry(s).quality, 1, 100);
        if (p.weeksLeft <= 0) {
          p.weeksLeft = 0;
          p.status = "ready";
          activity(s, p.name + " is ready to launch.");
          toast("Ready to launch", p.name);
        }
      } else if (["launch", "growth", "maturity", "decline"].includes(p.status)) {
        p.age += 1;
        if (p.tempQual) { p.tempQual -= 1; if (!p.tempQual) p.quality = clamp(p.quality + 5, 1, 100); }
        if (p.status === "launch" && p.age > 6) p.status = "growth";
        else if (p.status === "growth" && p.age > 26) p.status = "maturity";
        else if (p.status === "maturity" && p.age > 70) p.status = "decline";
        if (p.status === "decline") p.demand = Math.max(0.25, p.demand * 0.985);
      }
    });
  }

  function tickCampaigns(s) {
    const m = mktMult(s);
    s.campaigns.forEach((c) => {
      c.weeksLeft -= 1;
      const vol = (Math.random() * 2 - 1) * c.var;
      const viralHit = Math.random() < c.viral * industry(s).viral * 0.35;
      let acquired = Math.round(180 * c.reach * c.conv * m * (0.75 + s.reputation / 200) * (1 + vol) * (viralHit ? 4 : 1) * (s.flags.season ? s.flags.seasonPow : 1));
      acquired = Math.max(0, acquired);
      const targets = liveProducts(s);
      if (targets.length) {
        const t = targets[0];
        t.users += acquired;
        t.demand = clamp(t.demand + 0.02, 0.3, 2.5);
      } else s.flags.pipelineUsers = (s.flags.pipelineUsers || 0) + acquired;
      c.acquired = (c.acquired || 0) + acquired;
      if (viralHit) { s.flags.wentViral = true; news(s, "COMPANY", c.name + " went viral."); }
    });
    const finished = s.campaigns.filter((c) => c.weeksLeft <= 0);
    s.campaigns = s.campaigns.filter((c) => c.weeksLeft > 0);
    finished.forEach((c) => {
      s.stats.campaigns += 1;
      const spent = c.cost;
      const value = (c.acquired || 0) * 4;
      let outcome = "broke even";
      if (value > spent * 1.4) outcome = "profitable";
      else if (value < spent * 0.6) outcome = "lost money";
      activity(s, c.name + " ended — " + outcome + ", " + (c.acquired || 0).toLocaleString() + " customers.");
    });
  }

  function tickRevenue(s) {
    const sat = 1 + s.bonuses.satisfy;
    const qB = 1 + s.bonuses.quality + s.bonuses.productEff;
    const demandM = s.market.demand * (1 + s.bonuses.demand) * (s.flags.season ? s.flags.seasonPow : 1);
    const cap = 2500 * capacityMult(s) * (1 + s.employees.length / 12);
    let revenue = 0;
    let newCust = 0;
    let churned = 0;
    const sales = salesMult(s);
    const design = skillSum(s, "Designer");
    const mark = skillSum(s, "Marketer");

    s.products.forEach((p) => {
      if (!["launch", "growth", "maturity", "decline"].includes(p.status)) return;
      const fair = 12 + p.quality / 8;
      const priceFit = clamp(1 - Math.abs(p.price - fair) / (fair * 1.8), 0.25, 1.15);
      const quality = (p.quality / 70) * qB * industry(s).quality;
      const compPress = 1 - Math.min(0.35, s.competitors.filter((c) => !c.bankrupt && c.industry === s.company.industry).length * 0.04);
      const growth = (0.02 + mark / 8000 + s.reputation / 4000) * demandM * p.demand * industry(s).viral * mktMult(s) * (p.status === "decline" ? 0.35 : 1);
      const organic = Math.round((p.users * growth + 8 * quality * sales) * compPress);
      const churnRate = clamp(0.015 + Math.max(0, p.price - fair) / 400 + (1 - s.reputation / 100) * 0.02 - s.bonuses.retain - design / 20000, 0.005, 0.18);
      const lost = Math.round(p.users * churnRate);
      p.users = Math.max(0, p.users + organic - lost);
      if (p.users > cap / Math.max(1, liveProducts(s).length)) {
        const over = p.users - cap / Math.max(1, liveProducts(s).length);
        p.users -= Math.round(over * 0.4);
        if (Math.random() < 0.15 * UPGRADES.infrastructure.levels[s.upgrades.infrastructure].risk) addRep(s, -1);
      }
      newCust += organic;
      churned += lost;
      const arpu = p.price * 0.22 * priceFit * quality * sales * s.market.prices;
      p.revenue = p.users * arpu;
      p.rating = clamp(Math.round((p.quality * sat * (0.7 + s.reputation / 200)) / 1.4), 1, 100);
      revenue += p.revenue;
    });

    if (s.flags.pipelineUsers && liveProducts(s).length) {
      liveProducts(s)[0].users += s.flags.pipelineUsers;
      s.flags.pipelineUsers = 0;
    }
    s.flags.lastNew = newCust;
    s.flags.lastChurn = churned;
    recalcCustomers(s);
    return revenue;
  }

  function tickLoans(s) {
    s.loans.forEach((l) => {
      l.remaining = Math.max(0, l.remaining - l.payment + l.remaining * (l.apr / 52));
      l.weeksLeft -= 1;
    });
    const paid = s.loans.filter((l) => l.remaining <= 1 || l.weeksLeft <= 0);
    if (paid.length) {
      s.loans = s.loans.filter((l) => l.remaining > 1 && l.weeksLeft > 0);
      s.stats.loansRepaid += paid.length;
      toast("Loan repaid");
    }
  }

  function repayLoans(s, amount) {
    let left = Math.max(0, Number.isFinite(amount) ? amount : 0);
    let repaidCount = 0;
    s.loans.forEach((l) => {
      if (left <= 0) return;
      const pay = Math.min(left, Math.max(0, l.remaining));
      l.remaining -= pay;
      s.cash -= pay;
      left -= pay;
      if (l.remaining <= 1) repaidCount += 1;
    });
    s.loans = s.loans.filter((l) => l.remaining > 1);
    s.stats.loansRepaid = (s.stats.loansRepaid || 0) + repaidCount;
  }

  function tickMarket(s) {
    if (Math.random() < 0.06) {
      const names = Object.keys(MARKET_STATES);
      let next = pick(names);
      if (s.market.state === "Crisis") next = pick(["Recession", "Declining", "Stable"]);
      if (s.market.state === "Boom" && Math.random() < 0.4) next = "Growing";
      setMarket(s, next);
    }
    if ((s.market.state === "Recession" || s.market.state === "Crisis") && s.invested && Math.random() < 0.12) {
      const cut = Math.round(s.invested * 0.08);
      s.invested = Math.max(0, s.invested - cut);
      news(s, "MARKET", "Treasury book took a " + money(cut) + " haircut.");
    }
    if (s.flags.regRisk && Math.random() < 0.08) {
      s.cash -= 18000; addRep(s, -3); s.flags.regRisk -= 1; toast("Regulatory fine", "$18,000");
    }
  }

  function tickCompetitors(s) {
    s.competitors.forEach((c) => {
      if (c.bankrupt) return;
      const shock = rand(-0.03, 0.04) + s.market.growth;
      c.growth = clamp(c.growth * 0.9 + shock, -0.05, 0.05);
      c.revenue = Math.max(500, c.revenue * (1 + c.growth) * s.market.demand);
      c.customers = Math.max(50, Math.round(c.customers * (1 + c.growth * 0.8)));
      c.valuation = Math.max(20000, Math.round(c.revenue * 52 * (4 + c.reputation / 30) + c.customers * 40));
      c.reputation = clamp(c.reputation + irand(-1, 1), 10, 95);
      if (Math.random() < 0.08) news(s, "COMPETITOR", c.name + pick([" launched a product.", " changed pricing.", " opened a new facility.", " hired aggressively.", " missed a quarter."]));
      if (c.revenue < 1200 && s.week > 30 && Math.random() < 0.15) {
        c.bankrupt = true; s.flags.compBankrupt = true;
        news(s, "COMPETITOR", c.name + " collapsed.");
      }
    });
  }

  function tickValuation(s, rev, profit) {
    const arr = rev * 52;
    const hist = s.history.revenue;
    const old = hist[Math.max(0, hist.length - 9)] || 0;
    const g = old > 100 ? (rev - old) / old : (rev > 0 ? 0.2 : 0);
    const multiple = (3.2 + clamp(g * 14, -1, 16)) * industry(s).val * (0.55 + s.reputation / 110) * (1 + s.bonuses.val) * (s.market.state === "Boom" ? 1.15 : s.market.state === "Crisis" ? 0.7 : 1);
    const eq = 1 - Math.min(0.6, (s.flags.equity || 0) / 100);
    let v = arr * multiple + s.cash * 0.45 + s.invested * 0.5 + Math.max(0, profit) * 40 + s.customers * 18 + liveProducts(s).length * 25000;
    if (profit < 0 && s.week > 12) v *= 0.92;
    v *= eq;
    s.valuation = Math.max(10000, Math.round(s.valuation * 0.72 + v * 0.28));
  }

  function tickRandomNews(s) {
    if (Math.random() < 0.2) {
      const d = Math.round(rand(-8, 14));
      news(s, "MARKET", s.company.industry + " demand moved " + d + "% in trade chatter.");
    }
  }

  function rollEvent(s) {
    if (s.week < 3) return null;
    if (Math.random() > 0.32) return null;
    const pool = EVENTS.filter((e) => s.week >= (e.minWeek || 1) && e.id !== lastEventId && (!e.ok || e.ok(s)));
    if (!pool.length) return null;
    const ev = pick(pool);
    lastEventId = ev.id;
    return ev;
  }

  function checkMilestones(s) {
    const marks = [
      { id: "m1", at: 1e6, title: "$1M valuation" },
      { id: "m10", at: 1e7, title: "$10M valuation" },
      { id: "m100", at: 1e8, title: "$100M valuation" },
      { id: "m1b", at: 1e9, title: "$1B valuation" }
    ];
    marks.forEach((m) => {
      if (s.valuation >= m.at && !s.milestones.includes(m.id)) {
        s.milestones.push(m.id);
        s.historyLog.unshift({ week: s.week, title: m.title, text: s.company.name + " reached " + m.title + "." });
        toast("Milestone", m.title);
        if (m.id === "m1b" && !unicornShown) {
          unicornShown = true;
          setTimeout(() => openModal({
            title: "You built a unicorn",
            body: "<p>Valuation crossed $1B. The company still needs a CEO. Keep going.</p>",
            buttons: [{ label: "Continue", primary: true }]
          }), 400);
        }
      }
    });
  }

  function checkAchievements(s) {
    ACHIEVEMENTS.forEach((a) => {
      if (s.achievements[a.id]) return;
      try {
        if (a.test(s)) {
          s.achievements[a.id] = s.week;
          s.stats.achievements += 1;
          toast("Achievement", a.name);
          activity(s, "Achievement: " + a.name);
        }
      } catch { /* ignore */ }
    });
  }

  /* ---------- UI ---------- */
  function showMenu() {
    stopAuto();
    el("screen-menu").classList.remove("hidden");
    el("screen-setup").classList.add("hidden");
    el("screen-game").classList.add("hidden");
    el("btn-continue").disabled = !hasSave();
  }
  function showSetup() {
    el("screen-menu").classList.add("hidden");
    el("screen-setup").classList.remove("hidden");
    el("screen-game").classList.add("hidden");
    renderIndustries();
  }
  function showGame() {
    el("screen-menu").classList.add("hidden");
    el("screen-setup").classList.add("hidden");
    el("screen-game").classList.remove("hidden");
    closeSidebar();
    renderAll();
  }

  function renderIndustries() {
    const root = el("industry-grid");
    root.innerHTML = Object.keys(INDUSTRIES).map((name) => {
      const d = INDUSTRIES[name];
      return '<button type="button" class="industry-card' + (selectedIndustry === name ? " is-on" : "") + '" data-ind="' + esc(name) + '"><strong>' + esc(name) + "</strong><span>" + esc(d.blurb) + "</span></button>";
    }).join("");
  }

  function switchView(name) {
    if (name === "more") { openMore(); return; }
    view = name;
    qsa(".nav-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.view === name));
    qsa(".bnav").forEach((b) => b.classList.toggle("is-active", b.dataset.view === name || (name !== "dashboard" && name !== "employees" && name !== "products" && name !== "finance" && b.dataset.view === "more" && ["company","marketing","research","upgrades","market","news","achievements","stats","settings"].includes(name))));
    qsa(".view").forEach((v) => {
      const on = v.id === "view-" + name;
      v.classList.toggle("is-active", on);
      v.hidden = !on;
    });
    renderView();
    closeSidebar();
  }

  function renderAll() {
    if (!state) return;
    renderTop();
    renderView();
  }

  function renderTop() {
    const s = state;
    el("side-company").textContent = s.company.name;
    el("side-industry").textContent = s.company.industry;
    el("clock-week").textContent = "Week " + s.week;
    el("clock-year").textContent = "Year " + s.year;
    el("market-chip").textContent = s.market.state;
    el("kpi-cash").textContent = money(s.cash);
    el("kpi-cash").className = s.cash < 0 ? "bad" : "";
    el("kpi-rev").textContent = money(s.last.revenue) + "/w";
    const pk = el("kpi-profit");
    pk.textContent = money(s.last.profit);
    pk.className = s.last.profit >= 0 ? "good" : "bad";
    el("kpi-val").textContent = money(s.valuation);
    el("kpi-rep").textContent = s.reputation + "/100";
  }

  function renderView() {
    const map = {
      dashboard: renderDashboard,
      company: renderCompany,
      employees: renderEmployees,
      products: renderProducts,
      marketing: renderMarketing,
      finance: renderFinance,
      research: renderResearch,
      upgrades: renderUpgrades,
      market: renderMarket,
      news: renderNews,
      achievements: renderAchievements,
      stats: renderStats,
      settings: renderSettings
    };
    (map[view] || renderDashboard)();
  }

  function head(title, actions) {
    return '<div class="page-head"><div><h2>' + title + "</h2></div><div class=\"actions\">" + (actions || "") + "</div></div>";
  }

  function officeScene(s) {
    const visible = s.employees.slice(0, 8);
    const total = s.employees.length;
    const talking = visible.filter((e, i) => i % 3 === 1 && !e.off).length;
    const staff = visible.map((e, i) => {
      const status = e.off ? "On leave" : (i % 3 === 0 ? "Working at a desk" : i % 3 === 1 ? "Chatting with a teammate" : "Walking around the office");
      return '<div class="office-person person-' + (i % 8) + (e.off ? ' is-away' : '') + '" title="' + esc(e.name + " — " + e.role + " — " + status) + '"><span class="person-shadow"></span><span class="person-head"></span><span class="person-body"></span><span class="person-leg leg-a"></span><span class="person-leg leg-b"></span>' + (i % 3 === 1 && !e.off ? '<span class="person-talk">•••</span>' : '') + '<span class="person-name">' + esc(e.name.split(" ")[0]) + '</span></div>';
    }).join("");
    const line = total === 0 ? "The office is quiet. Hire your first teammate." : s.employees.some((e) => e.role === "Manager") ? "Daily stand-up is underway" : "The team is settling into the week";
    return '<section class="office-card" aria-label="Your office in action"><div class="office-card-head"><div><p class="eyebrow">LIVE FROM THE OFFICE</p><h3>' + esc(s.company.name) + ' HQ</h3><p class="office-subtitle">' + esc(line) + '</p></div><span class="office-live"><span></span> Week ' + s.week + '</span></div><div class="office-floor" role="img" aria-label="Illustrated office with desks, a meeting room, coffee station, and animated team members"><div class="office-window"></div><div class="office-room-label">OPEN WORKSPACE</div><div class="office-desk desk-one"><span class="desk-screen"></span><span class="desk-mug"></span></div><div class="office-desk desk-two"><span class="desk-screen"></span><span class="desk-mug"></span></div><div class="office-desk desk-three"><span class="desk-screen"></span><span class="desk-mug"></span></div><div class="office-meeting"><span class="meeting-label">MEETING ROOM</span><span class="meeting-table"></span><span class="meeting-chair chair-a"></span><span class="meeting-chair chair-b"></span><span class="meeting-chair chair-c"></span></div><div class="office-coffee"><span class="coffee-machine"></span><span class="coffee-cup"></span><span class="coffee-label">COFFEE</span></div>' + staff + '<div class="office-wall plant-a"><span></span></div><div class="office-wall plant-b"><span></span></div></div><div class="office-footer"><div><strong>' + total + '</strong><span> team member' + (total === 1 ? '' : 's') + '</span></div><div><strong>' + talking + '</strong><span> catching up</span></div><div><strong>' + Math.max(0, total - visible.length) + '</strong><span> more off-screen</span></div><div class="office-actions"><button type="button" class="btn btn-secondary btn-sm" data-office-view="employees">Manage team</button><button type="button" class="btn btn-ghost btn-sm" data-office-view="products">Products</button></div></div></section>';
  }

  function showAccessibilityModal() {
    const choices = [
      { key: "largeText", title: "Larger text", detail: "Make words and numbers easier to read." },
      { key: "highContrast", title: "Extra contrast", detail: "Make buttons and text stand out more." },
      { key: "calmMotion", title: "Reduce animation", detail: "Keep movement to a minimum." }
    ];
    openModal({
      title: "Display options",
      body: '<p class="muted">Choose what feels comfortable. Your choices are saved on this device.</p><div class="settings-toggles">' +
        choices.map((c) => '<button type="button" class="setting-toggle' + (accessibility[c.key] ? ' is-enabled' : '') + '" data-menu-access="' + c.key + '" aria-pressed="' + String(accessibility[c.key]) + '"><span class="setting-toggle-copy"><strong>' + c.title + '</strong><small>' + c.detail + '</small></span><span class="toggle-pill">' + (accessibility[c.key] ? 'On' : 'Off') + '</span></button>').join("") +
        '</div>',
      buttons: [{ label: "Done", primary: true }]
    });
    qsa("[data-menu-access]").forEach((b) => b.onclick = () => {
      const key = b.dataset.menuAccess;
      if (!Object.prototype.hasOwnProperty.call(accessibility, key)) return;
      accessibility[key] = !accessibility[key];
      saveAccessibility();
      showAccessibilityModal();
    });
  }

  function showTutorial(step) {
    const pages = [
      { title: "Welcome to your first week", label: "01 / 06 · THE BASICS", text: "You are the CEO. Grow a real business without running out of cash. Each turn advances the company by one week.", points: [["Cash is your runway","Keep enough money to cover payroll and operating costs."],["Every choice has a trade-off","Hiring, products, and marketing can help growth but cost money."]] },
      { title: "Meet your team", label: "02 / 06 · PEOPLE", text: "Employees power product development, sales, marketing, research, and morale.", points: [["Hire with a plan","Hiring costs money up front, then adds a weekly salary."],["Protect morale","Stress and low morale can hurt the team. HR and fair salaries help."]] },
      { title: "Build a product", label: "03 / 06 · PRODUCTS", text: "Open Products to develop and launch products. Development takes time; better teams and upgrades help.", points: [["Budget for development","Product work competes with payroll and other expenses."],["Watch the lifecycle","Products can grow, mature, and decline. Keep improving your portfolio."]] },
      { title: "Find your customers", label: "04 / 06 · GROWTH", text: "Marketing can attract customers. Reputation, quality, competition, and market conditions all affect growth.", points: [["Read campaign costs","Campaigns charge their listed cost when started."],["Adapt to the market","A strategy that works now may not work in a recession."]] },
      { title: "Protect your runway", label: "05 / 06 · FINANCES", text: "Finance shows cash flow and debt. Research and upgrades can improve efficiency, but take time to pay back.", points: [["Check weekly profit","Revenue minus expenses tells you whether your plan is sustainable."],["Borrow carefully","Loans provide cash now, but repayments and interest become expenses."]] },
      { title: "You’re in charge", label: "06 / 06 · YOUR TURN", text: "Use Next week for one turn. Auto advances several weeks; Pause stops it. Events may force you to adapt.", points: [["Your office is alive","The dashboard shows an animated snapshot of the team working and chatting."],["Play the long game","Build steady revenue, keep your team productive, and grow valuation without going bankrupt."]] }
    ];
    tutorialStep = Math.max(0, Math.min(pages.length - 1, step || 0));
    const p = pages[tutorialStep];
    openModal({ title: p.title, body: '<div class="tutorial-content"><p class="eyebrow">' + p.label + '</p><p class="tutorial-intro">' + p.text + '</p><div class="tutorial-points">' + p.points.map((x) => '<div class="tutorial-point"><span class="tutorial-check">✓</span><div><strong>' + x[0] + '</strong><p>' + x[1] + '</p></div></div>').join("") + '</div><div class="tutorial-progress" aria-label="Step ' + (tutorialStep + 1) + ' of ' + pages.length + '">' + pages.map((_, i) => '<span class="' + (i === tutorialStep ? 'is-current' : i < tutorialStep ? 'is-done' : '') + '"></span>').join("") + '</div></div>', buttons: [
      { label: "Skip guide", onClick: () => { try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch {} closeModal(); } },
      ...(tutorialStep > 0 ? [{ label: "Back", onClick: () => showTutorial(tutorialStep - 1) }] : []),
      { label: tutorialStep === pages.length - 1 ? "Let’s build" : "Next", primary: true, onClick: () => { if (tutorialStep >= pages.length - 1) { try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch {} closeModal(); } else showTutorial(tutorialStep + 1); } }
    ] });
  }

  function dashboardAdvice(s, exp) {
    const products = s.products.filter((p) => p.status !== "retired");
    const morale = avg(s.employees, "morale");
    if (s.cash < Math.max(15000, exp.total * 5)) return { title: "Protect your cash", text: "Check weekly costs before making big purchases.", action: "Review finances", view: "finance", tone: "careful" };
    if (!products.length) return { title: "Create your first product", text: "Your company needs something to sell before it can attract customers.", action: "Make a product", view: "products", tone: "growth" };
    if (s.last.profit < 0) return { title: "Work toward a profitable week", text: "Your costs are higher than revenue. Review spending and product performance.", action: "Review finances", view: "finance", tone: "careful" };
    if (s.employees.length && morale < 48) return { title: "Check in with your team", text: "Morale is low. Visit your people and see how the team is doing.", action: "Visit your team", view: "employees", tone: "people" };
    if (s.reputation < 45) return { title: "Rebuild customer trust", text: "Focus on product quality and steady, reliable decisions.", action: "Review products", view: "products", tone: "people" };
    return { title: "Keep building, one week at a time", text: "Check your results, choose one useful improvement, and advance when you are ready.", action: "See your company", view: "company", tone: "steady" };
  }

  function renderDashboard() {
    const s = state;
    const exp = expensesBreakdown(s);
    const advice = dashboardAdvice(s, exp);
    const root = el("view-dashboard");
    root.innerHTML = head("Your company at a glance", '<button type="button" class="btn btn-ghost btn-sm" id="btn-tutorial-dash">How to play</button>') +
      '<section class="welcome-strip"><p class="eyebrow">WEEK ' + s.week + ' · ' + esc(s.market.state) + ' MARKET</p><h3>Welcome back, ' + esc(s.company.ceo) + '.</h3><p>Here is how things are going at ' + esc(s.company.name) + '.</p></section>' +
      '<section class="advice-card advice-' + advice.tone + '"><div class="advice-copy"><p class="eyebrow">YOUR NEXT GOOD MOVE</p><h3>' + advice.title + '</h3><p>' + advice.text + '</p></div><button type="button" class="btn btn-primary" id="btn-advice-action">' + advice.action + '</button></section>' +
      '<div class="quick-actions" aria-label="Quick actions"><button type="button" class="quick-action" data-quick-view="employees"><strong>Build your team</strong><small>Hire and support people</small></button><button type="button" class="quick-action" data-quick-view="products"><strong>Make a product</strong><small>Create something useful</small></button><button type="button" class="quick-action" data-quick-view="finance"><strong>Check your money</strong><small>Understand costs and profit</small></button></div>' +
      '<div class="section-heading"><div><h3>Your business numbers</h3><p>These update as each week passes.</p></div></div>' +
      '<div class="stat-grid">' +
        stat("Cash available", money(s.cash), s.cash < exp.total * 8 ? "warn" : "") +
        stat("Money earned this week", money(s.last.revenue)) +
        stat("Costs this week", money(exp.total)) +
        stat("Profit this week", money(s.last.profit), s.last.profit >= 0 ? "good" : "bad") +
        stat("Customers", s.customers.toLocaleString()) +
        stat("People on your team", String(s.employees.length)) +
        stat("Customer reputation", s.reputation + "/100") +
        stat("Company value", money(s.valuation)) +
      "</div>" +
      officeScene(s) +
      '<div class="section-heading"><div><h3>Progress over time</h3><p>See how your decisions affect the business.</p></div></div>' +
      '<div class="grid grid-2" style="margin-top:12px">' +
        '<div class="card"><div class="card-head"><h3>Revenue</h3></div><div class="chart-wrap"><canvas id="c-rev"></canvas></div></div>' +
        '<div class="card"><div class="card-head"><h3>Profit</h3></div><div class="chart-wrap"><canvas id="c-profit"></canvas></div></div>' +
        '<div class="card"><div class="card-head"><h3>Customers</h3></div><div class="chart-wrap"><canvas id="c-cust"></canvas></div></div>' +
        '<div class="card"><div class="card-head"><h3>Valuation</h3></div><div class="chart-wrap"><canvas id="c-val"></canvas></div></div>' +
      "</div>" +
      '<div class="grid grid-2" style="margin-top:12px">' +
        '<div class="card"><h3>Recent activity</h3><ul class="activity">' + s.activity.slice(0, 8).map((a) => "<li>" + esc(a.text) + "</li>").join("") + "</ul></div>" +
        '<div class="card"><h3>Company news</h3><ul class="news-feed">' + s.news.slice(0, 8).map((n) => '<li class="news-item"><span class="tag">' + esc(n.tag) + "</span><div>" + esc(n.text) + "</div></li>").join("") + "</ul></div>" +
      "</div>";
    drawChart("c-rev", s.history.revenue, "#8fb4c9");
    drawChart("c-profit", s.history.profit, "#7dcea0");
    drawChart("c-cust", s.history.customers, "#c5cdd8");
    drawChart("c-val", s.history.valuation, "#d4b483");
    qsa("[data-office-view], [data-quick-view]").forEach((b) => b.onclick = () => switchView(b.dataset.officeView || b.dataset.quickView));
    el("btn-advice-action").onclick = () => switchView(advice.view);
    el("btn-tutorial-dash").onclick = () => showTutorial(0);
  }

  function stat(label, value, cls) {
    return '<div class="stat"><span>' + label + '</span><strong class="' + (cls || "") + '">' + value + "</strong></div>";
  }

  function renderCompany() {
    const s = state;
    const pos = 1 + s.competitors.filter((c) => !c.bankrupt && c.valuation > s.valuation).length;
    el("view-company").innerHTML = head("Company") +
      '<div class="grid grid-2">' +
        '<div class="card"><h3>Overview</h3>' +
          meta("Company", s.company.name) + meta("CEO", s.company.ceo) + meta("Industry", s.company.industry) +
          meta("Founded", "Week " + s.company.foundedWeek + ", Year " + s.company.foundedYear) +
          meta("Employees", String(s.employees.length)) + meta("Customers", s.customers.toLocaleString()) +
          meta("Reputation", s.reputation + "/100") + meta("Revenue / week", money(s.last.revenue)) +
          meta("Valuation", money(s.valuation)) + meta("Market position", "#" + pos + " of " + (s.competitors.filter((c)=>!c.bankrupt).length + 1)) +
          (s.flags.equity ? meta("Sold equity", s.flags.equity + "%") : "") +
        "</div>" +
        '<div class="card"><h3>Milestones</h3>' + (s.milestones.length ? s.milestones.map((id) => { const map = { m1: "$1M", m10: "$10M", m100: "$100M", m1b: "$1B unicorn" }; return '<div class="row"><div>' + map[id] + "</div></div>"; }).join("") : '<div class="empty">No valuation milestones yet.</div>') + "</div>" +
      "</div>" +
      '<div class="card" style="margin-top:12px"><h3>History</h3><ul class="hist">' + s.historyLog.slice(0, 12).map((h) => '<li class="hist-item"><strong>Week ' + h.week + " — " + esc(h.title) + "</strong><div class='muted'>" + esc(h.text) + "</div></li>").join("") + "</ul></div>";
  }
  function meta(k, v) { return '<div class="row"><div>' + k + '</div><strong>' + esc(String(v)) + "</strong></div>"; }

  function renderEmployees() {
    const s = state;
    const freeze = s.flags.hiringFreeze > 0;
    el("view-employees").innerHTML = head("Employees", '<button class="btn btn-primary btn-sm" id="act-hire"' + (freeze ? " disabled" : "") + ">Hire</button>") +
      '<div class="card"><div class="stat-grid">' +
        stat("Headcount", String(s.employees.length)) +
        stat("Weekly payroll", money(weeklySalaries(s))) +
        stat("Avg morale", Math.round(avg(s.employees, "morale")) + "/100") +
        stat("Avg stress", Math.round(avg(s.employees, "stress")) + "/100") +
      "</div></div>" +
      '<div class="list" style="margin-top:12px">' + s.employees.map((e) => personCard(e)).join("") + "</div>";
    const hire = el("act-hire");
    if (hire) hire.onclick = openHire;
    qsa("[data-emp]").forEach((btn) => {
      btn.onclick = () => empAction(btn.dataset.emp, btn.dataset.act);
    });
  }
  function avg(arr, k) { return arr.length ? arr.reduce((a, x) => a + x[k], 0) / arr.length : 0; }
  function personCard(e) {
    return '<article class="person"><div class="person-top"><div><strong>' + esc(e.name) + "</strong><div class='muted'>" + esc(e.role) + (e.off ? " · away " + e.off + "w" : "") + '</div></div><span class="pill">' + money(e.salary) + "/w</span></div>" +
      '<div class="meta-row"><span>Skill ' + Math.round(e.skill) + '</span><span>Morale ' + Math.round(e.morale) + '</span><span>Stress ' + Math.round(e.stress) + "</span></div>" +
      '<div class="bar" aria-hidden="true"><i style="width:' + e.morale + '%"></i></div>' +
      '<div class="actions">' +
        '<button class="btn btn-sm btn-secondary" data-emp="' + e.id + '" data-act="train">Train</button>' +
        '<button class="btn btn-sm btn-secondary" data-emp="' + e.id + '" data-act="raise">Raise</button>' +
        '<button class="btn btn-sm btn-secondary" data-emp="' + e.id + '" data-act="promote">Promote</button>' +
        '<button class="btn btn-sm btn-danger" data-emp="' + e.id + '" data-act="fire">Fire</button>' +
      "</div></article>";
  }

  function openHire() {
    if (state.flags.hiringFreeze) return toast("Hiring freeze");
    const cap = UPGRADES.office.levels[state.upgrades.office].cap;
    if (state.employees.length >= cap) return toast("Office full", "Upgrade the office.");
    const roles = Object.keys(ROLES);
    const cands = [0, 1, 2].map(() => {
      const role = pick(roles);
      const e = makeEmployee(role);
      const prem = state.flags.hirePremium ? 1.35 : 1;
      e.hireCost = Math.round((ROLES[role].hire + e.salary * 2) * (1 + (state.bonuses.hireCost || 0)) * prem);
      return e;
    });
    openModal({
      title: "Candidates",
      body: cands.map((e, i) => '<button type="button" class="choice hire-c" data-i="' + i + '"><strong>' + esc(e.name) + " — " + e.role + "</strong><small>Skill " + e.skill + " · " + money(e.salary) + "/w · signing " + money(e.hireCost) + "</small></button>").join(""),
      buttons: [{ label: "Cancel" }]
    });
    qsa(".hire-c").forEach((b) => {
      b.onclick = () => {
        const e = cands[+b.dataset.i];
        if (state.cash < e.hireCost) { toast("Not enough cash"); return; }
        state.cash -= e.hireCost;
        const hired = { id: uid(), name: e.name, role: e.role, skill: e.skill, productivity: 1, salary: e.salary, morale: e.morale, stress: e.stress, off: 0 };
        state.employees.push(hired);
        state.stats.hired += 1;
        activity(state, state.company.name + " hired " + hired.name + " (" + hired.role + ").");
        closeModal(); renderAll(); save("hire"); toast("Hired", hired.name);
      };
    });
  }

  function empAction(id, act) {
    const e = state.employees.find((x) => x.id === id);
    if (!e) return;
    if (act === "train") {
      const cost = 2800;
      if (state.cash < cost) return toast("Not enough cash");
      state.cash -= cost;
      e.skill = clamp(e.skill + irand(5, 12), 1, 100);
      e.stress = clamp(e.stress + 6, 0, 100);
      activity(state, "Trained " + e.name + ".");
    } else if (act === "raise") {
      e.salary = Math.round(e.salary * 1.15) || Math.round(ROLES[e.role].salary * 1.1);
      e.morale = clamp(e.morale + 14, 0, 100);
      e.stress = clamp(e.stress - 5, 0, 100);
      activity(state, "Gave " + e.name + " a raise.");
    } else if (act === "promote") {
      if (e.role === "Manager") return toast("Already a manager");
      e.role = "Manager";
      e.salary = Math.round((e.salary || ROLES.Manager.salary) * 1.25);
      e.morale = clamp(e.morale + 16, 0, 100);
      activity(state, "Promoted " + e.name + ".");
    } else if (act === "fire") {
      if (state.employees.length === 1) return toast("You need someone on the books");
      openModal({
        title: "Fire " + e.name + "?",
        body: "<p>Severance of " + money(e.salary * 2) + " will be paid. Team morale will drop.</p>",
        buttons: [
          { label: "Cancel" },
          { label: "Fire", primary: true, danger: true, onClick: () => {
            state.cash -= e.salary * 2;
            state.employees = state.employees.filter((x) => x.id !== id);
            state.stats.fired += 1;
            teamMorale(state, -6);
            activity(state, "Fired " + e.name + ".");
            closeModal(); renderAll(); save("fire");
          } }
        ]
      });
      return;
    }
    renderAll(); save("emp");
  }

  function renderProducts() {
    const s = state;
    const slots = productSlots(s);
    const used = s.products.filter((p) => p.status !== "retired").length;
    el("view-products").innerHTML = head("Products", '<button class="btn btn-primary btn-sm" id="act-idea">Create product</button>') +
      '<p class="muted" style="margin-bottom:12px">Slots ' + used + " / " + slots + "</p>" +
      (s.products.length ? '<div class="list">' + s.products.filter((p)=>p.status!=="retired").map(productCard).join("") + "</div>" : '<div class="card empty">No products yet. Create an idea, develop it, then launch. Revenue does not exist until something ships.</div>');
    el("act-idea").onclick = openNewProduct;
    qsa("[data-prod]").forEach((b) => { b.onclick = () => prodAction(b.dataset.prod, b.dataset.act); });
  }
  function productCard(p) {
    return '<article class="product-card"><div class="pc-top"><div><strong>' + esc(p.name) + '</strong><div class="muted">' + esc(p.category) + " · " + esc(p.status) + '</div></div><span class="pill">' + money(p.price) + "</span></div>" +
      '<div class="meta-row"><span>Quality ' + Math.round(p.quality) + '</span><span>Users ' + Math.round(p.users).toLocaleString() + '</span><span>Rev/w ' + money(p.revenue || 0) + '</span><span>Rating ' + (p.rating || "—") + "</span></div>" +
      (p.status === "development" ? "<p class='muted'>Weeks left (est): " + Math.max(1, Math.ceil(p.weeksLeft)) + "</p>" : "") +
      '<div class="actions">' +
        (p.status === "idea" ? '<button class="btn btn-sm btn-primary" data-prod="' + p.id + '" data-act="dev">Develop</button>' : "") +
        (p.status === "ready" || p.status === "idea" ? '<button class="btn btn-sm btn-primary" data-prod="' + p.id + '" data-act="launch">Launch</button>' : "") +
        (["launch","growth","maturity","decline"].includes(p.status) ? '<button class="btn btn-sm btn-secondary" data-prod="' + p.id + '" data-act="price">Price</button><button class="btn btn-sm btn-secondary" data-prod="' + p.id + '" data-act="improve">Improve</button><button class="btn btn-sm btn-secondary" data-prod="' + p.id + '" data-act="market">Market</button>' : "") +
        '<button class="btn btn-sm btn-danger" data-prod="' + p.id + '" data-act="retire">Retire</button>' +
      "</div></article>";
  }
  function openNewProduct() {
    const s = state;
    const used = s.products.filter((p) => p.status !== "retired").length;
    if (used >= productSlots(s)) return toast("No product slots", "Upgrade the office.");
    const cats = PRODUCT_CATS[s.company.industry];
    openModal({
      title: "New product",
      body: '<label class="field"><span>Name</span><input id="np-name" maxlength="28" placeholder="WarpCloud"></label>' +
        '<label class="field" style="margin-top:10px"><span>Category</span><select id="np-cat">' + cats.map((c) => "<option>" + c + "</option>").join("") + "</select></label>",
      buttons: [
        { label: "Cancel" },
        { label: "Create idea", primary: true, onClick: () => {
          const name = (el("np-name").value || pick(cats) + " " + irand(1, 9)).trim();
          s.products.push({
            id: uid(), name, category: el("np-cat").value, status: "idea",
            devCost: Math.round(16000 * industry(s).devCost), weeksLeft: Math.round(6 * (industry(s).devCost > 1.2 ? 1.15 : 1)),
            price: s.company.industry === "E-commerce" ? 18 : 29, quality: 38, demand: 1, users: 0, revenue: 0, rating: 0, age: 0
          });
          activity(s, "New idea: " + name + ".");
          closeModal(); renderAll(); save("idea");
        } }
      ]
    });
  }
  function prodAction(id, act) {
    const s = state;
    const p = s.products.find((x) => x.id === id);
    if (!p) return;
    if (act === "dev") {
      if (s.cash < p.devCost) return toast("Not enough cash");
      s.cash -= p.devCost;
      p.status = "development";
      activity(s, "Started development on " + p.name + ".");
    } else if (act === "launch") {
      if (p.status === "idea") {
        if (s.cash < p.devCost) return toast("Not enough cash to rush a launch");
        s.cash -= p.devCost;
        p.quality = clamp(p.quality - 8, 1, 100);
      }
      p.status = "launch"; p.age = 0;
      p.users += 40 + Math.round(s.reputation * 1.4) + (s.flags.pipelineUsers || 0);
      s.flags.pipelineUsers = 0;
      s.stats.productsLaunched += 1;
      addRep(s, 2);
      activity(s, s.company.name + " launched " + p.name + ".");
      news(s, "COMPANY", s.company.name + " launched " + p.name + ".");
      if (s.flags.needShip) { addRep(s, 2); s.flags.needShip = false; }
    } else if (act === "price") {
      openModal({
        title: "Price " + p.name,
        body: '<label class="field"><span>Weekly list price</span><input id="np-price" type="number" min="1" max="5000" value="' + p.price + '"></label>',
        buttons: [
          { label: "Cancel" },
          { label: "Set", primary: true, onClick: () => { p.price = clamp(+el("np-price").value || p.price, 1, 5000); closeModal(); renderAll(); save("price"); } }
        ]
      });
      return;
    } else if (act === "improve") {
      const cost = 8000 + Math.round(p.quality * 80);
      if (s.cash < cost) return toast("Not enough cash");
      s.cash -= cost;
      p.quality = clamp(p.quality + 7 + skillSum(s, "Developer") / 200, 1, 100);
      activity(s, "Improved " + p.name + ".");
    } else if (act === "market") {
      switchView("marketing");
      return;
    } else if (act === "retire") {
      const scrap = Math.round(2000 + p.users * 0.4);
      s.cash += scrap;
      p.status = "retired"; p.users = 0;
      s.stats.productsRetired += 1;
      activity(s, "Retired " + p.name + " for " + money(scrap) + ".");
      recalcCustomers(s);
    }
    renderAll(); save("prod");
  }

  function renderMarketing() {
    const s = state;
    el("view-marketing").innerHTML = head("Marketing") +
      '<div class="grid grid-2">' + CAMPAIGNS.map((c) => {
        const cost = Math.round(c.cost * (1.05 - Math.min(0.2, skillSum(s, "Marketer") / 2000)));
        return '<article class="campaign-card"><div class="pc-top"><strong>' + c.name + '</strong><span class="pill">' + c.weeks + "w</span></div>" +
          "<p class='muted'>Cost " + money(cost) + " · reach " + c.reach.toFixed(2) + " · conversion " + (c.conv * 100).toFixed(1) + "% · uncertain outcome</p>" +
          '<button class="btn btn-sm btn-primary" data-camp="' + c.id + '">Run campaign</button></article>';
      }).join("") + "</div>" +
      '<div class="card" style="margin-top:12px"><h3>Active campaigns</h3>' +
      (s.campaigns.length ? s.campaigns.map((c) => '<div class="row"><div>' + esc(c.name) + " · " + c.weeksLeft + "w left · +" + (c.acquired || 0).toLocaleString() + ' users</div></div>').join("") : '<div class="empty">No campaigns running.</div>') + "</div>";
    qsa("[data-camp]").forEach((b) => b.onclick = () => startCampaign(b.dataset.camp));
  }
  function startCampaign(id) {
    const spec = CAMPAIGNS.find((c) => c.id === id);
    const cost = Math.round(spec.cost * (1.05 - Math.min(0.2, skillSum(state, "Marketer") / 2000)));
    if (state.cash < cost) return toast("Not enough cash");
    state.cash -= cost;
    state.campaigns.push({ id: spec.id, name: spec.name, cost, weeksLeft: spec.weeks, totalWeeks: spec.weeks, reach: spec.reach, conv: spec.conv, viral: spec.viral, var: spec.var, acquired: 0 });
    activity(state, "Started " + spec.name + " campaign.");
    renderAll(); save("mkt");
  }

  function renderFinance() {
    const s = state;
    const exp = expensesBreakdown(s);
    const burn = Math.max(0, exp.total - s.last.revenue);
    const runway = burn > 0 ? Math.floor(s.cash / burn) : 99;
    el("view-finance").innerHTML = head("Finance") +
      '<div class="stat-grid">' +
        stat("Cash", money(s.cash), s.cash < 0 ? "bad" : "") +
        stat("Profit / week", money(s.last.profit), s.last.profit >= 0 ? "good" : "bad") +
        stat("Margin", s.last.revenue ? ((s.last.profit / s.last.revenue) * 100).toFixed(1) + "%" : "—") +
        stat("Monthly burn", money(burn * 4.3)) +
        stat("Runway", burn > 0 ? runway + " weeks" : "Profitable") +
        stat("Debt", money(s.loans.reduce((a, l) => a + l.remaining, 0))) +
        stat("Invested", money(s.invested)) +
        stat("Treasury yield /w", money(investYield(s))) +
      "</div>" +
      '<div class="card" style="margin-top:12px"><h3>Expenses</h3>' +
        ["salaries","office","infrastructure","marketing","rd","operations","debt"].map((k) => '<div class="row"><div>' + k + "</div><span class='num'>" + money(exp[k]) + "</span></div>").join("") +
      "</div>" +
      '<div class="card" style="margin-top:12px"><h3>Debt</h3>' +
      (s.loans.length ? s.loans.map((l) => '<div class="row"><div>' + money(l.principal) + " @ " + (l.apr * 100).toFixed(1) + "% · remaining " + money(l.remaining) + '</div><span class="muted">' + money(l.payment) + "/w</span></div>").join("") : '<div class="empty">No loans.</div>') +
      '<div class="actions" style="margin-top:10px">' +
        '<button class="btn btn-sm btn-secondary" id="loan-s">Loan $50k</button>' +
        '<button class="btn btn-sm btn-secondary" id="loan-m">Loan $150k</button>' +
        '<button class="btn btn-sm btn-secondary" id="loan-l">Loan $400k</button>' +
        '<button class="btn btn-sm btn-primary" id="loan-pay">Repay 20%</button>' +
      "</div></div>" +
      '<div class="card" style="margin-top:12px"><h3>Treasury</h3><p class="muted">Park cash at ~3% annual. Recession can haircut the book.</p>' +
      '<div class="actions" style="margin-top:10px"><button class="btn btn-sm btn-secondary" id="inv-in">Invest 20% cash</button><button class="btn btn-sm btn-secondary" id="inv-out">Withdraw all</button></div></div>';
    el("loan-s").onclick = () => takeLoan(50000, 0.09, 52);
    el("loan-m").onclick = () => takeLoan(150000, 0.11, 78);
    el("loan-l").onclick = () => takeLoan(400000, 0.14, 104);
    el("loan-pay").onclick = () => { const d = s.loans.reduce((a, l) => a + l.remaining, 0); if (!d) return toast("No debt"); repayLoans(s, d * 0.2); renderAll(); save("repay"); };
    el("inv-in").onclick = () => {
      const n = Math.round(s.cash * 0.2);
      if (n < 1000) return toast("Not enough cash");
      s.cash -= n; s.invested += n; renderAll(); save("inv");
    };
    el("inv-out").onclick = () => { s.cash += s.invested; s.invested = 0; renderAll(); save("inv"); };
  }
  function takeLoan(principal, apr, weeks) {
    if (state.flags.rateHike) apr += 0.03;
    const r = apr / 52;
    const payment = Math.round(principal * r / (1 - Math.pow(1 + r, -weeks)));
    state.cash += principal;
    state.loans.push({ id: uid(), principal, apr, weeksLeft: weeks, remaining: principal, payment });
    state.stats.loansTaken += 1;
    activity(state, "Took a " + money(principal) + " loan.");
    renderAll(); save("loan");
    toast("Loan funded", money(principal));
  }

  function renderResearch() {
    const s = state;
    const parallel = UPGRADES.rdLab.levels[s.upgrades.rdLab].parallel;
    el("view-research").innerHTML = head("Research") +
      "<p class='muted' style='margin-bottom:12px'>Active " + s.research.length + " / " + parallel + "</p>" +
      '<div class="grid grid-2">' + RESEARCH.map((r) => {
        const done = s.researchDone.includes(r.id);
        const running = s.research.find((x) => x.id === r.id);
        return '<article class="research-card"><div class="pc-top"><strong>' + esc(r.name) + '</strong><span class="pill">' + r.cat + "</span></div>" +
          "<p class='muted'>" + esc(r.desc) + "</p>" +
          "<p class='muted'>" + money(r.cost) + " · " + r.weeks + " weeks</p>" +
          (done ? '<span class="pill good">Complete</span>' : running ? "<p>Progress: " + Math.max(0, Math.ceil(running.weeksLeft)) + "w left</p>" :
            '<button class="btn btn-sm btn-primary" data-rd="' + r.id + '">Start</button>') +
          "</article>";
      }).join("") + "</div>";
    qsa("[data-rd]").forEach((b) => b.onclick = () => startRd(b.dataset.rd));
  }
  function startRd(id) {
    const spec = RESEARCH.find((r) => r.id === id);
    const parallel = UPGRADES.rdLab.levels[state.upgrades.rdLab].parallel;
    if (state.research.length >= parallel) return toast("Lab at capacity");
    if (state.researchDone.includes(id)) return;
    if (state.cash < spec.cost) return toast("Not enough cash");
    state.cash -= spec.cost;
    state.research.push({ id: spec.id, name: spec.name, cost: spec.cost, weeksLeft: spec.weeks, totalWeeks: spec.weeks });
    activity(state, "Started research: " + spec.name + ".");
    renderAll(); save("rd");
  }

  function renderUpgrades() {
    const s = state;
    el("view-upgrades").innerHTML = head("Upgrades") +
      '<div class="grid grid-2">' + Object.keys(UPGRADES).map((key) => {
        const u = UPGRADES[key];
        const lvl = s.upgrades[key];
        const next = u.levels[lvl + 1];
        const cur = u.levels[lvl];
        return '<article class="upgrade-card"><div class="pc-top"><strong>' + u.name + '</strong><span class="pill">Lv ' + (lvl + 1) + "</span></div>" +
          "<p class='muted'>" + u.hint + "</p>" +
          "<p>Now: " + cur.label + "</p>" +
          (next ? "<p class='muted'>Next " + next.label + " — " + money(next.cost) + '</p><button class="btn btn-sm btn-primary" data-up="' + key + '">Upgrade</button>' : '<span class="pill good">Maxed</span>') +
          "</article>";
      }).join("") + "</div>";
    qsa("[data-up]").forEach((b) => b.onclick = () => buyUpgrade(b.dataset.up));
  }
  function buyUpgrade(key) {
    const u = UPGRADES[key];
    const lvl = state.upgrades[key];
    const next = u.levels[lvl + 1];
    if (!next) return;
    if (state.cash < next.cost) return toast("Not enough cash");
    state.cash -= next.cost;
    state.upgrades[key] += 1;
    if (key === "office") teamMorale(state, 3);
    activity(state, "Upgraded " + u.name + " to " + next.label + ".");
    renderAll(); save("up");
  }

  function renderMarket() {
    const s = state;
    const board = [{ name: s.company.name, valuation: s.valuation, customers: s.customers, revenue: s.last.revenue, you: true }].concat(
      s.competitors.map((c) => ({ name: c.name, valuation: c.valuation, customers: c.customers, revenue: c.revenue, you: false, bankrupt: c.bankrupt }))
    ).sort((a, b) => b.valuation - a.valuation);
    el("view-market").innerHTML = head("Market") +
      '<div class="card"><h3>Condition — ' + esc(s.market.state) + "</h3><p class='muted'>Demand " + s.market.demand.toFixed(2) + " · marketing " + s.market.mkt.toFixed(2) + " · prices " + s.market.prices.toFixed(2) + "</p></div>" +
      '<div class="card" style="margin-top:12px"><h3>Leaderboard</h3>' +
      board.map((c, i) => '<div class="leader' + (c.you ? " is-you" : "") + '"><span>' + (i + 1) + "</span><div>" + esc(c.name) + (c.you ? ' <span class="you-badge">You</span>' : "") + (c.bankrupt ? " · bankrupt" : "") + '</div><strong class="num">' + money(c.valuation) + "</strong></div>").join("") +
      "</div>" +
      '<div class="card" style="margin-top:12px"><h3>Rivals</h3><div class="table-wrap"><table class="data"><thead><tr><th>Company</th><th>Industry</th><th class="num">Customers</th><th class="num">Rev/w</th></tr></thead><tbody>' +
      s.competitors.map((c) => "<tr><td>" + esc(c.name) + (c.bankrupt ? " (bankrupt)" : "") + "</td><td>" + esc(c.industry) + '</td><td class="num">' + c.customers.toLocaleString() + '</td><td class="num">' + money(c.revenue) + "</td></tr>").join("") +
      "</tbody></table></div></div>";
  }

  function renderNews() {
    const s = state;
    el("view-news").innerHTML = head("News") +
      '<div class="card"><ul class="news-feed">' + s.news.map((n) => '<li class="news-item"><span class="tag">W' + n.week + " · " + esc(n.tag) + "</span><div>" + esc(n.text) + "</div></li>").join("") + "</ul></div>";
  }

  function renderAchievements() {
    const s = state;
    el("view-achievements").innerHTML = head("Achievements") +
      '<div class="ach-grid">' + ACHIEVEMENTS.map((a) => {
        const on = s.achievements[a.id];
        return '<div class="ach' + (on ? "" : " locked") + '"><div><strong>' + esc(a.name) + "</strong><div class='muted'>" + esc(a.desc) + "</div></div><span class='pill'>" + (on ? "W" + on : "Locked") + "</span></div>";
      }).join("") + "</div>";
  }

  function renderStats() {
    const s = state.stats;
    const rows = [
      ["Total revenue", money(s.totalRevenue)],
      ["Total profit", money(s.totalProfit)],
      ["Highest weekly revenue", money(s.highestRevenue)],
      ["Highest valuation", money(s.highestValuation)],
      ["Customers (peak)", s.customersPeak.toLocaleString()],
      ["Employees hired", s.hired],
      ["Employees fired", s.fired],
      ["Products launched", s.productsLaunched],
      ["Products retired", s.productsRetired],
      ["Campaigns completed", s.campaigns],
      ["Research completed", s.researchDone],
      ["Weeks survived", s.weeks],
      ["Loans taken", s.loansTaken],
      ["Loans repaid", s.loansRepaid],
      ["Bankruptcies", s.bankruptcies],
      ["Achievements", s.achievements]
    ];
    el("view-stats").innerHTML = head("Statistics") + '<div class="card">' + rows.map((r) => '<div class="row"><div>' + r[0] + '</div><strong class="num">' + r[1] + "</strong></div>").join("") + "</div>";
  }

  function renderSettings() {
    const settingButton = (key, title, description) =>
      '<button type="button" class="setting-toggle' + (accessibility[key] ? ' is-enabled' : '') + '" data-access-setting="' + key + '" aria-pressed="' + String(accessibility[key]) + '"><span class="setting-toggle-copy"><strong>' + title + '</strong><small>' + description + '</small></span><span class="toggle-pill" aria-hidden="true">' + (accessibility[key] ? 'On' : 'Off') + '</span></button>';
    el("view-settings").innerHTML = head("Settings") +
      '<section class="card settings-section"><p class="eyebrow">Make the game comfortable for you</p><h3>Reading and motion</h3><p class="muted">These choices are saved on this device. Change them whenever you like.</p><div class="settings-toggles">' +
        settingButton("largeText", "Larger text", "Make words and numbers easier to read.") +
        settingButton("highContrast", "Extra contrast", "Make text, borders, and buttons stand out more.") +
        settingButton("calmMotion", "Reduce animation", "Make the office calmer and reduce movement.") +
      '</div></section>' +
      '<section class="card settings-section"><p class="eyebrow">Your progress</p><h3>Save and manage your game</h3><p class="muted">Your game stays in this browser. Export a save to keep a backup or move it to another device.</p>' +
      '<div class="actions settings-actions">' +
        '<button class="btn btn-secondary" id="st-save">Save game</button>' +
        '<button class="btn btn-secondary" id="st-load">Load game</button>' +
        '<button class="btn btn-secondary" id="st-export">Export save</button>' +
        '<button class="btn btn-secondary" id="st-import">Import save</button>' +
        '<button class="btn btn-ghost" id="st-menu">Main menu</button>' +
        '<button class="btn btn-danger" id="st-reset">Reset game</button>' +
      "</div></section>";
    qsa("[data-access-setting]").forEach((b) => b.onclick = () => {
      const key = b.dataset.accessSetting;
      if (!Object.prototype.hasOwnProperty.call(accessibility, key)) return;
      accessibility[key] = !accessibility[key];
      saveAccessibility();
      renderSettings();
    });
    el("st-save").onclick = () => { save("manual"); toast("Saved"); };
    el("st-load").onclick = () => {
      if (!hasSave()) return toast("No save");
      try { state = loadRaw(localStorage.getItem(SAVE_KEY)); renderAll(); toast("Loaded"); } catch (e) { toast("Load failed"); }
    };
    el("st-export").onclick = exportSave;
    el("st-import").onclick = () => el("import-file").click();
    el("st-menu").onclick = showMenu;
    el("st-reset").onclick = () => {
      openModal({
        title: "Reset game?",
        body: "<p>This clears the current run from memory and local storage.</p>",
        buttons: [
          { label: "Cancel" },
          { label: "Reset", danger: true, primary: true, onClick: () => {
            try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(SAVE_KEY + ":bak"); } catch {}
            state = null; closeModal(); showMenu();
          } }
        ]
      });
    };
  }

  function drawChart(id, data, color) {
    const canvas = el(id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 140;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const pts = data.slice(-52);
    if (pts.length < 2) {
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.font = "12px sans-serif";
      ctx.fillText("Awaiting history", 12, h / 2);
      return;
    }
    const min = Math.min(0, ...pts);
    const max = Math.max(...pts, 1);
    const span = max - min || 1;
    ctx.beginPath();
    pts.forEach((v, i) => {
      const x = (i / (pts.length - 1)) * (w - 8) + 4;
      const y = h - 8 - ((v - min) / span) * (h - 16);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.lineTo(w - 4, h - 8);
    ctx.lineTo(4, h - 8);
    ctx.closePath();
    ctx.fillStyle = color.replace(")", ",0.12)").replace("rgb", "rgba").replace("#", "");
    const grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, color + "33");
    grd.addColorStop(1, color + "00");
    ctx.fillStyle = grd;
    ctx.fill();
  }

  /* ---------- modals / reports ---------- */
  function openModal({ title, body, buttons, choices, closable }) {
    modalOpen = true;
    const root = el("modal-root");
    root.hidden = false;
    el("modal-title").textContent = title;
    el("modal-body").innerHTML = body || "";
    const foot = el("modal-foot");
    foot.innerHTML = "";
    (choices || []).forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.innerHTML = esc(c.label) + (c.detail ? "<small>" + esc(c.detail) + "</small>" : "");
      b.onclick = () => c.onClick && c.onClick();
      foot.appendChild(b);
    });
    (buttons || []).forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn " + (c.primary ? "btn-primary" : c.danger ? "btn-danger" : "btn-ghost");
      b.textContent = c.label;
      b.onclick = () => { if (c.onClick) c.onClick(); else closeModal(); };
      foot.appendChild(b);
    });
    qs(".modal", root).focus();
  }
  function closeModal() {
    modalOpen = false;
    el("modal-root").hidden = true;
  }

  function showWeeklyReport(last, event) {
    const rows = [
      ["Revenue", money(last.revenue), last.revenue >= 0],
      ["Expenses", money(-last.expenses), false],
      ["Profit", money(last.profit), last.profit >= 0],
      ["Customers", (last.customers >= 0 ? "+" : "") + last.customers.toLocaleString(), last.customers >= 0],
      ["Reputation", (last.reputation >= 0 ? "+" : "") + last.reputation, last.reputation >= 0],
      ["Valuation", money(last.valuation), last.valuation >= 0]
    ];
    openModal({
      title: "Week " + (state.week - 1) + " complete",
      body: '<div class="report-grid">' + rows.map((r) => "<div><span>" + r[0] + '</span><strong class="' + (r[2] ? "good" : "bad") + '">' + r[1] + "</strong></div>").join("") + "</div>",
      buttons: [{ label: event ? "Continue" : "OK", primary: true, onClick: () => { closeModal(); afterReport(event); } }]
    });
  }

  function afterReport(event) {
    if (checkBankruptcyFlow()) return;
    if (event) {
      openModal({
        title: event.title,
        body: "<p>" + esc(event.text(state)) + "</p>",
        buttons: event.choices.map((c, i) => ({
          label: c.label,
          primary: i === 0,
          onClick: () => { c.apply(state); closeModal(); renderAll(); save("event"); checkBankruptcyFlow(); }
        }))
      });
      const foot = el("modal-foot");
      foot.innerHTML = "";
      event.choices.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.innerHTML = esc(c.label) + "<small>" + esc(c.detail) + "</small>";
        b.onclick = () => { c.apply(state); closeModal(); renderAll(); save("event"); checkBankruptcyFlow(); };
        foot.appendChild(b);
      });
      return;
    }
    renderAll();
  }

  function checkBankruptcyFlow() {
    if (!state) return false;
    const exp = expensesBreakdown(state);
    const burn = Math.max(1, exp.total - Math.max(0, state.last.revenue));
    const runway = state.cash / burn;
    if (state.cash <= 0) {
      stopAuto();
      state.stats.bankruptcies += 1;
      save("bankrupt");
      openModal({
        title: "Company bankrupt",
        body: "<p>The accounts are empty and payroll bounced.</p><div class='report-grid'>" +
          [["Final valuation", money(state.valuation)], ["Weeks survived", String(state.week)], ["Revenue generated", money(state.stats.totalRevenue)], ["Employees hired", String(state.stats.hired)], ["Customers reached", state.stats.customersPeak.toLocaleString()], ["Products launched", String(state.stats.productsLaunched)], ["Achievements", String(state.stats.achievements)]].map((r) => "<div><span>" + r[0] + "</span><strong>" + r[1] + "</strong></div>").join("") + "</div>",
        buttons: [
          { label: "Main menu", onClick: () => { closeModal(); showMenu(); } },
          { label: "Load previous save", onClick: () => {
            try {
              const bak = localStorage.getItem(SAVE_KEY + ":bak");
              if (!bak) throw new Error("none");
              state = loadRaw(bak);
              closeModal(); renderAll(); toast("Loaded backup");
            } catch { toast("No backup"); }
          } },
          { label: "Restart", primary: true, onClick: () => { closeModal(); showSetup(); } }
        ]
      });
      return true;
    }
    if (runway < 8 && state.cash < exp.total * 8 && !warnedCash) {
      warnedCash = true;
      stopAuto();
      openModal({
        title: "Critical cash warning",
        body: "<p>Your company may run out of money soon. Runway is about " + Math.max(0, Math.floor(runway)) + " weeks.</p>",
        buttons: [
          { label: "Reduce expenses", onClick: () => { closeModal(); switchView("employees"); } },
          { label: "Take a loan", onClick: () => { closeModal(); switchView("finance"); takeLoan(50000, 0.11, 52); } },
          { label: "Increase prices", onClick: () => { closeModal(); switchView("products"); } },
          { label: "Launch marketing", onClick: () => { closeModal(); switchView("marketing"); } },
          { label: "Sell an asset", onClick: () => { closeModal(); switchView("products"); toast("Retire a product to raise cash"); } }
        ]
      });
      return true;
    }
    if (runway > 12) warnedCash = false;
    return false;
  }

  function openMore() {
    openModal({
      title: "More",
      body: '<div class="list">' + ["company","marketing","research","upgrades","market","news","achievements","stats","settings"].map((v) => {
        const labels = { company:"Company", marketing:"Marketing", research:"Research", upgrades:"Upgrades", market:"Market", news:"News", achievements:"Achievements", stats:"Statistics", settings:"Settings" };
        return '<button class="choice more-v" data-v="' + v + '">' + labels[v] + "</button>";
      }).join("") + "</div>",
      buttons: [{ label: "Close" }]
    });
    qsa(".more-v").forEach((b) => b.onclick = () => { closeModal(); switchView(b.dataset.v); });
  }

  /* ---------- autoplay ---------- */
  function stopAuto() {
    paused = true;
    autoLeft = 0;
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = 0; }
    el("btn-pause").disabled = true;
    el("btn-auto").disabled = false;
    el("btn-next").disabled = false;
  }
  function startAuto() {
    if (!state) return;
    paused = false;
    autoLeft = +el("auto-speed").value || 4;
    el("btn-pause").disabled = false;
    el("btn-auto").disabled = true;
    el("btn-next").disabled = true;
    pumpAuto();
  }
  function pumpAuto() {
    if (paused || autoLeft <= 0) { stopAuto(); return; }
    if (modalOpen) { autoTimer = setTimeout(pumpAuto, 280); return; }
    autoLeft -= 1;
    const lastWeek = autoLeft <= 0;
    simulateWeek({ quiet: !lastWeek });
    autoTimer = setTimeout(pumpAuto, lastWeek ? 240 : 160);
  }

  /* ---------- events wiring ---------- */
  function bind() {
    el("btn-new-game").onclick = showSetup;
    el("btn-accessibility-menu").onclick = showAccessibilityModal;
    el("btn-tutorial-top").onclick = () => showTutorial(0);
    el("btn-continue").onclick = () => {
      try { state = loadRaw(localStorage.getItem(SAVE_KEY)); showGame(); }
      catch { toast("Could not load save"); }
    };
    el("btn-import-menu").onclick = () => el("import-file").click();
    el("btn-setup-back").onclick = showMenu;
    el("form-setup").onsubmit = (e) => {
      e.preventDefault();
      const company = el("setup-company").value.trim();
      const ceo = el("setup-ceo").value.trim();
      if (!company || !ceo) return;
      state = newState(company, ceo, selectedIndustry);
      unicornShown = false; warnedCash = false;
      save("new");
      showGame();
      try { if (localStorage.getItem(TUTORIAL_KEY) !== "1") showTutorial(0); } catch { showTutorial(0); }
    };
    el("industry-grid").addEventListener("click", (e) => {
      const b = e.target.closest("[data-ind]");
      if (!b) return;
      selectedIndustry = b.dataset.ind;
      renderIndustries();
    });
    qsa(".nav-btn").forEach((b) => b.onclick = () => switchView(b.dataset.view));
    qsa(".bnav").forEach((b) => b.onclick = () => switchView(b.dataset.view));
    el("btn-sidebar").onclick = () => {
      const sb = el("sidebar");
      const open = !sb.classList.contains("is-open");
      sb.classList.toggle("is-open", open);
      el("sidebar-backdrop").classList.toggle("hidden", !open);
      el("sidebar-backdrop").hidden = !open;
      el("btn-sidebar").setAttribute("aria-expanded", String(open));
    };
    el("sidebar-backdrop").onclick = closeSidebar;
    el("btn-next").onclick = () => { if (!modalOpen) simulateWeek(); };
    el("btn-auto").onclick = startAuto;
    el("btn-pause").onclick = stopAuto;
    el("import-file").onchange = (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) importSaveFile(f);
      e.target.value = "";
    };
    el("modal-root").addEventListener("click", (e) => {
      if (e.target.dataset.close) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) save("hide"); });
    window.addEventListener("pagehide", () => save("hide"));
    window.addEventListener("resize", () => { if (view === "dashboard") renderDashboard(); });
  }
  function closeSidebar() {
    el("sidebar").classList.remove("is-open");
    el("sidebar-backdrop").classList.add("hidden");
    el("sidebar-backdrop").hidden = true;
    el("btn-sidebar").setAttribute("aria-expanded", "false");
  }

  /* init */
  applyAccessibility();
  bind();
  showMenu();
  window.CEO = {
    get state() { return state; },
    save, simulateWeek, money
  };
})();
