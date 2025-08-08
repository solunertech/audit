import { AuditEvent, AuditSink } from '../audit.types';

export class ConsoleSink implements AuditSink {
  name = 'console';
  emit(e: AuditEvent) {
    // eslint-disable-next-line no-console
    console.log('[AUDIT]', JSON.stringify(e));
  }
}
