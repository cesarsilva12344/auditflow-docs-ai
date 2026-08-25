import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Bot,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Copy,
  FileCheck2,
  FilePlus2,
  FileText,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PenLine,
  Play,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  Users2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type View = "overview" | "documents" | "prompts" | "prompt-category";

type PageState = {
  view: View;
  categoryId?: string;
};

type PromptCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  tint: string;
  promptCount: number;
  description: string;
};

type Prompt = {
  title: string;
  description: string;
  categoryId: string;
};

type DocumentTemplate = {
  title: string;
  description: string;
  category: "Planejamento" | "Execução" | "Encerramento";
  icon: LucideIcon;
  tone: string;
  eyebrow: string;
};

const navItems: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "documents", label: "Documentos e processos", icon: FileText },
  { id: "prompts", label: "AI Prompts", icon: Sparkles },
];

const promptCategories: PromptCategory[] = [
  {
    id: "strategy",
    name: "Estratégia e Iniciação",
    icon: Target,
    tint: "blue",
    promptCount: 10,
    description: "Clareza para decidir se o projeto deve começar e por quê.",
  },
  {
    id: "scope",
    name: "Escopo e Requisitos",
    icon: ClipboardList,
    tint: "slate",
    promptCount: 10,
    description: "Transforme necessidades dispersas em entregas verificáveis.",
  },
  {
    id: "time",
    name: "Cronograma e Tempo",
    icon: Clock3,
    tint: "coral",
    promptCount: 10,
    description: "Planeje fases, dependências e marcos com mais segurança.",
  },
  {
    id: "cost",
    name: "Custos e Orçamento",
    icon: Gauge,
    tint: "amber",
    promptCount: 10,
    description: "Estruture estimativas, premissas e desvios de custo.",
  },
  {
    id: "communication",
    name: "Comunicação e Stakeholders",
    icon: MessageSquareText,
    tint: "violet",
    promptCount: 10,
    description: "Ajuste a mensagem para cada pessoa que importa no projeto.",
  },
  {
    id: "risk",
    name: "Riscos e Oportunidades",
    icon: Lightbulb,
    tint: "yellow",
    promptCount: 10,
    description: "Antecipe cenários e escolha respostas proporcionais.",
  },
  {
    id: "quality",
    name: "Qualidade e Controle",
    icon: CheckCircle2,
    tint: "green",
    promptCount: 10,
    description: "Crie critérios claros para validar o que foi entregue.",
  },
  {
    id: "people",
    name: "Equipes, Liderança e Soft Skills",
    icon: Users2,
    tint: "sky",
    promptCount: 10,
    description: "Destrave colaboração, alinhamento e conversas difíceis.",
  },
  {
    id: "procurement",
    name: "Aquisições e Contratações",
    icon: BriefcaseBusiness,
    tint: "teal",
    promptCount: 10,
    description: "Compare propostas e organize decisões de contratação.",
  },
  {
    id: "monitoring",
    name: "Monitoramento, Métricas e Encerramento",
    icon: Archive,
    tint: "indigo",
    promptCount: 10,
    description: "Encerre ciclos com dados, aprendizados e próximos passos.",
  },
];

const promptLibrary: Prompt[] = [
  { categoryId: "strategy", title: "Análise de Viabilidade do Projeto", description: "Avalie premissas, benefícios, restrições e condições para avançar." },
  { categoryId: "strategy", title: "Definição de Objetivos SMART", description: "Converta uma intenção de negócio em objetivos mensuráveis e claros." },
  { categoryId: "strategy", title: "Análise de Stakeholders", description: "Mapeie influência, interesse, riscos de relacionamento e abordagem." },
  { categoryId: "strategy", title: "Análise SWOT do Projeto", description: "Estruture forças, fraquezas, oportunidades e ameaças do contexto." },
  { categoryId: "strategy", title: "Justificativa de Negócio", description: "Organize uma argumentação objetiva para o investimento no projeto." },
  { categoryId: "strategy", title: "Mapa de Contexto do Projeto", description: "Conecte problema, pessoas, sistemas, decisões e resultados esperados." },
  { categoryId: "strategy", title: "Análise de Alternativas", description: "Compare caminhos possíveis com critérios, impactos e trade-offs." },
  { categoryId: "strategy", title: "Carta de Projeto (Project Charter)", description: "Gere uma primeira versão do documento que autoriza o projeto." },
  { categoryId: "strategy", title: "Análise de Capacidade Organizacional", description: "Identifique prontidão, lacunas e dependências da organização." },
  { categoryId: "strategy", title: "Roadmap Estratégico", description: "Conecte marcos de evolução às prioridades estratégicas do negócio." },
];

