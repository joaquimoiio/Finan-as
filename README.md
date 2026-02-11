# MeuFinanceiro — Controle Financeiro Pessoal

Sistema web para controle de finanças pessoais com dashboard,
controle de receitas, despesas, investimentos e planejamento.

## Tecnologias
- **Backend:** Java 17 + Spring Boot 3 + H2/PostgreSQL
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts

## Como rodar localmente

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Acesse: http://localhost:8080
Console H2: http://localhost:8080/h2-console

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:5173

## Deploy Gratuito
- Frontend: Vercel (vercel.com)
- Backend: Render (render.com)
- Banco: Neon PostgreSQL (neon.tech)

## Estrutura
```
├── backend/    → API Java Spring Boot
├── frontend/   → Interface React
└── README.md
```
