import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/Section';
import { PillBase } from '@/components/ui/3d-adaptive-navigation-bar';
import PaperBackground from '@/components/PaperBackground';
import { LinesPatternCard, LinesPatternCardBody } from '@/components/ui/card-with-lines-pattern';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const problemCards = [
  {
    number: '$222B',
    text: 'Annual U.S. manufacturing maintenance costs and losses.',
    citation: '(NIST, 2021).',
    numberClassName: 'text-destructive',
    borderClassName: 'border-destructive/25',
    shadowClassName: 'shadow-[0_30px_80px_rgba(255,79,79,0.08)]',
  },
  {
    number: '28%',
    text: 'Average hands-on "wrench time" observed at one chemical plant — the rest lost to searching for parts, instructions, permits, and coordination.',
    citation: '(Journal of Industrial Intelligence, 2024; single-site study).',
    numberClassName: 'text-[#7fb0ff]',
    borderClassName: 'border-[#7fb0ff]/25',
    shadowClassName: 'shadow-[0_30px_80px_rgba(127,176,255,0.12)]',
  },
  {
    number: '52.7%',
    text: 'Less unplanned downtime at plants using predictive/preventive maintenance heavily, vs. reactive.',
    citation: '(NIST, 2021).',
    numberClassName: 'text-primary',
    borderClassName: 'border-primary/25',
    shadowClassName: 'shadow-[0_30px_80px_rgba(62,207,142,0.12)]',
  },
  {
    number: '51,900',
    text: 'Projected annual job openings for industrial mechanics and millwrights through 2035 — expertise this has to support, not replace.',
    citation: '(BLS, 2026).',
    numberClassName: 'text-[#e4b24d]',
    borderClassName: 'border-[#e4b24d]/25',
    shadowClassName: 'shadow-[0_30px_80px_rgba(228,178,77,0.12)]',
  },
];

const preReconCards = [
  {
    title: 'Route Map',
    text: 'Before any live testing, Groundwork reads the codebase, developer docs, and RULES.md to map endpoints, handler files, middleware chains, and parameters.',
    citation: '(OWASP Foundation, 2020; Scarfone et al., 2008).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
  },
  {
    title: 'Risk Signals',
    text: 'The orchestrator flags raw SQL concatenation, missing auth middleware, hardcoded secrets, eval/exec use, and unvalidated input to focus the attack surface.',
    citation: '(OWASP Foundation, 2021).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
  },
  {
    title: 'Attack Matrix',
    text: 'Those signals become an endpoint-by-attack-type matrix so Groundwork sends workers only where the code suggests real risk, instead of blasting the whole app blindly.',
    citation: '(Scarfone et al., 2008; OWASP Foundation, 2020).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
  },
];

const architectureCards = [
  {
    title: 'Orchestrator',
    text: 'Ingests the codebase, spec, and team rules, uses runtime context, and decides which workers to launch first.',
    citation: '(Souppaya et al., 2022).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
  },
  {
    title: 'Pentester Workers',
    text: 'Specialized workers cover route/auth, injection, auth, config, AI-agent security, and UI flows, then report file, line, severity, reproduction, and suggested fix.',
    citation: '(OWASP Foundation, 2021; Booth et al., 2024).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
  },
  {
    title: 'Construction Worker',
    text: 'Reads the tracked finding, patches the code, validates the fix, and updates remediation state so progress stays visible and verifiable.',
    citation: '(Souppaya et al., 2022; OWASP Foundation, 2025).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
  },
];

const workflowSteps = [
  { title: 'Screen', borderClassName: 'border-primary/30', arrowClassName: 'text-primary' },
  { title: 'Flag', borderClassName: 'border-secondary/30', arrowClassName: 'text-secondary' },
  { title: 'Draft', borderClassName: 'border-accent/30', arrowClassName: 'text-accent' },
  { title: 'Verify & Post', borderClassName: 'border-destructive/30', arrowClassName: 'text-destructive' },
];

const workflowArtifacts = [
  {
    title: 'SQLite Flag + Evidence',
    text: 'Which asset, which window, which fault family - logged the moment PMMCP flags a hit. Healthy machines stay on the board too, so false positives are visible, not hidden.',
    citation: '(PMMCP deterministic diagnosis pipeline).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
    bgClassName: 'bg-primary/10',
  },
  {
    title: 'SKF Manual Passages',
    text: 'Relevant manual sections pulled for the flagged fault - retrieved, not generated from memory.',
    citation: '(SKF, Introduction Guide to Vibration).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
    bgClassName: 'bg-secondary/10',
  },
  {
    title: 'CMMS History',
    text: 'Prior maintenance records already on disk, cited as precedent - not treated as an approved repair procedure.',
    citation: '(Lin et al., 2016).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
    bgClassName: 'bg-accent/10',
  },
  {
    title: 'Cited Work Order',
    text: 'One ticket per fault. A writer checks every citation before it hits the board - same asset, same fault already open means no duplicate.',
    citation: '(Verified before posting.)',
    accentClassName: 'text-destructive',
    borderClassName: 'border-destructive/30',
    bgClassName: 'bg-destructive/10',
  },
];

