# Análise dos repositórios GitHub para o AuditFlow

## Síntese executiva

Os três repositórios pertencem ao mesmo ecossistema de trabalho e compartilham uma base React/TypeScript orientada a prompts, geração de documentos e IA. O aproveitamento mais seguro e imediato foi incorporar **padrões de experiência e domínio**, não copiar a aplicação inteira: biblioteca categorizada de prompts, fluxo de “Usar prompt”, modelos de documentos com contexto e prévia, e a separação entre entrada do usuário e resposta estruturada.

A réplica atual continua frontend-only. Por isso, os fluxos integrados nesta etapa funcionam localmente no navegador e não simulam chamadas externas como se fossem IA real. Para transformar o copiloto em geração real, será necessária uma etapa posterior com backend, gestão de segredos, limites de uso e uma política de armazenamento.

## Comparação

| Repositório | O que encontrei | O que aproveitei | O que não copiei agora |
| --- | --- | --- | --- |
| [`prompt-library-ai`](https://github.com/cesarsilva12344/prompt-library-ai) | Plataforma TypeScript/React full-stack com biblioteca, categorias, Prompt Builder, PromptChains, Playground, histórico, routers tRPC, Drizzle e integração de LLM. O `package.json` declara MIT, mas o metadado oficial do GitHub não informa uma licença detectada. | A organização da biblioteca em categorias, o padrão de cards de prompt, pesquisa, índice de itens, ação de executar/copiar e a ideia de um copiloto separado da biblioteca. | Backend tRPC, banco, histórico persistente, PromptChains e Gemini, porque o projeto atual foi inicializado como web estático e não tem infraestrutura de servidor/segredos nesta etapa. |
| [`project-prompts`](https://github.com/cesarsilva12344/project-prompts) | Aplicação TypeScript com dados em `client/src/data/prompts.ts`, páginas de Prompts, Naming e componentes `DocumentGenerator`, `Sidebar` e links operacionais. O `package.json` declara MIT, mas o GitHub não exibe licença detectada. | Os nomes e etapas de documentos, o gerador com contexto, a ligação entre modelo e estrutura de documento e a ideia de links rápidos operacionais. | A estrutura original da aplicação e quaisquer integrações de IA que dependam de backend; a interface foi adaptada à casca visual do AuditFlow. |
| [`c-pia-de-prompt-pro-generator`](https://github.com/cesarsilva12344/c-pia-de-prompt-pro-generator) | Repositório privado, TypeScript full-stack, com `AIProcessor`, `ProcessPage`, `DocumentGenerator`, `DocumentCardWithUpload`, parser de PDF/DOCX (`pdf-parse` e `mammoth`), routers para IA e controle de quota. Não há licença detectada no metadado do GitHub. | O conceito de processamento de documento por tipo, prévia estruturada e separação entre parser, quota e roteador de IA como referência arquitetural para uma futura versão full-stack. | Parser de ficheiros, uploads, quota, Gemini/OpenRouter/DeepSeek e persistência, porque exigem backend e configuração de segredos. Não incluí essas dependências silenciosamente. |

## Integrações feitas na réplica

A biblioteca de prompts já existente foi reforçada para que todas as dez categorias tenham uma página de detalhe navegável. Cada categoria possui pesquisa, itens numerados, descrição curta e CTA **Usar prompt**. O copiloto abre em modal, recebe contexto em português, apresenta uma primeira resposta estruturada e permite copiar o resultado.

A melhoria principal baseada nos geradores de documentos foi aplicada à biblioteca **Documentos e processos**. Cada cartão agora abre um gerador contextual específico para o modelo selecionado, com campo para notas, decisões, participantes, datas e restrições; depois, apresenta uma prévia de documento com secções, próximos passos, tabela e indicação explícita de revisão humana. O CTA **Copiar documento** completa o fluxo de trabalho.

Também mantive no shell a navegação compacta do AuditFlow, os cartões de links rápidos do Jira, as três etapas de documentação — Planejamento, Execução e Encerramento — e o painel visual de IA. O símbolo gerado da marca é usado no header e no favicon.

## Decisão sobre IA real e documentos reais

A implementação atual deve ser entendida como **protótipo funcional de frontend**. A resposta exibida pelo copiloto é uma estrutura local de demonstração; ela não é apresentada como resultado de um modelo externo. Para aproveitar efetivamente os routers de IA e o parser dos repositórios, o próximo passo correto seria atualizar o projeto para uma arquitetura full-stack, definir o provedor de IA, configurar segredos, implementar limites de uso, escolher a política de retenção dos documentos e adicionar testes para parsing e falhas de provedor.

Como os repositórios não apresentam uma licença detectada no metadado oficial do GitHub — e um deles é privado — recomendo confirmar a autorização de reutilização antes de copiar código literal ou conteúdo proprietário. Nesta etapa, a réplica usa apenas conceitos de fluxo, nomes de domínio já fornecidos pelo usuário e uma implementação própria alinhada ao design de referência.

## Referências

[1]: https://github.com/cesarsilva12344/prompt-library-ai "prompt-library-ai — GitHub"
[2]: https://github.com/cesarsilva12344/project-prompts "project-prompts — GitHub"
[3]: https://github.com/cesarsilva12344/c-pia-de-prompt-pro-generator "c-pia-de-prompt-pro-generator — GitHub"
