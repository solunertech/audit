import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'at' })
  at!: Date;

  @Column({ type: 'text' })
  action!: string;

  @Column({ type: 'text' })
  module!: string;

  @Column({ type: 'text' })
  entity!: string;

  @Column({ type: 'text', nullable: true, name: 'entity_id' })
  entityId?: string;

  @Column({ type: 'text', nullable: true, name: 'actor_id' })
  actorId?: string;

  @Column({ type: 'text', nullable: true, name: 'actor_email' })
  actorEmail?: string;

  @Column({ type: 'text', nullable: true, name: 'actor_ip' })
  actorIp?: string;

  @Column({ type: 'text', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'text', nullable: true, name: 'request_id' })
  requestId?: string;

  @Column({ type: 'jsonb', nullable: true })
  before?: any;

  @Column({ type: 'jsonb', nullable: true })
  after?: any;

  @Column({ type: 'jsonb', nullable: true })
  diff?: any;

  @Column({ type: 'jsonb', nullable: true })
  meta?: any;
}
