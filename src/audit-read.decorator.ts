export const AuditRead = (opts: { entity: string; idParam?: string; idSelector?: (req:any, res:any)=>any; module?: string }) =>
  (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('AUDIT_READ', opts, descriptor.value);
    return descriptor;
  };
