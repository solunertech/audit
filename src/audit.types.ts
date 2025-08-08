export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';

export interface AuditActor {
  id?: string | number;
  email?: string;
  ip?: string;
}

export interface AuditEvent<T = any> {
  action: AuditAction;
  module: string;                  // table/collection
  entity: string;                  // Entity class name
  entityId?: string | number;
  before?: Partial<T>;
  after?: Partial<T>;
  diff?: Record<string, { from: any; to: any }>;
  actor?: AuditActor;
  tenantId?: string | number;
  requestId?: string;
  at: string;                      // ISO date
  meta?: Record<string, any>;
}

export interface AuditSink {
  name: string;
  emit(e: AuditEvent): Promise<void> | void;
}

export interface AuditOptions {
  includeDiff?: boolean;
  redactions?: string[]; // e.g. ['password', 'token', 'card.number']
  sinks: AuditSink[];
  actorResolver?: (req: any) => Partial<AuditActor> | undefined;
  tenantResolver?: (req: any) => string | number | undefined;
  /**
   * Required for attaching the subscriber to all active connections.
   * Provide actual DataSource instances in forRootAsync.
   */
  dataSources?: any[]; // DataSource[]
}
