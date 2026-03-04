# Proposed Architecture Overview

Designing a robust backend architecture for the application requires choosing stable technologies and

ensuring data persistence, especially given offline usage scenarios. We will limit the stack to

TypeScript-based backend services (for type safety and modern language features) and use Docker

containers for deployment consistency. A RESTful API will serve as the interface for clients (e.g. the

React front-end or mobile app), providing endpoints to create, read, update, and delete data (e.g.

fumigation jobs, field records, user info). Key considerations include selecting a suitable web

framework, deciding between a relational or non-relational database, and handling "ephemeral" jobs or

offline-generated data by persisting state externally so nothing is lost on service restarts. The

architecture should be modular, scalable, and aligned with best practices for stability.

---

## REST API with TypeScript (Framework Selection)

For the TypeScript backend, we need a stable and well-supported web framework to build the REST
API. While Express.js is a popular minimalist choice, offering flexibility and a huge ecosystem, it

provides only the basics out-of-the-box

1

. This simplicity is great for quick development, but larger

projects can become unwieldy without a defined structure. A more opinionated framework like

NestJS is often recommended for enterprise-scale TypeScript projects

1

. NestJS is built with

TypeScript in mind and enforces a modular architecture (inspired by Angular's design), which

encourages best practices (e.g. controller-service-repository patterns, dependency injection) and leads

to more maintainable code in the long run

1

. In other words, Express gives maximum freedom and is

very mature, but NestJS provides "a full toolbox" for scalability and maintainability, making it "ideal for

large-scale applications"

1

.

> **Nota:** El resto del contenido de la arquitectura propuesta se puede encontrar en el documento original completo.
