import { AuditEvent, AuditSink } from '../audit.types';

export class KafkaSink implements AuditSink {
  name = 'kafka';
  constructor(private readonly producer: { send: Function }, private readonly topic = 'audit.events') {}
  async emit(e: AuditEvent) {
    await this.producer.send({ topic: this.topic, messages: [{ value: JSON.stringify(e) }] });
  }
}
