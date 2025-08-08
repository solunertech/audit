import { Inject, Injectable } from '@nestjs/common';
import { AuditEvent, AuditOptions } from './audit.types';
import { getAuditCtx } from './request-context';
import { makeDiff, redactDeep } from './diff';

@Injectable()
export class AuditService {
  constructor(@Inject('AUDIT_OPTIONS') private readonly opts: AuditOptions) {}

  async record(event: AuditEvent) {
    const ctx = getAuditCtx();
    const base: AuditEvent = {
      ...event,
      actor: event.actor ?? ctx.actor,
      tenantId: event.tenantId ?? ctx.tenantId,
      requestId: event.requestId ?? ctx.requestId,
      at: event.at ?? new Date().toISOString(),
    };

    const withDiff =
      this.opts.includeDiff && base.before && base.after
        ? { ...base, diff: makeDiff(base.before, base.after) }
        : base;

    const redacted = redactDeep(withDiff, this.opts.redactions ?? []);
    await Promise.all(this.opts.sinks.map(s => s.emit(redacted)));
  }

  async ormRecord(action: AuditEvent['action'], e: any, parts: { before?: any; after?: any }) {
    const id =
      e.entity?.id ??
      e.databaseEntity?.id ??
      e.entity?._id?.toString?.() ??
      e.databaseEntity?._id?.toString?.() ??
      e.entityId?.toString?.();

    return this.record({
      action,
      module: e.metadata.tableName,
      entity: e.metadata.name,
      entityId: id,
      before: parts.before,
      after: parts.after,
      meta: { datasource: e.connection?.options?.type ?? e.queryRunner?.connection?.options?.type },
      at: new Date().toISOString(),
    });
  }
}
