# Plano de Implementação: Projeto Aqua Saúde

Este documento detalha a arquitetura e os passos para a criação do sistema Aqua Saúde, focado em monitoramento de consumo de água e gamificação.

## 1. Arquitetura do Sistema

### Backend (Node.js/Express)
- **Estrutura**: Padrão MVC.
- **ORM**: Sequelize com SQLite (para facilitar o desenvolvimento inicial) ou PostgreSQL.
- **Segurança**: JWT para autenticação.
- **Processamento**: Tesseract.js e pdf-parse para OCR de faturas Sabesp.
- **Upload**: Multer para gerenciamento de arquivos.

### Frontend (React)
- **Estilização**: Tailwind CSS.
- **Gráficos**: Recharts para visualização de consumo.
- **Estado**: Context API ou Hooks.
- **Componentes**: Estrutura baseada em componentes reutilizáveis.

## 2. Modelagem de Dados (Sequelize)

### User
- `id`, `nome`, `email`, `senha`, `xp` (default 0), `level` (default 1), `streak` (default 0).

### Consumo
- `id`, `userId`, `quantidade_m3`, `valor`, `mes_referencia`, `origem` ('manual' | 'ocr').

### Achievement
- `id`, `nome`, `descricao`.
- Tabela associativa `UserAchievements` (N:N).

## 3. Roteiro de Desenvolvimento

### Fase 1: Infraestrutura Backend
- [ ] Inicializar `npm init` no diretório `/backend`.
- [ ] Configurar `server.js` e `app.js`.
- [ ] Configurar conexão com o banco via Sequelize.
- [ ] Criar Modelos (`User`, `Consumo`, `Achievement`).

### Fase 2: Inteligência OCR
- [ ] Criar serviço de OCR utilizando `tesseract.js`.
- [ ] Implementar Regex para extração de dados da Sabesp.
- [ ] Criar rota `POST /api/fatura/upload`.

### Fase 3: Gamificação
- [ ] Implementar lógica de cálculo de XP ao salvar consumo.
- [ ] Implementar lógica de Streak.
- [ ] Criar rota de Ranking (Leaderboard).

### Fase 4: Frontend React
- [ ] Inicializar React App no diretório `/frontend`.
- [ ] Configurar Tailwind CSS.
- [ ] Desenvolver Dashboard com Recharts e barra de progresso de XP.
- [ ] Desenvolver componente de Upload com Drag & Drop.
- [ ] Implementar Navegação (Menu Lateral).

## 4. Definição de Pastas

```text
/backend
  /src
    /config
    /controllers
    /models
    /routes
    /services
    /utils
  server.js
/frontend
  /src
    /components
    /pages
    /services
    /hooks
  App.js
```
