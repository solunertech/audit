export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';

export interface AuditActor {
  id?: string | number;
  email?: string;
  ip?: string;
}

export interface AuditEvent<T = any> {
  action: AuditAction;
  module: string;
  entity: string;
  entityId?: string | number;
  before?: Partial<T>;
  after?: Partial<T>;
  diff?: Record<string, { from: any; to: any }>;
  actor?: AuditActor;
  tenantId?: string | number;
  requestId?: string;
  at: string;
  meta?: Record<string, any>;
}

export interface AuditSink {
  name: string;
  emit(e: AuditEvent): Promise<void> | void;
}

export interface AuditOptions {
  includeDiff?: boolean;
  redactions?: string[];
  sinks: AuditSink[];
  actorResolver?: (req: any) => Partial<AuditActor> | undefined;
  tenantResolver?: (req: any) => string | number | undefined;
  dataSources?: any[];
}
