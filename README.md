# 🧾 OrdersFlow — Sistema de Gestão de Pedidos

## 📖 Sobre o Projeto

O **OrdersFlow** é um sistema de **gestão de pedidos** desenvolvido com **.NET 8**, **React** e **PostgreSQL**.  
Ele permite **criar, listar, editar e visualizar pedidos, clientes e produtos**, isso via interface web.
---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| **Backend** | .NET 8, ASP.NET Core Web API, Entity Framework Core |
| **Frontend** | React + Vite + TailwindCSS + TypeScript |
| **Banco de Dados** | PostgreSQL |
| **Admin DB** | PgAdmin4 |
| **Infraestrutura** | Docker & Docker Compose |

---

## 📦 Estrutura do Projeto

```
OrdersFlow/
 ├─ client/              # Frontend React
 ├─ server/              # Backend .NET
 ├─ docker-compose.yml   # Orquestração de containers
 ├─ .env                 # Variáveis de ambiente
 └─ README.md
```

---

## ⚙️ Configuração e Execução

### 1️⃣ Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com o seguinte conteúdo:

```bash
# Banco de Dados
POSTGRES_DB=PG_DATABASE
POSTGRES_USER=PG_USER
POSTGRES_PASSWORD=PG_PASSWORD
DB_HOST=PG_HOST
DB_PORT=PG_PORT

# API
ASPNETCORE_ENVIRONMENT=Development
API_PORT=8080

# Frontend
FRONTEND_PORT=5173

# PgAdmin
PGADMIN_DEFAULT_EMAIL=PGADMIN_EMAIL
PGADMIN_DEFAULT_PASSWORD=PGADMIN_PASS
PGADMIN_PORT=PG_ADMIN_PORT
```

---

### 2️⃣ Subir o ambiente com Docker

```bash
docker compose up --build
```

Isso iniciará automaticamente:

- PostgreSQL  
- PgAdmin  
- API (.NET 8)  
- Worker (.NET 8)  
- Frontend (React + TailwindCSS)

---

### 3️⃣ Acessar as aplicações

| Serviço | URL |
|----------|-----|
| 🖥️ Frontend | http://localhost:5173 |
| ⚙️ API (Swagger) | http://localhost:8080/swagger |
| 🗃️ PgAdmin | http://localhost:5050 |

---

### 4️⃣ (Opcional) Aplicar migrations manualmente

```bash
docker compose exec api dotnet ef database update
```

---

## 🚀 Endpoints da API

### 🧍‍♂️ Clientes (`/api/customer`)

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/api/customer` | Lista todos os clientes |
| `GET` | `/api/customer/{id}` | Busca cliente por ID |
| `POST` | `/api/customer` | Cria um novo cliente |
| `PUT` | `/api/customer` | Atualiza dados de um cliente |
| `DELETE` | `/api/customer/{id}` | Remove um cliente |

---

### 📦 Produtos (`/api/product`)

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/api/product` | Lista todos os produtos |
| `POST` | `/api/product` | Cria um novo produto |
| `PUT` | `/api/product` | Atualiza informações de produto |
| `DELETE` | `/api/product/{id}` | Desativa um produto |

---

### 🧾 Pedidos (`/api/order`)

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/api/order` | Lista todos os pedidos |
| `GET` | `/api/order/{id}` | Obtém detalhes de um pedido |
| `POST` | `/api/order` | Cria um novo pedido |
| `PUT` | `/api/order` | Atualiza dados de um pedido |
| `DELETE` | `/api/order/{id}` | Cancela um pedido |

---

## 🧠 Regras de Negócio

- Cada pedido possui:
  - `id`, `cliente`, `produto`, `valor`, `status`, `data_criacao`
- Sequência obrigatória de status:
  ```
  Pendente → Processando → Finalizado
  ```
- Ao criar um pedido:
  1. Ele é salvo no banco de dados.
  2. O Worker consome a mensagem e:
     - Atualiza para **Processando**
     - Após 5 segundos → **Finalizado**
---

## 🔄 Fluxo de Processamento

```text
1️⃣ Cliente cria pedido via Frontend
2️⃣ API salva no PostgreSQL e envia mensagem para fila
3️⃣ Worker consome mensagem
4️⃣ Atualiza status: Pendente → Processando → Finalizado
5️⃣ Frontend reflete as atualizações em tempo real
```
---

## 🧰 Comandos Úteis

### 🔁 Rebuild do ambiente
```bash
docker compose up --build --force-recreate
```

### 🧹 Parar e remover containers
```bash
docker compose down -v
```
### 🪵 Ver logs do Worker
```bash
docker logs ordersflow-worker -f
```
### 🩺 Testar Healthcheck
```bash
curl http://localhost:8080/health
```
---