const documentTemplates: DocumentTemplate[] = [
  { category: "Planejamento", eyebrow: "PLANEJAMENTO", title: "Kickoff", description: "Inicie o projeto com uma reunião estruturada.", icon: Play, tone: "blue" },
  { category: "Planejamento", eyebrow: "PLANEJAMENTO", title: "PDD", description: "Documento de Design do Projeto com arquitetura e objetivos.", icon: BookOpen, tone: "blue" },
  { category: "Planejamento", eyebrow: "PLANEJAMENTO", title: "Cronograma", description: "Organize fases, datas, responsáveis e marcos.", icon: Clock3, tone: "blue" },
  { category: "Execução", eyebrow: "EXECUÇÃO", title: "Ata de Reunião", description: "Registre discussões, decisões e próximos passos.", icon: PenLine, tone: "violet" },
  { category: "Execução", eyebrow: "EXECUÇÃO", title: "Termo de Homologação", description: "Valide e aprove os critérios de aceite do projeto.", icon: ClipboardCheck, tone: "violet" },
  { category: "Execução", eyebrow: "EXECUÇÃO", title: "Status Report", description: "Acompanhe o progresso e comunique riscos.", icon: Gauge, tone: "violet" },
  { category: "Execução", eyebrow: "EXECUÇÃO", title: "Comunicado de Implantação", description: "Notifique stakeholders sobre a entrada em produção.", icon: Send, tone: "violet" },
  { category: "Execução", eyebrow: "EXECUÇÃO", title: "Change Request", description: "Solicite e registre mudanças de escopo, prazo ou custo.", icon: FilePlus2, tone: "violet" },
  { category: "Encerramento", eyebrow: "ENCERRAMENTO", title: "Termo de Encerramento", description: "Formalize a entrega e as lições aprendidas.", icon: FileCheck2, tone: "green" },
  { category: "Encerramento", eyebrow: "ENCERRAMENTO", title: "Reunião de KT", description: "Transfira conhecimento para sustentação e operação.", icon: Users2, tone: "green" },
];

const officialLinks = [
  { title: "Solicitar Estimativa", description: "Estimativa de esforço e prazo pelo time de Delivery.", label: "ABRIR FORMULÁRIO" },
  { title: "Solicitar Dashboard", description: "Criação dos painéis de horas e alocação no Jira.", label: "ABRIR FORMULÁRIO" },
  { title: "Cadastrar PEP", description: "Vinculação do código de faturamento ao projeto.", label: "ABRIR FORMULÁRIO" },
  { title: "Solicitar Acesso", description: "Formulário para acessos necessários ao projeto.", label: "ABRIR FORMULÁRIO" },
];

