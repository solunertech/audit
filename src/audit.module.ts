import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';               
import { AuditService } from './audit.service';
import { AuditOptions } from './audit.types';
import { AuditRegistrar } from './audit.registrar';
import { AuditHttpInterceptor } from './audit-http.interceptor';

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
      // export both the service and the token (handy if the app wants it)
      exports: [AuditService, 'AUDIT_OPTIONS'],                     
    };
  }

  static forRootAsync(asyncOptions: {
    inject?: any[];
    useFactory: (...args: any[]) => Promise<AuditOptions> | AuditOptions;
  }): DynamicModule {
    return {
      module: AuditModule,
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
