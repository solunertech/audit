import { AsyncLocalStorage } from 'node:async_hooks';
import type { AuditActor } from './audit.types';

export type AuditCtx = {
  actor?: AuditActor;
  tenantId?: string | number;
  requestId?: string;
};

const storage = new AsyncLocalStorage<AuditCtx>();

export const runWithAuditCtx = <T>(ctx: AuditCtx, fn: () => T) => storage.run(ctx, fn);
export const getAuditCtx = (): AuditCtx => storage.getStore() ?? {};
