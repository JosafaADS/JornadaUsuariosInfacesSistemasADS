# 🌊 Documentação do Sistema Aqua Saúde

## 1. Visão Geral
O **Aqua Saúde** é uma plataforma educacional e de gestão focada na conscientização sobre o consumo de água. O sistema transforma a economia de água em uma experiência gamificada, permitindo que usuários (especialmente crianças) monitorem seu consumo, ganhem XP, subam de nível e compitam em um ranking global.

## 2. Arquitetura do Sistema
O projeto segue uma arquitetura **Full-Stack** moderna:
- **Backend**: API REST construída com Node.js e Express.
- **Banco de Dados**: SQLite gerenciado pelo Sequelize ORM para persistência leve e eficiente.
- **Frontend**: Single Page Application (SPA) com React.js e Vite.
- **Estilização**: Tailwind CSS v4 para uma interface moderna e responsiva.

## 3. Funcionalidades Principais

### 🔐 Autenticação e Perfil
- **Login/Cadastro**: Acesso seguro com criptografia de senhas (Bcrypt).
- **Recuperação de Senha**: Sistema simplificado confirmando Nome, CPF e E-mail, exibindo a senha diretamente para facilitar o uso pedagógico.
- **Gestão de Progresso**: Cada usuário possui seu próprio saldo de XP, Nível e Streak (dias consecutivos).

### 📄 Processamento de Faturas (OCR)
- **Upload de PDF**: Suporte a faturas da Sabesp.
- **Extração Inteligente**: Uso de `pdf-parse` e padrões Regex avançados para capturar automaticamente:
  - Mês de referência.
  - Consumo em m³.
  - Valor total da fatura.
- **Confirmação**: Interface para revisão dos dados antes da gravação definitiva.

### 🎮 Gamificação
- **Sistema de XP**: 
  - Bônus por economia (comparação com a média histórica).
  - Multiplicadores por Streak.
- **Níveis**: Progressão baseada em XP acumulado.
- **Ranking**: Leaderboard global atualizado em tempo real.

### 📊 Visualização e Histórico
- **Dashboard**: Gráficos interativos (Recharts) mostrando a evolução do consumo.
- **Histórico**: Tabela detalhada de todos os registros passados.
- **Dicas**: Módulo educativo com sugestões de saúde e sustentabilidade.
- **Meu Perfil**: Tela para edição de dados pessoais (Nome, Email e Senha) com feedback em tempo real.

## 4. UI/UX e Feedback
- **Modais Premium**: Substituição de alertas simples por modais elegantes com animações (Award/XP).
- **Design Responsivo**: Adaptado para desktop e dispositivos móveis (Sidebar retrátil).
- **Micro-animações**: Uso de Lucide Icons e transições CSS para uma experiência fluida.

## 5. Stack Tecnológica
| Camada | Tecnologia |
| :--- | :--- |
| **Linguagem** | JavaScript (Node.js / React) |
| **Backend Framework** | Express.js |
| **ORM** | Sequelize |
| **Banco de Dados** | SQLite |
| **OCR / PDF** | pdf-parse |
| **Frontend Framework** | React.js (Hooks, Vite) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **CSS** | Tailwind CSS v4 |

## 6. Estrutura de Pastas
```
/
├── backend/
│   ├── src/
│   │   ├── config/      # Configuração do DB
│   │   ├── controllers/ # Lógica de negócio (Auth, Fatura)
│   │   ├── models/      # Modelos Sequelize (User, Consumo, Achievement)
│   │   ├── routes/      # Definição de rotas API
│   │   └── services/    # Serviços (OCR Service)
│   ├── uploads/         # Armazenamento temporário de PDFs
│   ├── server.js        # Ponto de entrada do servidor
│   └── seed.js          # Dados iniciais de teste
└── frontend/
    ├── src/
    │   ├── components/  # Componentes React (Dashboard, Auth, Perfil, etc)
    │   ├── App.jsx      # Componente principal e rotas
    │   └── index.css    # Estilos globais e Tailwind
```

## 7. Como Executar o Projeto

### Backend
1. Navegue até `/backend`.
2. Instale as dependências: `npm install`.
3. (Opcional) Popule o banco: `node seed.js`.
4. Inicie o servidor: `npm start`.

### Frontend
1. Navegue até `/frontend`.
2. Instale as dependências: `npm install`.
3. Inicie o ambiente de desenvolvimento: `npm run dev`.

---
*Documentação atualizada em 28/04/2026. Sistema Aqua Saúde pronto para produção educativa.* 🌊🚀📚