const recentDocs = [
  { title: "Status Report · Sprint 08", type: "Execução", updated: "Atualizado há 18 min", progress: "Em revisão" },
  { title: "PDD · Onboarding Adquirência", type: "Planejamento", updated: "Atualizado ontem", progress: "Aprovado" },
  { title: "Ata de Reunião · Comitê semanal", type: "Execução", updated: "Atualizado em 22 ago", progress: "Rascunho" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function AppHeader({ page, onNavigate, onNew }: { page: PageState; onNavigate: (view: View) => void; onNew: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="brand-lockup" aria-label="AuditFlow, Governança de Projetos">
        <img className="brand-mark" src="/manus-storage/auditflow-mark_d493376e.png" alt="" />
        <div>
          <div className="brand-name">AuditFlow</div>
          <div className="brand-subtitle">GOVERNANÇA DE PROJETOS</div>
        </div>
      </div>
      <button className="mobile-menu-button" aria-label="Abrir menu" onClick={() => setMobileOpen((open) => !open)}>
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className={cx("main-nav", mobileOpen && "main-nav-open")} aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = page.view === item.id || (item.id === "prompts" && page.view === "prompt-category");
          return (
            <button
              key={item.id}
              className={cx("nav-item", active && "nav-item-active")}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={14} strokeWidth={active ? 2.4 : 1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="header-actions">
        <div className="team-context">
          <div className="avatar avatar-small">E</div>
          <div>
            <strong>Equipe de Projetos</strong>
            <span>Ambiente MVP</span>
          </div>
          <MoreHorizontal size={16} className="muted-icon" />
        </div>
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, onNew }: { eyebrow: string; title: string; onNew: () => void }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      <div className="heading-actions">
        <span className="live-status"><span className="live-dot" /> Dados atualizados</span>
        <button className="primary-button" onClick={onNew}><Plus size={15} /> Nova solicitação</button>
      </div>
    </div>
  );
}

function HeroPanel({ eyebrow, title, description, stat, statLabel, image, tone = "default" }: { eyebrow: string; title: string; description: string; stat: string; statLabel: string; image?: string; tone?: "default" | "lavender" }) {
  return (
    <section className={cx("hero-panel", tone === "lavender" && "hero-panel-lavender")}>
      <div className="hero-copy">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {image ? <img className="hero-image" src={image} alt="" /> : null}
      <div className="hero-stat">
        <strong>{stat}</strong>
        <span>{statLabel}</span>
      </div>
    </section>
  );
}

function Overview({ onNavigate, onNew }: { onNavigate: (view: View) => void; onNew: () => void }) {
  return (
    <>
      <PageHeading eyebrow="CENTRAL DE AUDITORIA" title="Visão geral" onNew={onNew} />
      <section className="overview-hero">
        <div className="overview-hero-copy">
          <div className="eyebrow">VISÃO DA OPERAÇÃO</div>
          <h2>Documentos claros.<br />Processos que avançam.</h2>
          <p>Uma única central para criar, organizar e acelerar a governança dos seus projetos.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate("documents")}>Explorar documentos <ArrowRight size={15} /></button>
            <button className="text-button" onClick={() => onNavigate("prompts")}>Ver biblioteca de prompts <ChevronRight size={15} /></button>
          </div>
        </div>
        <img src="/manus-storage/auditflow-hero-abstract_989dde7a.png" alt="" className="overview-illustration" />
      </section>

      <div className="metric-grid">
        <MetricCard icon={FileText} tone="blue" value="10" label="Modelos disponíveis" helper="Documentos prontos para adaptar" />
        <MetricCard icon={Sparkles} tone="violet" value="100" label="Prompts profissionais" helper="Comandos organizados por etapa" />
        <MetricCard icon={CheckCircle2} tone="green" value="04" label="Atalhos oficiais" helper="Solicitações no Jira" />
        <MetricCard icon={BrainCircuit} tone="amber" value="01" label="Copiloto IA" helper="Contexto que vira próximo passo" />
      </div>

      <div className="content-grid overview-grid">
        <section className="surface-card recent-card">
          <CardTitle eyebrow="ATIVIDADE RECENTE" title="Documentos para continuar" action={<button className="link-button" onClick={() => onNavigate("documents")}>Ver todos <ArrowRight size={13} /></button>} />
          <div className="recent-list">
            {recentDocs.map((doc, index) => (
              <button className="recent-row" key={doc.title} onClick={() => toast.info(`Abrindo ${doc.title}`)}>
                <div className={cx("file-icon", index === 1 ? "green-soft" : "blue-soft")}><FileText size={16} /></div>
                <div className="recent-main"><strong>{doc.title}</strong><span>{doc.type} · {doc.updated}</span></div>
                <span className={cx("status-pill", doc.progress === "Aprovado" ? "status-green" : doc.progress === "Em revisão" ? "status-blue" : "status-neutral")}>{doc.progress}</span>
                <ChevronRight size={16} className="muted-icon" />
              </button>
            ))}
          </div>
        </section>
        <section className="ai-feature-card">
          <div className="ai-feature-topline"><span className="ai-badge"><Sparkles size={13} /> IA COPILOTO</span><span className="ai-available"><span className="live-dot" /> disponível</span></div>
          <div className="ai-feature-body">
            <div>
              <h3>Do contexto ao documento.</h3>
              <p>Escolha um prompt, conte o que está acontecendo e receba uma primeira versão estruturada para revisar.</p>
              <button className="secondary-button" onClick={() => onNavigate("prompts")}>Abrir assistente <ArrowRight size={14} /></button>
            </div>
            <img src="/manus-storage/auditflow-ai_9036a9ef.png" alt="" className="ai-feature-image" />
          </div>
        </section>
      </div>

      <section className="surface-card workflow-card">
        <CardTitle eyebrow="FLUXO RECOMENDADO" title="Uma sequência simples para cada etapa" action={<span className="muted-note">Atualizado hoje</span>} />
        <div className="workflow-steps">
          {[
            { number: "01", title: "Escolha o modelo", body: "Comece com uma estrutura que já funciona.", icon: FileText },
            { number: "02", title: "Dê contexto à IA", body: "Use prompts para organizar o raciocínio.", icon: Sparkles },
            { number: "03", title: "Revise e compartilhe", body: "A decisão final continua sendo sua.", icon: CheckCircle2 },
          ].map((step) => {
            const Icon = step.icon;
            return <div className="workflow-step" key={step.number}><span className="workflow-number">{step.number}</span><div className="workflow-icon"><Icon size={18} /></div><div><strong>{step.title}</strong><p>{step.body}</p></div></div>;
          })}
        </div>
      </section>
    </>
  );
}

function MetricCard({ icon: Icon, tone, value, label, helper }: { icon: LucideIcon; tone: string; value: string; label: string; helper: string }) {
  return <div className="metric-card"><div className={cx("metric-icon", `metric-${tone}`)}><Icon size={17} /></div><div><strong>{value}</strong><span>{label}</span><small>{helper}</small></div></div>;
}

function CardTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="card-title"><div><div className="eyebrow">{eyebrow}</div><h3>{title}</h3></div>{action}</div>;
}

function DocumentsPage({ onNew, onSelectTemplate }: { onNew: () => void; onSelectTemplate: (template: DocumentTemplate) => void }) {
  return (
    <>
      <PageHeading eyebrow="CENTRAL DE AUDITORIA" title="Documentos e processos" onNew={onNew} />
      <HeroPanel eyebrow="CENTRAL OPERACIONAL" title="Documentos e processos do projeto" description="Gere comunicações padronizadas e acesse as solicitações oficiais sem sair da governança." stat="10" statLabel="MODELOS DISPONÍVEIS" image="/manus-storage/auditflow-documents_295b1bd5.png" tone="lavender" />
      <section className="section-block official-block">
        <div className="section-heading"><div><div className="eyebrow">ACESSOS OFICIAIS</div><h2>Links rápidos do Jira</h2></div><span className="section-note">Solicitações externas</span></div>
        <div className="official-grid">
          {officialLinks.map((link) => <button className="official-card" key={link.title} onClick={() => toast.info(`${link.title}: link oficial disponível no ambiente conectado.`)}><div className="official-arrow"><ArrowRight size={15} /></div><strong>{link.title}</strong><p>{link.description}</p><span>{link.label}</span></button>)}
        </div>
      </section>
      <section className="section-block templates-block">
        <div className="section-heading"><div><div className="eyebrow">BIBLIOTECA DE MODELOS</div><h2>Escolha um ponto de partida</h2></div><div className="filter-summary"><span className="filter-dot blue-dot" /> 3 etapas <ChevronRight size={14} /></div></div>
        {(["Planejamento", "Execução", "Encerramento"] as const).map((category) => <TemplateGroup key={category} category={category} onSelectTemplate={onSelectTemplate} />)}
      </section>
    </>
  );
}

function TemplateGroup({ category, onSelectTemplate }: { category: DocumentTemplate["category"]; onSelectTemplate: (template: DocumentTemplate) => void }) {
  const templates = documentTemplates.filter((template) => template.category === category);
  const Icon = category === "Planejamento" ? ClipboardList : category === "Execução" ? Settings2 : CheckCircle2;
  return <div className="template-group"><div className="template-group-heading"><div className={cx("group-icon", category === "Planejamento" ? "group-blue" : category === "Execução" ? "group-violet" : "group-green")}><Icon size={17} /></div><div><h3>{category}</h3><p>{category === "Planejamento" ? "Prepare o projeto para uma execução controlada." : category === "Execução" ? "Registre decisões, mudanças e evolução." : "Formalize a entrega e transfira o conhecimento."}</p></div></div><div className="template-grid">{templates.map((template) => <TemplateCard key={template.title} template={template} onSelect={() => onSelectTemplate(template)} />)}</div></div>;
}

function TemplateCard({ template, onSelect }: { template: DocumentTemplate; onSelect: () => void }) {
  const Icon = template.icon;
  return <article className="template-card"><div className={cx("template-icon", `template-${template.tone}`)}><Icon size={17} /></div><div className="eyebrow">{template.eyebrow}</div><h3>{template.title}</h3><p>{template.description}</p><div className="template-footer"><span>Pode ser vinculado a um projeto</span><button className="outline-button" onClick={onSelect}>Usar modelo <ArrowRight size={13} /></button></div></article>;
}

function PromptsPage({ onOpenCategory, onNew }: { onOpenCategory: (id: string) => void; onNew: () => void }) {
  return (
    <>
      <PageHeading eyebrow="CENTRAL DE AUDITORIA" title="Prompts" onNew={onNew} />
      <HeroPanel eyebrow="ASSISTENTE DE GESTÃO" title="Prompts profissionais para projetos" description="Escolha uma categoria, preencha o contexto e copie o comando pronto para usar em uma IA." stat="100" statLabel="PROMPTS DISPONÍVEIS" tone="lavender" />
      <section className="section-block prompt-library-block"><div className="section-heading"><div><div className="eyebrow">BIBLIOTECA DE PROMPTS</div><h2>Escolha uma frente de trabalho</h2></div><span className="section-note">10 categorias · 100 prompts</span></div><div className="category-grid">{promptCategories.map((category) => <CategoryCard key={category.id} category={category} onClick={() => onOpenCategory(category.id)} />)}</div></section>
      <section className="ai-callout"><div className="ai-callout-icon"><Sparkles size={22} /></div><div><div className="eyebrow">COPILOTO IA</div><h2>Você traz o contexto. A IA organiza o caminho.</h2><p>Os prompts são estruturas de trabalho — não respostas prontas. Personalize, revise e decida com mais clareza.</p></div><button className="primary-button" onClick={() => onOpenCategory("strategy")}>Testar com estratégia <ArrowRight size={14} /></button></section>
    </>
  );
}

function CategoryCard({ category, onClick }: { category: PromptCategory; onClick: () => void }) {
  const Icon = category.icon;
  return <button className="category-card" onClick={onClick}><div className={cx("category-icon", `category-${category.tint}`)}><Icon size={19} /></div><div className="category-copy"><strong>{category.name}</strong><span>{category.promptCount} prompts disponíveis</span><p>{category.description}</p></div><span className="category-cta">EXPLORAR <ArrowRight size={13} /></span></button>;
}

function PromptCategoryPage({ categoryId, onBack, onSelectPrompt }: { categoryId: string; onBack: () => void; onSelectPrompt: (prompt: Prompt) => void }) {
  const category = promptCategories.find((item) => item.id === categoryId) ?? promptCategories[0];
  const [query, setQuery] = useState("");
  const prompts = useMemo(() => {
    const categoryPrompts = promptLibrary.filter((prompt) => prompt.categoryId === category.id);
    const source = categoryPrompts.length > 0 ? categoryPrompts : Array.from({ length: 10 }, (_, index) => ({
      categoryId: category.id,
      title: `${category.name} · Guia ${String(index + 1).padStart(2, "0")}`,
      description: `Estruture uma análise prática para ${category.name.toLowerCase()} com o contexto do projeto.`,
    }));
    return source.filter((prompt) => `${prompt.title} ${prompt.description}`.toLowerCase().includes(query.toLowerCase()));
  }, [category.id, category.name, query]);
  const Icon = category.icon;
  return <>
    <PageHeading eyebrow="CENTRAL DE AUDITORIA" title="Prompts" onNew={() => toast.info("Use um prompt da biblioteca para iniciar uma nova solicitação.")} />
    <button className="back-button" onClick={onBack}><ArrowLeft size={15} /> Todas as categorias</button>
    <div className="detail-heading"><div className={cx("category-icon detail-icon", `category-${category.tint}`)}><Icon size={22} /></div><div><div className="eyebrow">BIBLIOTECA DE PROMPTS</div><h2>{category.name}</h2><p>Escolha um prompt e personalize com o contexto do seu projeto.</p></div></div>
    <div className="prompt-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar prompt..." aria-label="Buscar prompt" />{query ? <button aria-label="Limpar busca" onClick={() => setQuery("")}><X size={15} /></button> : null}</div>
    <section className="prompt-list">{prompts.map((prompt, index) => <article className="prompt-row" key={prompt.title}><div className="prompt-row-icon"><Icon size={16} /></div><div className="prompt-row-copy"><strong>{prompt.title}</strong><p>{prompt.description}</p></div><span className="prompt-index">{String(index + 1).padStart(2, "0")}</span><button className="outline-button" onClick={() => onSelectPrompt(prompt)}>Usar prompt <ArrowRight size={13} /></button></article>)}{prompts.length === 0 ? <div className="empty-state"><Search size={22} /><strong>Nenhum prompt encontrado</strong><p>Tente outra palavra ou limpe o filtro.</p></div> : null}</section>
  </>;
}

function NewRequestModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal-card small-modal" role="dialog" aria-modal="true" aria-labelledby="new-request-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><div className="eyebrow">NOVA SOLICITAÇÃO</div><h2 id="new-request-title">O que você precisa organizar?</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><p className="modal-intro">Descreva em uma frase o documento, processo ou decisão que precisa avançar.</p><textarea autoFocus value={text} onChange={(event) => setText(event.target.value)} placeholder="Ex.: preciso preparar o status report da semana para o comitê..." /><div className="modal-footer"><button className="text-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={() => { toast.success("Solicitação criada. Escolha um prompt para continuar."); onClose(); }}>Continuar <ArrowRight size={14} /></button></div></div></div>;
}

