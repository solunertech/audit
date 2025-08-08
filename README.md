
# @solunertech/audit

Pluggable audit logging for **NestJS + TypeORM (v0.3+)** that works with **Postgres, MySQL, and MongoDB (TypeORM)**.

- Captures **CREATE / UPDATE / DELETE** via TypeORM subscriber
- Optional **READ** logging via decorator
- Tracks **who** (actor), **when**, **what** (diff), **where** (entity/table/id), **tenant**, **requestId**
- Uses **AsyncLocalStorage** to carry request context from HTTP → ORM
- Pluggable **sinks** (Console, DB, Kafka)

See usage instructions in our last message.
