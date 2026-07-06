# Custom RAG & Agentic Backend 

A robust, TypeScript-based backend engineered for a Retrieval-Augmented Generation (RAG) system combined with an intelligent AI Agent framework. Built on top of the MERN stack paradigm, this service handles advanced document ingestion, vector embeddings, semantic knowledge retrieval, and autonomous agent workflows.

---

## 🚀 Key Features

* **Modular RAG Architecture**: Complete pipeline for data handling including splitting, loading, vector store management, and semantic retrieval.
* **Autonomous AI Agents**: Multi-functional agent loop featuring memory management, tool execution, and policy control.
* **Vector Database Integration**: High-performance semantic search using vector storage.
* **Extensible Routing**: Clear separation of concerns with dedicated routes for User management, Knowledge Base (KB) operations, and Agent interactions.
* **Strict TypeScript Implementation**: Type-safety across all controllers, models, routes, and shared Used Zod for validation 

---

## 📂 Project Architecture

The codebase follows a highly modular, clean-architecture structure separating core server logic from the AI orchestration layers:

```text
src/
├── Controllers/       # Handles incoming HTTP requests and responses
│   └── userController.ts
├── Models/            # Database schemas (e.g., chat history, feedback tracking)
│   ├── chatModel.ts
│   └── feedbackModel.ts
├── Rag/               # Core AI & Knowledge capabilities
│   ├── Agent/         # Autonomous agent orchestration
│   │   ├── agent.ts   # Core agent execution loop
│   │   ├── memory.ts  # Session/conversational memory management
│   │   ├── policy.ts  # Guardrails and execution instructions
│   │   └── tools.ts   # Executable tools available to the agent
│   └── Kb/            # Knowledge Base and RAG pipeline
│       ├── ingestData.ts   # Main data ingestion orchestrator
│       ├── loadData.ts     # File loaders (PDFs, Markdown, etc.)
│       ├── splitData.ts    # Text splitting and chunking strategies
│       ├── vectorStore.ts  # Embedding generation and vector DB sync
│       └── retrieveData.ts # Query embedding and similarity search
├── Routes/            # Express API endpoints
│   ├── agentRouter.ts
│   ├── kbRouter.ts
│   └── userRoutes.ts
├── Shared/            # Global utilities and database initialization
│   ├── env.ts         # Strictly-typed environment variables
│   ├── mongodb.ts     # Database connection client
│   └── openai.ts      # Configured LLM/Embedding client
├── app.ts             # Express application configuration
└── index.ts           # Server entry point
