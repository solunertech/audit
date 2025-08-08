import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AuditOptions } from './audit.types';
import { runWithAuditCtx } from './request-context';

@Injectable()
export class AuditHttpInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUDIT_OPTIONS') private readonly opts: AuditOptions,
    private readonly audit: AuditService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<any>) {
    const http = ctx.switchToHttp();
    const req = http.getRequest();

    const store = {
      actor: this.opts.actorResolver?.(req),
      tenantId: this.opts.tenantResolver?.(req),
      requestId: req.id,
    };

    return runWithAuditCtx(store, () =>
      next.handle().pipe(
        tap((res) => {
          const meta = Reflect.getMetadata('AUDIT_READ', ctx.getHandler());
          if (!meta) return;

          const id =
            meta.idParam ? req.params?.[meta.idParam] :
            meta.idSelector ? meta.idSelector(req, res) : undefined;

          this.audit.record({
            action: 'READ',
            module: meta.module ?? meta.entity?.toLowerCase?.() ?? 'unknown',
            entity: meta.entity ?? 'Unknown',
            entityId: id?.toString?.(),
            meta: { url: req.originalUrl, method: req.method },
            at: new Date().toISOString(),
          });
        }),
      )
    );
  }
}
