# Max Imóveis · DISC e Recrutamento

Site da Max Imóveis com questionário DISC de 40 perguntas, formulário de candidatura, conferência dos dados e relatório enviado ao RH. O fluxo de recrutamento inclui nome, e-mail, telefone, cidade/estado, nascimento opcional, vaga, unidade e pretensão salarial ou “A combinar”.

## Hospedagem

Esta versão usa Next.js para publicação na Vercel. O banco e o envio de e-mails continuam no Supabase existente. Não contém chaves privadas ou registros de participantes.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Node.js 22.x. O gerenciador e as versões estão fixados em `package.json` e `pnpm-lock.yaml`.

## Configuração de servidor

Cadastre `DISC_BACKEND_URL` e `DISC_BACKEND_TOKEN` nas variáveis de ambiente da Vercel para Production e Preview. A URL está em `.env.example`; o token deve ser inserido somente no painel seguro. Não usar prefixo `NEXT_PUBLIC_` para essas variáveis. Nunca colocar chaves no GitHub.

Os segredos `RESEND_API_KEY` e `DISC_EMAIL_FROM` já são mantidos na Edge Function do Supabase. O destinatário do relatório é `rhimoveis4@gmail.com`.

## Verificação

- `pnpm typecheck` verifica os tipos.
- `pnpm build` verifica a compilação e as rotas.
- `GET /api/disc/status` informa se a integração e a configuração de e-mail estão disponíveis.
- As respostas são validadas e pontuadas no servidor. Há limitação de tentativas e controle de idempotência.
- Resultados e dados de candidatos ficam em tabelas privadas com RLS, sem leitura para visitantes.
- O e-mail é enviado somente ao concluir o fluxo. Um rascunho temporário permanece na aba durante o preenchimento.

## Supabase

Os arquivos em `supabase/` documentam a configuração existente, sem credenciais. Não reaplique o esquema em outro projeto sem revisar. A Edge Function `max-disc` usa `supabase/function.ts` como `index.ts`, `lib/disc.ts` como `disc.ts` e `lib/disc-report.ts` como `disc-report.ts`.

O instrumento é original e descritivo, inspirado no DISC, sem validação psicométrica. Não constitui diagnóstico ou avaliação psicológica e não deve ser usado como critério isolado em decisões de trabalho. O cadastro não influencia a pontuação nem gera classificação automática de candidatos.
