# Day 8 Reflection
Most difficult was system design, especially concurrency and transactions. I understood HTML/CSS/JS quickly, but struggled with race conditions like preventing two users buying same seat. I overcame it by building QuickNotes step by step, rewriting data model docs after feedback, practicing SELECT FOR UPDATE and unique constraints, and drawing architecture diagrams.

Based on feedback, I would improve Project 2 docs for QuickNotes. I scored 52/100 because docs/data-model.md, docs/api-design.md, README.md were truncated and in wrong files. Grader noted missing CREATE TABLE, relationships, error codes, response payloads. I would write full schema and API contract first, verify with wc -l before pushing.

Next I will learn Node.js and Express, deeper PostgreSQL indexing and transactions, Redis for caching/queues, and Docker deployment. This will let me build TicketHub for real.
