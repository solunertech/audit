import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { AuditService } from './audit.service';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(private readonly audit: AuditService) {}

  async afterInsert(e: InsertEvent<any>) {
    await this.audit.ormRecord('CREATE', e, { after: e.entity });
  }

  async afterUpdate(e: UpdateEvent<any>) {
    await this.audit.ormRecord('UPDATE', e, { before: e.databaseEntity, after: e.entity });
  }

  async afterRemove(e: RemoveEvent<any>) {
    await this.audit.ormRecord('DELETE', e, { before: e.databaseEntity ?? e.entity });
  }
}
