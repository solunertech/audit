
# @solunertech/audit

Pluggable audit logging for **NestJS + TypeORM (v0.3+)** that works with **Postgres, MySQL, and MongoDB (TypeORM)**.

- Captures **CREATE / UPDATE / DELETE** via TypeORM subscriber
- Optional **READ** logging via decorator
- Tracks **who** (actor), **when**, **what** (diff), **where** (entity/table/id), **tenant**, **requestId**
- Uses **AsyncLocalStorage** to carry request context from HTTP → ORM
- Pluggable **sinks** (Console, DB, Kafka)

## Install

```bash
npm i @solunertech/audit
```

> Peer deps: `@nestjs/common`, `@nestjs/core`, `typeorm@^0.3`, `reflect-metadata`, `rxjs`

## Quick start (consumer app)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  AuditModule, AuditHttpInterceptor, ConsoleSink, DbSink, AuditLogEntity
} from '@solunertech/audit';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    // your modules that create DataSources (e.g., 'POSTGRES_CONNECTION', 'MONGO_CONNECTION', 'MYSQL_CONNECTION')
    AuditModule.forRootAsync({
      inject: ['POSTGRES_CONNECTION', 'MONGO_CONNECTION', 'MYSQL_CONNECTION'],
      useFactory: async (pg: DataSource | null, mongo: DataSource | null, mysql: DataSource | null) => {
        let dbSink: DbSink | undefined;
        if (pg) {
          // Ensure AuditLogEntity is in Postgres entities
          const repo = pg.getRepository(AuditLogEntity);
          dbSink = new DbSink(repo);
        }
        return {
          includeDiff: true,
          redactions: ['password', 'token'],
          sinks: [ new ConsoleSink(), ...(dbSink ? [dbSink] : []) ],
          actorResolver: (req) => ({ id: req.user?.id, email: req.user?.email, ip: req.ip }),
          tenantResolver: (req) => req.headers['x-tenant-id'],
          dataSources: [pg, mongo, mysql].filter(Boolean) as DataSource[],
        };
      },
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: AuditHttpInterceptor },
  ],
})
export class AppModule {}
```

Log reads where you care:

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { AuditRead } from '@solunertech/audit';

@Controller('users')
export class UsersController {
  @Get(':id')
  @AuditRead({ entity: 'User', idParam: 'id' })
  findOne(@Param('id') id: string) { /* ... */ }
}
```

### Postgres table (for DbSink)

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id           bigserial PRIMARY KEY,
  at           timestamptz NOT NULL DEFAULT now(),
  action       text NOT NULL,
  module       text NOT NULL,
  entity       text NOT NULL,
  entity_id    text,
  actor_id     text,
  actor_email  text,
  actor_ip     text,
  tenant_id    text,
  request_id   text,
  before       jsonb,
  after        jsonb,
  diff         jsonb,
  meta         jsonb
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs (entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_at ON audit_logs (at);
```

## Publish

```bash
npm login
npm publish --access public
```

MIT © Soluner Tech Solutions Private Limited
