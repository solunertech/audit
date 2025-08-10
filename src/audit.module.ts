// in @solunertech/audit/src/audit.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditRegistrar } from './audit.registrar';
import { AuditHttpInterceptor } from './audit-http.interceptor';
import { AuditOptions } from './audit.types';

type AsyncOpts = {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<AuditOptions> | AuditOptions;
};

@Global()
@Module({})
export class AuditModule {
  static forRoot(options: AuditOptions): DynamicModule {
    return {
      module: AuditModule,
      providers: [
        { provide: 'AUDIT_OPTIONS', useValue: options },
        AuditService,
        AuditRegistrar,
        { provide: APP_INTERCEPTOR, useClass: AuditHttpInterceptor },
      ],
      exports: [AuditService, 'AUDIT_OPTIONS'],
    };
  }

  static forRootAsync(asyncOptions: AsyncOpts): DynamicModule {
    return {
      module: AuditModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        {
          provide: 'AUDIT_OPTIONS',
          inject: asyncOptions.inject ?? [],
          useFactory: asyncOptions.useFactory,
        },
        AuditService,
        AuditRegistrar,
        { provide: APP_INTERCEPTOR, useClass: AuditHttpInterceptor },
      ],
      exports: [AuditService, 'AUDIT_OPTIONS'],
    };
  }
}
