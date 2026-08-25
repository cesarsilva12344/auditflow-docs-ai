# Direção visual — AuditFlow Documentos, Processos e IA

## Referência de base

O site de referência é o MVP AuditFlow de auditoria de projetos. Esta implementação deve tratar a referência como especificação visual principal: aplicação interna com navegação persistente no topo, fundo lavanda muito claro, tipografia azul-marinho, cartões brancos com bordas suaves, azul royal como cor de ação, verde para estados positivos, âmbar para atenção e lilás para itens em andamento. A composição usa uma faixa superior compacta, cabeçalho de contexto, títulos grandes alinhados à esquerda, hero operacional com borda azul vertical, métricas em cartões, listas densas e cartões modulares.

O escopo desta réplica é reduzido aos módulos: **Documentos e processos**, **AI Prompts** e uma **Assistente IA** integrada ao fluxo. Não serão incluídos projetos, auditorias, relatórios, compliance, ciclo de vida ou configurações como módulos funcionais principais.

## Abordagem escolhida: réplica fiel com camada operacional de IA

A direção escolhida é uma reprodução fiel do sistema visual do AuditFlow, com uma camada de refinamento editorial para tornar documentos, processos e prompts mais claros e acionáveis. A interface deve parecer uma central operacional real, não uma landing page genérica.

### Design Movement

**Neo-editorial SaaS operacional**: mistura de dashboard corporativo leve, editorial de operações e biblioteca de conhecimento. A referência mantém um visual limpo, luminoso e governado; esta versão preserva essa linguagem e reforça a sensação de estação de trabalho.

### Core Principles

1. **Hierarquia de operação**: cada tela começa por contexto, título e ação primária inequívoca.
2. **Densidade legível**: listas e cartões compactos, com espaços generosos entre grupos e microcopy funcional.
3. **Confiança visual**: branco, azul-marinho e azul royal estruturam a interface; cores de estado têm função semântica.
4. **IA no fluxo**: a inteligência artificial aparece como copiloto contextual, pronta para transformar contexto em documento, processo ou próximo passo.

### Color Philosophy

O fundo lavanda quase branco reduz a sensação de frieza de um software de governança e diferencia a superfície da área de trabalho. O azul royal comunica precisão e ação, o azul-marinho ancora a leitura, o verde valida concluído, o âmbar destaca pendências e o lilás sinaliza processamento assistido por IA. A assinatura da marca é **Azul AuditFlow #1554D1**.

### Layout Paradigm

Shell de aplicação com header superior fixo e conteúdo com largura controlada, alinhado à esquerda. A primeira faixa combina título e ações; depois entram hero operacional, atalhos, cartões de biblioteca e uma coluna de copiloto IA. Em vez de uma grade perfeitamente simétrica, os blocos devem alternar entre faixas horizontais, listas com respiro e painéis assimétricos.

### Signature Elements

- Barra vertical azul à esquerda dos hero cards operacionais.
- Pílulas de estado discretas e ícones em quadrados azuis muito claros.
- Painel do Copiloto IA com brilho lilás suave, prompt sugerido e área de resposta pronta para copiar.

### Interaction Philosophy

A interação deve parecer uma sequência de decisões rápidas. Cards levantam levemente no hover, botões confirmam o clique com escala mínima e ações de copiar mostram feedback imediato. A navegação mantém o usuário sempre dentro do contexto; ações ainda não persistentes funcionam localmente e exibem toasts explicativos.

### Animation

Entradas discretas e escalonadas por grupo, sempre abaixo de 300 ms. Hover usa transformação e sombra, sem alterar layout. O painel IA abre com opacidade e leve deslocamento vertical; estados de sucesso aparecem rapidamente. Respeitar `prefers-reduced-motion`.

### Typography System

Usar **Manrope** para títulos e labels de interface, com pesos 500–800; usar **DM Sans** para corpo e microcopy, com pesos 400–600. H1 grande e compacto, H2 com contraste forte, labels em caixa alta com tracking amplo e textos auxiliares curtos. Evitar Inter.

### Brand Essence

**A central de trabalho para transformar governança de projetos em documentos claros, processos repetíveis e decisões assistidas por IA.**

Personalidade: **precisa, prestável, segura**.

### Brand Voice

Headlines são diretas e orientadas à ação. CTAs descrevem o resultado, não o mecanismo. Microcopy é breve, tranquila e útil.

Exemplos:

- “Tire o processo da cabeça. Coloque-o em fluxo.”
- “Descreva o contexto. A IA organiza o próximo documento.”

### Wordmark & Logo

Marca composta por um símbolo circular azul royal com um “n” branco minúsculo e um wordmark AuditFlow em Manrope semibold, acompanhado da assinatura “GOVERNANÇA DE PROJETOS”. O símbolo funciona como avatar e favicon; o wordmark tem presença discreta no header.

### Signature Brand Color

**Azul AuditFlow — `#1554D1`**.

## Escopo de implementação

A réplica incluirá uma tela inicial operacional com indicadores focados em documentos e prompts; uma biblioteca de documentos e processos com links oficiais, categorias e ações de usar modelo; uma biblioteca de prompts por categorias; detalhe de categoria com pesquisa e ações de usar prompt; e um copiloto IA simulado localmente para gerar uma resposta contextual a partir de um prompt selecionado. A navegação superior terá somente os módulos pedidos e um item “Visão geral” para manter a orientação.

## Validação da réplica no preview

A visão geral e o módulo Documentos e processos abriram corretamente no preview. A réplica preserva o header horizontal, o título de contexto, a faixa operacional com borda azul, o hero com imagem à direita, as métricas, os links oficiais e os grupos de modelos. A escala desktop mantém o conteúdo arejado e a tipografia tem contraste suficiente sobre o fundo lavanda. O preview acrescenta a barra de modo de visualização do ambiente, que não faz parte da aplicação entregue.

A biblioteca de AI Prompts foi validada com 10 categorias, contadores de disponibilidade e CTA Explorar. A categoria Estratégia e Iniciação abre uma lista densa com pesquisa, índice sequencial e CTA Usar prompt, mantendo o padrão de espaçamento da referência. A navegação é contextual e oferece retorno explícito para Todas as categorias.

O fluxo do copiloto IA foi testado com contexto de projeto em português. O modal aceitou a entrada, gerou uma primeira versão estruturada localmente, atualizou o estado para “Primeira versão pronta” e exibiu a ação “Copiar resposta”, além do toast de confirmação. A experiência cobre o pedido de IA sem depender de backend ou credenciais externas.

A integração inspirada em `project-prompts` e `c-pia-de-prompt-pro-generator` foi validada no preview: o CTA Usar modelo abre um gerador contextual específico para cada documento, com área de entrada, prévia editável, geração local e cópia da estrutura. A navegação mantém o visual do AuditFlow e amplia a utilidade da biblioteca de documentos.
