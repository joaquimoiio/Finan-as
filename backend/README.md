# Backend - Sistema Financeiro Pessoal

API REST para controle financeiro pessoal, feita com Java Spring Boot.

## Tecnologias

- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring Security + JWT
- H2 Database (desenvolvimento)
- Lombok
- Maven

## Como rodar

```bash
cd backend
mvn spring-boot:run
```

O servidor vai subir em `http://localhost:8080`.

## Console do H2

Acesse `http://localhost:8080/h2-console` com:
- JDBC URL: `jdbc:h2:mem:financeiro`
- User: `sa`
- Password: (vazio)

## Endpoints

### Autenticacao (publico)
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Fazer login

### Receitas (protegido)
- `GET /api/receitas?mes=1&ano=2026` - Listar receitas do mes
- `POST /api/receitas` - Criar receita
- `PUT /api/receitas/{id}` - Atualizar receita
- `DELETE /api/receitas/{id}` - Deletar receita

### Despesas (protegido)
- `GET /api/despesas?mes=1&ano=2026` - Listar despesas do mes
- `POST /api/despesas` - Criar despesa
- `PUT /api/despesas/{id}` - Atualizar despesa
- `DELETE /api/despesas/{id}` - Deletar despesa

### Investimentos (protegido)
- `GET /api/investimentos` - Listar investimentos
- `POST /api/investimentos` - Criar investimento
- `PUT /api/investimentos/{id}` - Atualizar investimento
- `DELETE /api/investimentos/{id}` - Deletar investimento

### Metas (protegido)
- `GET /api/metas` - Listar metas
- `POST /api/metas` - Criar meta
- `PUT /api/metas/{id}` - Atualizar meta
- `DELETE /api/metas/{id}` - Deletar meta

### Dashboard (protegido)
- `GET /api/dashboard?mes=1&ano=2026` - Dados do dashboard
