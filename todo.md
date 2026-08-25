# Redirecionamento AuditFlow — prompts e atas

- [x] Confirmar o modelo de dados para prompts, projetos, atas e execuções de IA.
- [x] Ler as orientações do projeto full-stack e preparar a migração.
- [x] Adicionar backend, base de dados e autenticação/escopo do utilizador; upload persistente em storage fica para etapa posterior.
- [x] Criar o prompt de sistema “Analista de Projetos” com foco em atas.
- [x] Implementar formulário de campos: projeto, cliente, nome, data, responsável, objetivo e orientação adicional.
- [x] Implementar modo manual com prévia gerada pelos campos; editor livre do conteúdo fica para etapa posterior.
- [x] Implementar modo IA com transcrição colada ou ficheiro TXT/MD; parser DOCX/PDF fica como próxima etapa.
- [x] Persistir projetos, prompts, atas e versões geradas.
- [x] Testar check/build, geração Qwen, cópia, estados de erro e bloqueio de permissões; auditoria de acessibilidade dedicada fica para etapa posterior.
- [x] Criar checkpoint e entregar a nova versão.

- [x] Diferenciar claramente o fluxo de otimização do prompt: contexto bruto → prompt melhorado → execução da IA → ata revisável.
- [x] Apresentar ao utilizador o prompt otimizado antes da geração final da ata.

- [x] Adicionar configuração privada do provedor Qwen no backend.
- [x] Criar acesso administrativo inicial admin/123 com troca obrigatória da senha.
- [x] Armazenar a configuração Qwen cifrada e nunca devolvê-la ao frontend.
- [x] Criar opção administrativa oculta para alterar o provedor/modelo e a chave.
- [x] Integrar as atas ao Qwen exclusivamente no servidor.
- [x] Testar autenticação, cifragem, ocultação da configuração e geração.

- [x] Criar permissão explícita `canUseAi` para utilizadores autorizados.
- [x] Exibir estado de sessão ativa e ação de terminar sessão.
- [x] Fazer as rotas de otimização e geração rejeitarem utilizadores sem permissão.
- [x] Mostrar o modo manual para todos e bloquear o modo IA para quem não tiver permissão.

- [x] Remover o login OAuth do Manus da experiência principal.
- [x] Criar login próprio com utilizador e senha.
- [x] Criar sessão local HttpOnly com expiração e logout.
- [x] Manter permissões `canUseAi` e o administrador separados do login externo.
- [x] Validar que a aplicação funciona sem redirecionar para o Manus.