function DocumentAssistant({ template, onClose }: { template: DocumentTemplate; onClose: () => void }) {
  const [context, setContext] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = `# ${template.title}\n\n## Projeto\n[Nome do projeto]\n\n## Objetivo\nDescreva o objetivo principal com base no contexto informado.\n\n## Contexto e decisões\n- Situação atual: organize o que está acontecendo.\n- Decisões: registre os alinhamentos necessários.\n- Dependências: indique pessoas, sistemas e prazos envolvidos.\n\n## Próximos passos\n| Ação | Responsável | Prazo |\n| --- | --- | --- |\n| Validar a primeira versão | A definir | A definir |\n\n> Revise o documento antes de compartilhar com os stakeholders.`;
  const handleCopy = async () => { try { await navigator.clipboard.writeText(generated ? result : `Estruture um ${template.title} profissional. Contexto: ${context}`); } catch { /* clipboard may be unavailable in preview */ } setCopied(true); toast.success("Conteúdo copiado para a área de transferência."); setTimeout(() => setCopied(false), 1800); };
  const Icon = template.icon;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal-card assistant-modal" role="dialog" aria-modal="true" aria-labelledby="document-assistant-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><div className="eyebrow">GERADOR DE DOCUMENTOS</div><h2 id="document-assistant-title"><Icon size={19} /> {template.title}</h2><p className="modal-header-note">Use um contexto real para criar uma primeira estrutura revisável.</p></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="assistant-layout"><div className="assistant-input-column"><label htmlFor="document-context">Contexto do projeto</label><textarea id="document-context" value={context} onChange={(event) => { setContext(event.target.value); setGenerated(false); }} placeholder="Cole notas, decisões, participantes, datas ou qualquer informação relevante..." /><div className="context-hint"><Lightbulb size={14} /><span>O gerador preserva o contexto e organiza a forma do documento.</span></div><button className="primary-button generate-button" onClick={() => { setGenerated(true); toast.success("Documento estruturado."); }}><Sparkles size={15} /> Gerar documento</button></div><div className={cx("assistant-output", generated && "assistant-output-ready")}><div className="output-header"><div><span className="eyebrow">PRÉVIA EDITÁVEL</span><strong>{generated ? "Primeira versão pronta" : "Aguardando contexto"}</strong></div><FileCheck2 size={20} /></div>{generated ? <><pre>{result}</pre><button className="copy-button" onClick={handleCopy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar documento"}</button></> : <div className="output-empty"><div className="output-empty-icon"><FileText size={21} /></div><p>Adicione contexto para criar uma versão inicial de {template.title.toLowerCase()}.</p><span>Você revisa o conteúdo antes de usar.</span></div>}</div></div><div className="assistant-footer"><span><span className="live-dot" /> modelo pronto para personalizar</span><button className="text-button" onClick={handleCopy}><Copy size={14} /> Copiar estrutura base</button></div></div></div>;
}

function PromptAssistant({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const [context, setContext] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = `## ${prompt.title}\n\n### Leitura do contexto\nA partir das informações fornecidas, o foco principal deve ser transformar o cenário em uma decisão objetiva, com premissas visíveis e próximos passos verificáveis.\n\n### Estrutura recomendada\n1. **Contexto atual:** registre o que aconteceu, quem está envolvido e qual resultado é esperado.\n2. **Pontos de atenção:** destaque restrições, dependências e riscos que podem alterar a decisão.\n3. **Próximos passos:** defina uma ação, um responsável e um prazo para cada frente.\n\n### Pergunta para validação\nQual é a menor decisão que precisa ser tomada agora para manter o projeto avançando?`;
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generated ? result : `Atue como especialista em gestão de projetos. ${prompt.title}. Contexto: ${context}`); } catch { /* clipboard may be unavailable in preview */ }
    setCopied(true); toast.success("Prompt copiado para a área de transferência."); setTimeout(() => setCopied(false), 1800);
  };
  return <div className="modal-backdrop assistant-backdrop" role="presentation" onMouseDown={onClose}><div className="modal-card assistant-modal" role="dialog" aria-modal="true" aria-labelledby="assistant-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><div className="ai-badge"><Sparkles size={13} /> COPILOTO IA</div><h2 id="assistant-title">{prompt.title}</h2><p className="modal-header-note">Personalize o contexto. A estrutura vem depois.</p></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="assistant-layout"><div className="assistant-input-column"><label htmlFor="prompt-context">Contexto do projeto</label><textarea id="prompt-context" value={context} onChange={(event) => { setContext(event.target.value); setGenerated(false); }} placeholder="Conte o que está acontecendo, quais são as restrições e o que você precisa decidir..." /><div className="context-hint"><Lightbulb size={14} /><span>Quanto mais específico o contexto, mais útil será a primeira versão.</span></div><button className="primary-button generate-button" onClick={() => { setGenerated(true); toast.success("Estrutura gerada pela IA."); }}><Sparkles size={15} /> Gerar com IA</button></div><div className={cx("assistant-output", generated && "assistant-output-ready")}><div className="output-header"><div><span className="eyebrow">RESPOSTA ESTRUTURADA</span><strong>{generated ? "Primeira versão pronta" : "Aguardando contexto"}</strong></div><Bot size={20} /></div>{generated ? <><pre>{result}</pre><button className="copy-button" onClick={handleCopy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar resposta"}</button></> : <div className="output-empty"><div className="output-empty-icon"><BrainCircuit size={21} /></div><p>A sua resposta aparecerá aqui depois que você adicionar um contexto e iniciar a geração.</p><span>Sem respostas automáticas: você revisa cada decisão.</span></div>}</div></div><div className="assistant-footer"><span><span className="live-dot" /> IA pronta para apoiar</span><button className="text-button" onClick={handleCopy}><Copy size={14} /> Copiar prompt base</button></div></div></div>;
}

