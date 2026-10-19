# Day 8 Reflection

The most difficult concept was system design, especially concurrency and database transactions. I understood HTML, CSS, and basic JavaScript quickly, but I struggled with race conditions, like preventing two users from buying the same seat. I overcame it by building the QuickNotes project step by step, rewriting the data model docs after feedback, and practicing how SELECT FOR UPDATE and unique constraints work in PostgreSQL. Drawing architecture diagrams on paper also helped me see the flow before coding.

Based on feedback, I would improve my Project 2 documentation for QuickNotes. I scored 52/100 because my docs/data-model.md, docs/api-design.md, and README.md were truncated and placed in the wrong files. The grader noted missing CREATE TABLE statements, relationships, error codes, and response payloads. If I could redo it, I would write the complete schema and API contract first before deploying the frontend, and verify each file with wc -l before pushing.

Next, I will learn backend development with Node.js and Express, plus deeper PostgreSQL skills for indexing and transactions. I also want to learn Redis for caching and queues, and how to deploy a full-stack app with Docker. This will let me build TicketHub for real, not just on paper.
