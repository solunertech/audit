import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditSubscriber } from './audit.subscriber';
import { AuditOptions } from './audit.types';

@Injectable()
export class AuditRegistrar implements OnModuleInit {
  constructor(
    private readonly audit: AuditService,
    @Inject('AUDIT_OPTIONS') private readonly opts: AuditOptions,
  ) {}

  onModuleInit() {
    if (!this.opts.dataSources?.length) return;
    const sub = new AuditSubscriber(this.audit);
    for (const ds of this.opts.dataSources) {
      // Avoid duplicates on hot reload
      if (!ds.subscribers?.some((s: any) => s instanceof AuditSubscriber)) {
        ds.subscribers.push(sub);
      }
    }
  }
}
