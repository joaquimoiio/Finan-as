# Frontend - MeuFinanceiro

Interface web para controle financeiro pessoal com tema escuro.

## Tecnologias

- React 18 + Vite
- React Router DOM v6
- Axios
- Recharts (graficos)
- Tailwind CSS
- Lucide React (icones)

## Como rodar

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Paginas

- `/login` — Login
- `/registro` — Criar conta
- `/` — Dashboard (KPIs, graficos, regra 50/30/20)
- `/receitas` — CRUD de receitas
- `/despesas` — CRUD de despesas com filtro por categoria
- `/investimentos` — CRUD com grafico de alocacao
- `/planejamento` — Regra 50/30/20, simulador e metas

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do frontend:

```
VITE_API_URL=http://localhost:8080/api
```
