# LangGraph Starter Template

This repo offers the basic code structure to get started building LangGraph workflows in JavaScript within LangGraph studio.

## Repo Structure

```txt
├── LICENSE
├── README.md
├── jest.config.js # Test configuration
├── .env # Define environment variables. Can copy over from .env.example
├── langgraph.json # LangGraph studio configuration
├── my-app
│   ├── graph.ts # Graph / workflow definition
│   └── index.ts
├── package.json # Define the project dependencies
├── tests # Add any tests you'd like here
│   ├── integration
│   │   └── graph.int.test.ts
│   └── unit
│       └── graph.test.ts
├── tsconfig.json # Typescript-specific configuration
└── yarn.lock
```
