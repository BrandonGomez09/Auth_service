import { connect } from 'amqplib';
import { IEventPublisher } from '../domain/interfaces/event-publisher.interface';
import { rabbitmqConfig } from '../config/rabbitmq.config';

export class RabbitMQEventPublisherService implements IEventPublisher {
  private connection: any = null;
  private channel: any = null;
  private readonly exchange: string;
  private readonly exchangeType: string;

  constructor() { 
    this.exchange = rabbitmqConfig.exchange;
    this.exchangeType = rabbitmqConfig.exchangeType;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await connect(rabbitmqConfig.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchange, this.exchangeType, {
        durable: rabbitmqConfig.options.durable
      });

      console.log('✅ RabbitMQ connected successfully');
    } catch (error) {
      console.error('❌ Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publish(eventName: string, data: any): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }

    const message = JSON.stringify(data);

    this.channel!.publish(
      this.exchange,
      eventName,
      Buffer.from(message),
      { persistent: rabbitmqConfig.options.persistent }
    );

    console.log(`📤 Event published: ${eventName}`);
  }

  async publishBatch(events: Array<{ eventName: string; data: any }>): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }

    for (const event of events) {
      await this.publish(event.eventName, event.data);
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('✅ RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    }
  }
}
