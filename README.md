# TTT v5

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Go](https://img.shields.io/badge/go-1.25-00ADD8.svg?logo=go)
![React](https://img.shields.io/badge/react-19-61DAFB.svg?logo=react)
![Mantine](https://img.shields.io/badge/mantine-v9-339AF0.svg?logo=mantine)
![PostgreSQL](https://img.shields.io/badge/postgresql-17-4169E1.svg?logo=postgresql)
![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?logo=docker)

TTT v5 is a modern, high-performance curated video platform built with a microservices architecture. It provides a seamless user experience for discovering, filtering, and managing video content with a robust tag-based classification system. 

Designed for scalability and developer experience, the project leverages a powerful stack including Go for the core backend, Node.js/Better Auth for the identity service, and React 19 with Mantine for the frontend.

## Features

- **Advanced Video Management:** Public APIs for pagination and retrieval, with secure admin CRUD operations.
- **Robust Tagging System:** Multi-color tag support, advanced AND-logic filtering, and scalable many-to-many relationships.
- **Modern User Interface:** Fully responsive design built with React 19 and Mantine v9. Features multiple color themes (Earth & Stone, Midnight & Bronze) and an optimized mobile experience.
- **Secure Authentication:** Dedicated identity microservice using Better Auth, providing session-based, stateless-friendly, secure authentication flows.
- **Developer Experience:** Containerized with Docker and Traefik, managed via comprehensive Makefile commands, and rigorously documented.

## Architecture & Tech Stack

The application is orchestrated using Docker Compose, fronted by a Traefik reverse proxy.

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 19, Vite, Mantine v9 | Client-side application with dynamic filtering and themes. |
| **Backend** | Go 1.25, Gin, GORM | Core API serving video and tag data. |
| **Identity Service** | Node.js, Hono, Better Auth | Dedicated microservice for handling user authentication. |
| **Database** | PostgreSQL 17, Atlas | Persistent storage with declarative schema migrations. |

## Repository Structure

```text
ttt_v5/
├── backend/            # Go REST API service
├── frontend/           # React 19 SPA
├── identity-service/   # Node.js authentication microservice
├── database/           # Atlas migrations and database setup
├── docs/               # System architecture and roadmaps
├── .agents/rules/      # 🧠 AI Agent Rules and Guidelines
└── CHANGELOG.md        # 📝 Detailed version history
```

*For specific documentation of each module, please visit the `README.md` inside their respective directories.*

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.25+ (for local backend development)
- Node.js 20+ (for local frontend/identity-service development)

### Running with Docker (Recommended)

1. Clone the repository and configure your environment:
   ```bash
   cp .env.example .env
   ```
2. Start all services:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost`
   - Identity API OpenAPI Docs: `http://localhost:8081/api/v1/auth/reference`

### Local Development

We provide a `Makefile` for simplified local development.

```bash
make dev      # Starts backend and frontend locally
```
*(Note: Identity service needs to be started separately via `npm run dev --prefix identity-service`)*

## Documentation & Guidelines

This project maintains rigorous documentation standards. 
- Please review our **[Changelog (CHANGELOG.md)](./CHANGELOG.md)** for a detailed history of features, fixes, and architectural changes.
- **AI Agent Rules:** We utilize strictly defined agent guidelines located in **[`.agents/rules`](./.agents/rules)** to ensure code consistency, secure workflows, and predictable AI pair-programming outcomes.

## License

This project is licensed under the MIT License.
