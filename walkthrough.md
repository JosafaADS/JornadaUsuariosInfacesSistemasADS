# Projeto Aqua Saúde - Guia de Execução

O Aqua Saúde é um sistema completo para monitoramento de consumo de água com gamificação e OCR.

## 1. Estrutura do Projeto

```text
/backend
  /src
    /config/database.js  - Configuração do Sequelize (SQLite)
    /models/             - Modelos User, Consumo e Achievement
    /controllers/        - Lógica de processamento e gamificação
    /services/ocrService.js - Processamento de PDF da Sabesp
    /routes/             - Rotas da API
  server.js              - Ponto de entrada do backend
  seed.js                - Script para dados iniciais
/frontend
  /src
    /components/Dashboard.jsx - Dashboard principal com gráficos
    /components/DragDropUpload.jsx - Componente de upload com OCR
    /App.jsx             - Container principal e navegação
```

## 2. Como Rodar o Sistema

### Backend
Abra um terminal na pasta `backend` e execute:
```bash
npm start
```
*O servidor rodará em `http://localhost:3001`.*

### Frontend
Abra um terminal na pasta `frontend` e execute:
```bash
npm run dev
```
*O Vite abrirá o app em `http://localhost:5173` (ou similar).*

## 3. Principais Funcionalidades Implementadas

1.  **Dashboard Gamificado**: Visualização de XP, Nível e Streak com design premium.
2.  **Gráfico de Consumo**: Gráfico interativo usando Recharts para acompanhamento mensal.
3.  **Upload OCR**: Componente Drag & Drop que lê arquivos PDF da Sabesp e extrai automaticamente o consumo e o mês de referência.
4.  **Sistema de XP**: Bônus de 100 XP se o consumo for menor que a média e multiplicador de Streak para registros consecutivos.
5.  **Ranking (Leaderboard)**: Rota para listar os usuários mais engajados.

## 4. Notas de Implementação

- **Banco de Dados**: Utilizado SQLite por padrão para facilidade de setup, mas pronto para migrar para MySQL/PostgreSQL alterando o `config/database.js`.
- **Estilização**: Tailwind CSS configurado com uma paleta de cores azulada e moderna (Aqua).
- **OCR**: O serviço utiliza `pdf-parse` para extração de texto e Regex específicos para o padrão de faturas da Sabesp.

> [!TIP]
> Você pode testar o sistema fazendo o upload de qualquer PDF. O regex tentará encontrar padrões como "Consumo do Mês" e datas no formato "MES/ANO".
