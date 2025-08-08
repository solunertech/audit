import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditOptions } from './audit.types';
import { AuditRegistrar } from './audit.registrar';

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
      ],
      exports: [AuditService],
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
      ],
      exports: [AuditService],
    };
  }
}