const outputCards = [
  {
    title: 'Interactive Graph View',
    text: 'Endpoints, files, and findings become a severity-colored network so developers can drill into relationships instead of scanning a static report.',
    citation: '(Hasselbring et al., 2020).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
  },
  {
    title: 'PDF Reports',
    text: 'Executive summary plus critical/high/medium-low sections, with GitHub permalinks and linked tickets on every page.',
    citation: '(OWASP Foundation, 2025; Scarfone et al., 2008).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
  },
  {
    title: 'RAG Q&A',
    text: 'Developers ask natural-language questions like "What is the most critical finding?" and get direct answers with code references.',
    citation: '(Lewis et al., 2020).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
  },
  {
    title: 'Workflow Integrations',
    text: 'Chat, ticketing, observability, and browser-automation integrations keep Groundwork inside the tooling developers already use.',
    citation: '(Souppaya et al., 2022).',
    accentClassName: 'text-destructive',
    borderClassName: 'border-destructive/30',
  },
];

const fixLoopCards = [
  {
    title: 'Exploit Confidence',
    badge: 'exploit:confirmed | exploit:unconfirmed',
    text: 'Groundwork distinguishes suspicious code patterns from vulnerabilities it actually reproduced against the live app.',
    citation: '(Scarfone et al., 2008).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
  },
  {
    title: 'Monkeypatch Status',
    badge: 'validated | failed | not-attempted',
    text: 'Pentester workers try fast proof fixes, restart the app, and re-attack so the next worker knows whether the direction is sound.',
    citation: '(Souppaya et al., 2022).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
  },
  {
    title: 'Fix Status',
    badge: 'unfixed -> in-progress -> verified',
    text: 'Construction workers update issue labels as they patch, validate, and open PRs, making remediation state visible to everyone.',
    citation: '(Souppaya et al., 2022; OWASP Foundation, 2025).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
  },
];

const summaryCards = [
  {
    title: 'Research-Informed',
    text: 'Threat-informed testing, staged execution, and evidence-first reporting shape Groundwork from the start.',
    citation: '(Scarfone et al., 2008; OWASP Foundation, 2025).',
    accentClassName: 'text-primary',
    borderClassName: 'border-primary/30',
  },
  {
    title: 'Developer-Native',
    text: 'Grounded Q&A, tracked remediation, and workflow integrations keep security inside the engineering loop instead of a separate silo.',
    citation: '(Souppaya et al., 2022; Lewis et al., 2020).',
    accentClassName: 'text-secondary',
    borderClassName: 'border-secondary/30',
  },
  {
    title: 'Closed Loop',
    text: 'Groundwork differentiates on code-aware planning, structured findings, automated remediation, and verification after the patch.',
    citation: '(Souppaya et al., 2022; OWASP Foundation, 2025).',
    accentClassName: 'text-accent',
    borderClassName: 'border-accent/30',
  },
];

const businessTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    subtitle: 'Solo devs and side projects',
    features: [
      '5 scans per month',
      '1 repo workspace',
      'Severity dashboard',
      'OWASP tagging',
      'Issue export',
    ],
    borderClassName: 'border-white/10',
    dotClassName: 'bg-primary',
    priceClassName: 'text-4xl md:text-5xl text-foreground',
    shadowClassName: 'shadow-[0_24px_70px_rgba(0,0,0,0.22)]',
  },
  {
    name: 'Startup',
    price: '$99',
    period: '/mo',
    subtitle: 'Small teams shipping fast',
    features: [
      '50 scans per month',
      'AI attack testing',
      'GitHub or Linear tickets',
      'Fixer-agent PR drafts',
      'Code-aware planning',
    ],
    borderClassName: 'border-secondary/30',
    dotClassName: 'bg-secondary',
    priceClassName: 'text-4xl md:text-5xl text-secondary',
    shadowClassName: 'shadow-[0_24px_70px_rgba(33,166,103,0.12)]',
  },
  {
    name: 'Team',
    price: '$299',
    period: '/mo',
    subtitle: 'Growing engineering teams',
    features: [
      'Everything in Startup',
      'CI/CD scans on every push',
      'Slack alerts on critical findings',
      'PDF and compliance-ready reports',
      'Multi-repo workspace',
    ],
    borderClassName: 'border-primary/70',
    dotClassName: 'bg-primary',
    priceClassName: 'text-4xl md:text-5xl text-primary',
    shadowClassName: 'shadow-[0_32px_90px_rgba(62,207,142,0.18)]',
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    subtitle: 'Large orgs and compliance-heavy teams',
    features: [
      'Everything in Team',
      'Human security engineer review',
      'SSO and audit logs',
      'VPC or self-hosted runner options',
      'Custom SLA and procurement support',
    ],
    borderClassName: 'border-accent/35',
    dotClassName: 'bg-accent',
    priceClassName: 'text-3xl md:text-4xl text-accent',
    shadowClassName: 'shadow-[0_24px_70px_rgba(20,141,120,0.12)]',
  },
];

