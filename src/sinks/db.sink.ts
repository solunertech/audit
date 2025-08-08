import type { Repository } from 'typeorm';
import { AuditEvent, AuditSink } from '../audit.types';

export class DbSink implements AuditSink {
  name = 'db';
  constructor(private readonly repo: Repository<any>) {}
  async emit(e: AuditEvent) {
    await this.repo.insert({
      ...e,
      actorId: e.actor?.id?.toString?.(),
      actorEmail: e.actor?.email,
      actorIp: e.actor?.ip,
    });
  }
}