export default function Home() {
  const [page, setPage] = useState<PageState>({ view: "overview" });
  const [modal, setModal] = useState<"new" | "assistant" | "document" | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const navigate = (view: View) => setPage({ view });
  const openPrompt = (prompt: Prompt) => { setSelectedPrompt(prompt); setModal("assistant"); };
  return <div className="app-shell"><AppHeader page={page} onNavigate={navigate} onNew={() => setModal("new")} /><main className="app-main">{page.view === "overview" ? <Overview onNavigate={navigate} onNew={() => setModal("new")} /> : null}{page.view === "documents" ? <DocumentsPage onNew={() => setModal("new")} onSelectTemplate={(template) => { setSelectedTemplate(template); setModal("document"); }} /> : null}{page.view === "prompts" ? <PromptsPage onOpenCategory={(id) => setPage({ view: "prompt-category", categoryId: id })} onNew={() => setModal("new")} /> : null}{page.view === "prompt-category" ? <PromptCategoryPage categoryId={page.categoryId ?? "strategy"} onBack={() => navigate("prompts")} onSelectPrompt={openPrompt} /> : null}</main>{modal === "new" ? <NewRequestModal onClose={() => setModal(null)} /> : null}{modal === "assistant" && selectedPrompt ? <PromptAssistant prompt={selectedPrompt} onClose={() => setModal(null)} /> : null}{modal === "document" && selectedTemplate ? <DocumentAssistant template={selectedTemplate} onClose={() => setModal(null)} /> : null}</div>;
}