const businessModelRows = [
  { label: 'Primary revenue', value: 'Monthly and annual SaaS subscriptions' },
  { label: 'Secondary revenue', value: 'Usage overages on scans and agent runtime' },
  { label: 'Enterprise revenue', value: 'Human review, VPC, and compliance add-ons' },
  { label: 'Pricing model', value: 'Hybrid: platform fee + usage' },
  { label: 'Billing', value: 'Monthly by default, annual discount available' },
  { label: 'Growth motion', value: 'Bottom-up -> team expansion -> enterprise' },
];

const upgradeRows = [
  { label: 'Free -> Startup', value: 'Hit scan cap or need auto-fix PRs' },
  { label: 'Startup -> Team', value: 'Need CI/CD, Slack alerts, and multi-repo' },
  { label: 'Team -> Enterprise', value: 'Need SSO, audit logs, or VPC deployment' },
  { label: 'Compliance trigger', value: 'SOC 2 / ISO 27001 evidence for procurement' },
  { label: 'Market benchmark', value: '$25-$40/dev/mo or €90/app/mo', isBadge: true },
];

const marketCards = [
  {
    title: 'TAM',
    value: '$15B',
    description: 'Every facility worldwide investing in predictive maintenance technology',
    methodology: '$15B global predictive maintenance market, 2026 (cluster estimate: MarketsandMarkets, Research and Markets, SkyQuest)',
    bullets: [
      'Any industry with rotating/critical equipment',
      'Growing at 22-29% CAGR across most analyst estimates',
    ],
    borderClassName: 'border-[#5a98f2]/45',
    accentClassName: 'text-[#7fb0ff]',
    dotClassName: 'bg-[#4a90ff]',
    shadowClassName: 'shadow-[0_28px_80px_rgba(74,144,255,0.14)]',
  },
  {
    title: 'SAM',
    value: '~$3B',
    description: 'Manufacturing facilities requiring on-premise or air-gapped AI deployment',
    methodology: '$15B x 28.4% (manufacturing share of PdM spend, Evolvance) x 71.6% (on-premise deployment share, Market.us) is approximately $3.05B - estimate',
    bullets: [
      'Facilities with existing vibration sensing infrastructure',
      'Regulated/restricted environments barring cloud AI processing',
    ],
    borderClassName: 'border-primary/45',
    accentClassName: 'text-primary',
    dotClassName: 'bg-primary',
    shadowClassName: 'shadow-[0_28px_80px_rgba(62,207,142,0.14)]',
  },
  {
    title: 'SOM - Year 3',
    value: '$1M-$3M',
    description: 'Early-adopter facilities piloting agentic maintenance with air-gap requirements',
    methodology: 'Estimate: reachable facilities x pilot conversion rate x per-site contract value - not yet validated by customer discovery',
    bullets: [
      'Facilities already burned by an unplanned-downtime incident',
      'Sites with an active internal mandate against external AI processing',
    ],
    borderClassName: 'border-[#d9a441]/45',
    accentClassName: 'text-[#e4b24d]',
    dotClassName: 'bg-[#c88419]',
    shadowClassName: 'shadow-[0_28px_80px_rgba(217,164,65,0.14)]',
  },
];

const ganttMetrics = [
  { label: 'Traditional workflow', value: '4-10 weeks', valueClassName: 'text-[#f27e73]' },
];

const ganttDays = Array.from({ length: 22 }, (_, index) => index + 1);

const traditionalWorkflowRows = [
  { label: 'Vendor RFP & scheduling', dotClassName: 'bg-[#c83a36]', barClassName: 'bg-[#c83a36]', start: 1, span: 4, barLabel: 'Find & book pentest' },
  { label: 'Scoping call & NDA', dotClassName: 'bg-[#9b9a94]', barClassName: 'bg-[#a6a39c]', start: 5, span: 2, barLabel: 'Scope docs' },
  { label: 'Pentest execution', dotClassName: 'bg-[#c83a36]', barClassName: 'bg-[#c83a36]', start: 7, span: 5, barLabel: 'Manual testing (5 days)' },
  { label: 'Waiting for report', dotClassName: 'bg-[#9b9a94]', barClassName: 'bg-[#a6a39c]', start: 12, span: 4, barLabel: 'Report generation' },
  { label: 'PDF report delivered', dotClassName: 'bg-[#c83a36]', barClassName: 'bg-[#c83a36]', start: 16, span: 1 },
  { label: 'Internal triage meeting', dotClassName: 'bg-[#9b9a94]', barClassName: 'bg-[#a6a39c]', start: 17, span: 2 },
  { label: 'Manual ticket creation', dotClassName: 'bg-[#c83a36]', barClassName: 'bg-[#c83a36]', start: 19, span: 2, barLabel: 'Jira / Linear' },
  { label: 'Dev fixes (manual)', dotClassName: 'bg-[#2f6fb6]', barClassName: 'bg-[#2f6fb6]', start: 21, span: 2, barLabel: 'Code fixes' },
  { label: 'Re-test & verify', dotClassName: 'bg-[#9b9a94]', barClassName: 'bg-[#a6a39c]', start: 22, span: 1 },
];

const dispatchWorkflowRows = [
  { label: 'Pre-recon (automated)', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#1fb388]', start: 1, span: 1 },
  { label: 'Parallel worker testing', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#24b587]', start: 2, span: 2 },
  { label: 'GitHub issues created', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#24b587]', start: 4, span: 1 },
  { label: 'Construction worker patches', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#24b587]', start: 5, span: 1 },
  { label: 'Dev review & merge', dotClassName: 'bg-[#2f6fb6]', barClassName: 'bg-[#2f6fb6]', start: 6, span: 1 },
  { label: 'Automated verification', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#24b587]', start: 7, span: 1 },
  { label: 'PDF + graph report', dotClassName: 'bg-[#1fb388]', barClassName: 'bg-[#24b587]', start: 8, span: 1 },
];

const demoMoments = [
  'Dispatch ingests the repo and reads the rules like a developer.',
  'Workers attack the app in parallel and prove what is actually exploitable.',
  'Issues are created automatically and the construction worker opens the fix PR.',
  '90 seconds later, the developer reviews the PR instead of reading a PDF.',
];

const competitorTools = [
  { tool: 'Tractian', description: 'Continuous vibration monitoring, AI diagnosis, auto work-order conversion.' },
  { tool: 'Oxmaint', description: 'Agentic AI maintenance copilot; generates, assigns, schedules and closes work orders.' },
  { tool: 'Augury', description: 'AI-driven condition monitoring and machine health diagnostics.' },
  { tool: 'SKF', description: 'Condition-monitoring hardware/analytics, advertises on-premises option.' },
  { tool: 'Groundwork', description: 'Local, deterministic diagnosis with cited work orders and provable containment.', isOurs: true },
];

const competitorFeatures = [
  { label: 'Continuous monitoring', values: ['yes', 'yes', 'yes', 'yes', 'yes'] },
  { label: 'Autonomous diagnosis', values: ['yes', 'yes', 'unknown', 'unknown', 'yes'] },
  { label: 'Auto-generated work order', values: ['yes', 'yes', 'unknown', 'unknown', 'yes'] },
  { label: 'Cited evidence', values: ['unknown', 'unknown', 'unknown', 'unknown', 'yes'] },
  { label: 'Provable/logged containment', values: ['unknown', 'unknown', 'unknown', 'unknown', 'yes'] },
];

const forceCards = [
  {
    title: 'Threat of New Entrants',
    level: 'Medium-High',
    levelClassName: 'bg-[#5a4311] text-[#e4b24d]',
    barClassName: 'bg-[#d28a1d]',
    widthClassName: 'w-[68%]',
    text: 'AI tooling costs are falling fast. Moats must come from data network effects and developer workflow stickiness, not the orchestrator pattern alone.',
  },
  {
    title: 'Bargaining Power of Buyers',
    level: 'Medium',
    levelClassName: 'bg-[#5a4311] text-[#e4b24d]',
    barClassName: 'bg-[#d28a1d]',
    widthClassName: 'w-[56%]',
    text: 'Developers have many alternatives, but switching cost rises once Groundwork is embedded into CI/CD and GitHub workflows.',
  },
  {
    title: 'Bargaining Power of Suppliers',
    level: 'Low',
    levelClassName: 'bg-[#214b18] text-[#7fd14c]',
    barClassName: 'bg-[#15876d]',
    widthClassName: 'w-[26%]',
    text: 'LLM APIs are the main supplier dependency. Multi-model support is straightforward and cloud infrastructure remains commoditized.',
  },
  {
    title: 'Threat of Substitutes',
    level: 'High',
    levelClassName: 'bg-[#5e2a25] text-[#f27e73]',
    barClassName: 'bg-[#be3a35]',
    widthClassName: 'w-[80%]',
    text: 'Snyk, Semgrep, GitHub Advanced Security, Checkmarx, Veracode, and manual pentests all compete for the same budget.',
  },
  {
    title: 'Competitive Rivalry',
    level: 'High',
    levelClassName: 'bg-[#5e2a25] text-[#f27e73]',
    barClassName: 'bg-[#be3a35]',
    widthClassName: 'w-[84%]',
    text: "Groundwork's agentic remediation loop is differentiated today, but larger AppSec vendors can close feature gaps quickly if customer pull is real.",
    fullWidth: true,
  },
];

const Citation = ({ text, className = '' }: { text: string; className?: string }) => (
  <p className={`mt-4 text-xs leading-relaxed tracking-wide text-muted-foreground/70 ${className}`}>
    {text}
  </p>
);

const MAIN_NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Problem', id: 'problem' },
  { label: 'Groundwork', id: 'how-it-works' },
  { label: 'Onboarding', id: 'onboarding' },
  { label: 'Demo', id: 'demo' },
  { label: 'Market', id: 'market-size' },
  { label: 'Expansion', id: 'expansion' },
  { label: 'Competition', id: 'competition' },
  { label: 'Conclusion', id: 'conclusion' },
];

const APPENDIX_NAV_ITEMS = [
  { label: 'Five Forces', id: 'five-forces' },
  { label: 'Summary', id: 'summary' },
  { label: 'Business', id: 'business-model' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'EVA', id: 'eva' },
  { label: 'Pre-Recon', id: 'clinical' },
  { label: 'Architecture', id: 'solution' },
  { label: 'Outputs', id: 'dashboard' },
  { label: 'Fix Loop', id: 'muscle' },
];

const SECTION_IDS = [...MAIN_NAV_ITEMS.map((item) => item.id), ...APPENDIX_NAV_ITEMS.map((item) => item.id)];

const Index = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('home');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    { name: 'Mateo del Rio Lanse', role: 'Electrical & Computer Engineering', initials: 'M', image: '/Mateo_Headshot.jpeg', school: 'Cornell University' },
    { name: 'Jimmy Mulosmani', role: 'Computer Science', initials: 'J', image: '/Jimmy_Headshot.jpeg', school: 'Cornell University' },
    { name: 'Max Martinez', role: 'Mechanical Engineering', initials: 'M', image: '/Max_Headshot.webp', school: 'New Jersey Institute of Technology' },
    { name: 'Yahil Corcino', role: 'Computer Engineering', initials: 'Y', image: '/Yahil_Headshot.webp', school: 'New Jersey Institute of Technology' },
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportH = container.clientHeight;
      const scrollMid = scrollTop + viewportH / 2;

      for (const sectionId of SECTION_IDS) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollMid >= top && scrollMid < top + el.offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      <PaperBackground />

      <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2">
        <PillBase activeSection={activeSection} navItems={MAIN_NAV_ITEMS} onSectionClick={scrollToSection} />
      </div>

      {activeSection === 'conclusion' && (
        <div className="fixed bottom-6 left-6 z-[70] flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-white p-3 shadow-lg">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://github.com/mdelriolanse/plant-floor-agent&bgcolor=ffffff&color=000000"
              alt="GitHub QR Code"
              className="h-36 w-36"
            />
          </div>
          <p className="text-sm text-muted-foreground font-semibold">GitHub</p>
        </div>
      )}

      <div ref={scrollContainerRef} className="snap-y snap-mandatory h-screen overflow-y-scroll scrollbar-hide relative">
        <Section id="home" className="bg-transparent" contentClassName="max-w-7xl py-16 lg:py-20">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-6xl text-center"
            >
              <img src="/groundwork-logo-v2.svg" alt="Groundwork" className="h-24 md:h-32 mx-auto" />
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto mt-14">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                >
                  <LinesPatternCard
                    className="h-[24rem] rounded-[2rem] shadow-2xl"
                    patternClassName="h-full overflow-hidden rounded-[1.25rem]"
                    gradientClassName="h-full overflow-hidden rounded-[1.25rem]"
                  >
                    <LinesPatternCardBody className="h-full rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-secondary/5 p-0 md:p-0">
                      <div className="flex h-full flex-col items-center px-5 py-8 text-center sm:px-6">
                        {member.image ? (
                          <div className="flex h-36 items-center justify-center">
                            <div className="h-32 w-32 overflow-hidden rounded-full border border-primary/20 shadow-sm">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-36 items-center justify-center">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-3xl font-bold text-primary shadow-sm">
                              {member.initials}
                            </div>
                          </div>
                        )}
                        <div className="mt-6 flex min-h-[7.5rem] w-full flex-col items-center">
                          <p className="text-xl leading-tight text-foreground font-semibold">{member.name}</p>
                          <p className="mt-3 w-full text-[0.95rem] leading-tight text-muted-foreground">{member.role}</p>
                          <p className="mt-2 text-sm font-bold tracking-wide text-foreground">
                            {member.school}
                          </p>
                        </div>
                      </div>
                    </LinesPatternCardBody>
                  </LinesPatternCard>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-10 w-fit whitespace-nowrap text-center text-xl font-light leading-none text-muted-foreground md:text-2xl xl:text-[2rem]"
            >
              {t('home.subtitle')}
            </motion.p>
          </div>
        </Section>

        <Section id="problem" className="bg-transparent" contentClassName="max-w-[92rem] py-3">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false, amount: 0.35 }}
              className="mx-auto max-w-6xl text-center"
            >
              <h2 className="text-3xl font-black tracking-tight leading-[1.05] text-foreground md:text-5xl xl:text-6xl">
                Sensors detect the anomaly. Then someone still has to <span className="text-destructive">figure it out</span>.
              </h2>
              <p className="mx-auto mt-3 max-w-5xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                The bottleneck isn't diagnosis. It's turning a signal into a trustworthy, cited answer.
              </p>
            </motion.div>

            <div className="grid max-w-7xl mx-auto gap-2.5 md:grid-cols-2 xl:grid-cols-4">
              {problemCards.map((card, index) => (
                <motion.div
                  key={card.number}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * index }}
                  viewport={{ once: false, amount: 0.3 }}
                  className={`h-full rounded-[1.5rem] border bg-card/90 px-4 py-4 backdrop-blur-md ${card.borderClassName} ${card.shadowClassName}`}
                >
                  <div className={`text-4xl font-black tracking-tight md:text-5xl ${card.numberClassName}`}>
                    {card.number}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {card.text}
                  </p>
                  <Citation text={card.citation} className="!mt-1.5" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              viewport={{ once: false, amount: 0.25 }}
            >
              <LinesPatternCard className="max-w-5xl mx-auto rounded-[1.75rem] border-primary/30 shadow-[0_30px_90px_rgba(33,117,78,0.22)]">
                <LinesPatternCardBody className="p-5 md:p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                      <p className="text-lg font-semibold text-destructive mb-1">Today</p>
                      <p className="text-4xl md:text-5xl font-black text-destructive">28% wrench time</p>
                      <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                        A technician gets an alert, then manually searches records, manuals, and history before hands-on work can start.
                      </p>
                      <Citation text="(Journal of Industrial Intelligence, 2024)." className="!mt-2" />
                    </div>
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                      <p className="text-lg font-semibold text-primary mb-1">With Groundwork</p>
                      <p className="text-2xl md:text-3xl font-black text-primary">Cited work order, pre-drafted</p>
                      <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                        Deterministic diagnosis and artifact-level citations prepared before a technician opens a ticket.
                      </p>
                      <Citation text="(Pipeline output — not a measured time claim)." className="!mt-2" />
                    </div>
                  </div>
                </LinesPatternCardBody>
              </LinesPatternCard>
            </motion.div>
          </div>
        </Section>

        <Section id="how-it-works" className="bg-transparent" contentClassName="max-w-7xl py-6">
          <div className="space-y-5">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-foreground md:text-5xl xl:text-6xl">
                Always on. Two layers. <span className="text-primary">One cited work order</span>.
              </h1>
              <p className="max-w-5xl mx-auto text-lg md:text-xl text-muted-foreground">
                OpenClaw watches the fleet on a heartbeat. PMMCP screens the signal - no language model in that loop. Only a flagged fault wakes a local model to draft the ticket.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2.5 max-w-6xl mx-auto"
            >
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="flex items-center gap-2.5">
                  <LinesPatternCard className={`rounded-lg shadow-lg ${step.borderClassName}`}>
                    <LinesPatternCardBody className="flex h-12 items-center justify-center px-3 py-2 text-center">
                      <p className="text-lg font-semibold text-foreground whitespace-nowrap">{step.title}</p>
                    </LinesPatternCardBody>
                  </LinesPatternCard>

                  {index < workflowSteps.length - 1 && (
                    <div className={`text-xl font-bold ${step.arrowClassName}`}>→</div>
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <LinesPatternCard className="rounded-xl shadow-2xl border-primary/40 max-w-7xl mx-auto">
                <LinesPatternCardBody className="p-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-5 text-center">Artifacts at each stage</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {workflowArtifacts.map((artifact) => (
                      <div
                        key={artifact.title}
                        className={`rounded-xl border p-4 text-left ${artifact.bgClassName} ${artifact.borderClassName}`}
                      >
                        <p className={`text-xl md:text-2xl font-semibold ${artifact.accentClassName}`}>{artifact.title}</p>
                        <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground">{artifact.text}</p>
                        <Citation text={artifact.citation} className="!mt-1.5" />
                      </div>
                    ))}
                  </div>
                </LinesPatternCardBody>
              </LinesPatternCard>
            </motion.div>

            <LinesPatternCard className="max-w-5xl mx-auto rounded-xl shadow-2xl border-primary/25">
              <LinesPatternCardBody className="p-4 text-center">
                <p className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
                  Not just an <span className="text-destructive">alert</span>, but a <span className="text-primary">cited work order</span>.
                </p>
              </LinesPatternCardBody>
            </LinesPatternCard>
          </div>
        </Section>

        <Section id="onboarding" className="bg-transparent" contentClassName="max-w-6xl py-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-foreground md:text-5xl xl:text-6xl">
                From pilot to plant-wide, <span className="text-primary">without new hardware</span>
              </h1>
              <p className="max-w-4xl mx-auto text-lg md:text-xl text-muted-foreground">
                A five-step path any existing facility can start on this week.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-6xl mx-auto">
              {[
                { title: 'Connect', border: 'border-primary/30', arrow: 'text-primary' },
                { title: 'Deploy Local', border: 'border-secondary/30', arrow: 'text-secondary' },
                { title: 'Calibrate', border: 'border-accent/30', arrow: 'text-accent' },
                { title: 'Shadow Mode', border: 'border-[#e4b24d]/30', arrow: 'text-[#e4b24d]' },
                { title: 'Go Live', border: 'border-destructive/30', arrow: 'text-destructive' },
              ].map((step, index, arr) => (
                <div key={step.title} className="flex items-center gap-2.5">
                  <div className={`rounded-lg border shadow-lg flex h-12 items-center justify-center px-3 py-2 text-center ${step.border}`}>
                    <p className="text-lg font-semibold text-foreground whitespace-nowrap">{step.title}</p>
                  </div>
                  {index < arr.length - 1 && <div className={`text-xl font-bold ${step.arrow}`}>&rarr;</div>}
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-6xl mx-auto text-left">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-xl font-semibold text-primary">Connect</p>
                <p className="mt-2 text-sm text-foreground">Plug into existing vibration sensors and CMMS/manual PDFs already on site.</p>
              </div>
              <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-4">
                <p className="text-xl font-semibold text-secondary">Deploy Local</p>
                <p className="mt-2 text-sm text-foreground">OpenClaw, PMMCP, and OpenShell install on-prem. Inference never leaves the building.</p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
                <p className="text-xl font-semibold text-accent">Calibrate</p>
                <p className="mt-2 text-sm text-foreground">PMMCP sets healthy-baseline thresholds specific to this facility's own equipment.</p>
              </div>
              <div className="rounded-xl border border-[#e4b24d]/30 bg-[#e4b24d]/10 p-4">
                <p className="text-xl font-semibold text-[#e4b24d]">Shadow Mode</p>
                <p className="mt-2 text-sm text-foreground">Runs alongside the current workflow. Work orders compared against what technicians actually find.</p>
              </div>
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-xl font-semibold text-destructive">Go Live</p>
                <p className="mt-2 text-sm text-foreground">Once accuracy and false-positive gates clear, cited work orders enter the real workflow.</p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/25 bg-card/90 p-6 max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                One documented pattern: a dairy facility began with a single-line, 30-day pilot. Vibration monitoring caught structural looseness on a separator before failure. The facility then expanded to 750+ sensors across 13 facilities.
              </p>
              <Citation text="(AssetWatch case study - vendor-published, illustrative)." className="!mt-2" />
            </div>
          </div>
        </Section>

        <Section id="demo" className="bg-transparent" contentClassName="max-w-6xl py-10">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                <span className="text-primary">Groundwork</span> Video Demo
              </h1>
            </div>
            <div className="rounded-2xl overflow-hidden border border-primary/30 shadow-[0_30px_90px_rgba(0,0,0,0.4)]" style={{ height: '60vh' }}>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/XeN-OGumtwE"
                title="Groundwork Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </Section>

        <Section id="market-size" className="bg-transparent">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground">Market Size</h1>
              <p className="max-w-5xl mx-auto text-xl md:text-2xl text-muted-foreground">
                A $15B market growing 22-29% annually - expanding into facilities that can't send data to the cloud.
              </p>
            </div>

            <div className="grid max-w-7xl mx-auto gap-6 lg:grid-cols-3">
              {marketCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 * index }}
                >
                  <div className={`h-full rounded-[2rem] border bg-card/90 px-8 py-10 backdrop-blur-md ${card.borderClassName} ${card.shadowClassName}`}>
                    <p className={`text-2xl md:text-3xl font-semibold tracking-[0.12em] uppercase ${card.accentClassName}`}>
                      {card.title}
                    </p>
                    <div className={`mt-6 text-3xl md:text-4xl font-black tracking-tight ${card.accentClassName}`}>
                      {card.value}
                    </div>
                    <p className="mt-6 text-xl md:text-2xl leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                    {card.methodology && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70 font-mono bg-white/5 rounded-lg px-3 py-2">
                        {card.methodology}
                      </p>
                    )}

                    <div className="mt-8 border-t border-border/60 pt-6">
                      <ul className="space-y-5">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-xl leading-relaxed text-foreground/90">
                            <span className={`mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full ${card.dotClassName}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="expansion" className="bg-transparent" contentClassName="max-w-6xl py-6">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-foreground md:text-5xl xl:text-6xl">
                Same technique. <span className="text-primary">Every rotating machine.</span>
              </h1>
              <p className="max-w-4xl mx-auto text-lg md:text-xl text-muted-foreground">
                This demo runs on bearing faults. The underlying signal doesn't care what industry it's in.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-4xl font-black text-primary">26%</p>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Vibration monitoring is already the single largest technique in the global machine condition monitoring market.
                </p>
                <Citation text="(Grand View Research)." className="!mt-2" />
              </div>
              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <p className="text-4xl font-black text-secondary">$401M to $606M</p>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  CNC machine tool monitoring market alone, 2024 to 2032 - one adjacent vertical sharing the exact same failure signature.
                </p>
                <Citation text="(Intel Market Research)." className="!mt-2" />
              </div>
            </div>

            <p className="text-center text-base text-muted-foreground max-w-3xl mx-auto">
              Same equipment class, different input, different industry: laser engravers, fabric cutters, and precision pumps all run on the same rotating machinery this technique already targets.
            </p>
          </div>
        </Section>

        <Section id="competition" className="bg-transparent" contentClassName="max-w-7xl py-6">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">Competitive Landscape</h1>
              <p className="max-w-5xl mx-auto text-lg md:text-xl text-muted-foreground">
                Others stop at detection. Groundwork closes the loop to verified remediation.
              </p>
            </div>

            <LinesPatternCard className="rounded-[1.5rem] shadow-2xl border-primary/25">
              <LinesPatternCardBody className="p-4 md:p-5">
                <div className="overflow-x-auto">
                  <table className="min-w-[1100px] w-full text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-sm md:text-base text-muted-foreground">
                        <th className="pb-3 pr-4 font-semibold">Feature</th>
                        {competitorTools.map((t) => (
                          <th key={t.tool} className={`pb-3 px-3 text-center font-semibold ${t.isOurs ? 'text-primary' : ''}`}>
                            <div className="text-lg">{t.tool}</div>
                            <div className="text-xs font-normal text-muted-foreground mt-1 max-w-[160px] mx-auto">{t.description}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {competitorFeatures.map((feature) => (
                        <tr key={feature.label} className="border-b border-border/50">
                          <td className="py-4 pr-4 align-top text-base md:text-lg font-semibold text-foreground/85">
                            {feature.label}
                          </td>
                          {feature.values.map((value, index) => (
                            <td key={`${feature.label}-${competitorTools[index].tool}`} className={`py-4 px-3 text-center align-top ${competitorTools[index].isOurs ? 'bg-primary/18 ring-1 ring-primary/50' : ''}`}>
                              {value === 'yes' ? (
                                <span className={`text-3xl leading-none ${competitorTools[index].isOurs ? 'text-primary' : 'text-[#23c59a]'}`}>&#10003;</span>
                              ) : value === 'partial' ? (
                                <span className="text-lg font-semibold text-[#d99321]">Partial</span>
                              ) : value === 'unknown' ? (
                                <span className="text-lg text-muted-foreground/35">&mdash;</span>
                              ) : (
                                <span className="text-3xl leading-none text-muted-foreground/55">&times;</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-2xl text-[#23c59a]">✓</span>
                    <span>Yes</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-lg text-muted-foreground/35">—</span>
                    <span>Not confirmed</span>
                  </div>
                  <div className="font-semibold text-muted-foreground">
                    What's confirmed publicly: no evaluated competitor pairs auto-generated work orders with cited evidence and provable, logged containment.
                  </div>
                </div>
              </LinesPatternCardBody>
            </LinesPatternCard>

            <LinesPatternCard className="max-w-5xl mx-auto rounded-2xl shadow-xl border-primary/30">
              <LinesPatternCardBody className="p-5 text-center">
                <p className="text-center text-base text-muted-foreground mt-4">
                  Agentic maintenance already exists — including local, on-prem versions like Oxmaint's. What's absent from the published literature is a working MCP-based architecture with provable, logged containment.
                </p>
                <Citation text="(MDPI, 2025 — systematic review found no solid MCP-based predictive maintenance implementations to date)." className="!mt-2" />
              </LinesPatternCardBody>
            </LinesPatternCard>
          </div>
        </Section>

        <Section id="conclusion" className="bg-transparent" contentClassName="max-w-7xl py-16 lg:py-20">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-6xl text-center"
            >
              <img src="/groundwork-logo-v2.svg" alt="Groundwork" className="h-24 md:h-32 mx-auto" />
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                >
                  <LinesPatternCard
                    className="h-[24rem] rounded-[2rem] shadow-2xl"
                    patternClassName="h-full overflow-hidden rounded-[1.25rem]"
                    gradientClassName="h-full overflow-hidden rounded-[1.25rem]"
                  >
                    <LinesPatternCardBody className="h-full rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-secondary/5 p-0 md:p-0">
                      <div className="flex h-full flex-col items-center px-5 py-8 text-center sm:px-6">
                        {member.image ? (
                          <div className="flex h-36 items-center justify-center">
                            <div className="h-32 w-32 overflow-hidden rounded-full border border-primary/20 shadow-sm">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-36 items-center justify-center">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-3xl font-bold text-primary shadow-sm">
                              {member.initials}
                            </div>
                          </div>
                        )}
                        <div className="mt-6 flex min-h-[7.5rem] w-full flex-col items-center">
                          <p className="text-xl leading-tight text-foreground font-semibold">{member.name}</p>
                          <p className="mt-3 w-full text-[0.95rem] leading-tight text-muted-foreground">{member.role}</p>
                          <p className="mt-2 text-sm font-bold tracking-wide text-foreground">
                            {member.school}
                          </p>
                        </div>
                      </div>
                    </LinesPatternCardBody>
                  </LinesPatternCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
                We didn't rebuild diagnosis. <span className="text-primary">We built the proof around it.</span>
              </p>
            </motion.div>

          </div>
        </Section>
      </div>

    </div>
  );
};

export default Index;
