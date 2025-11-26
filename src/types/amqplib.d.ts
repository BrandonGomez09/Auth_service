declare module "amqplib" {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel {
    assertExchange(
      exchange: string,
      type: string,
      options?: { durable?: boolean }
    ): Promise<any>;

    assertQueue(
      queue: string,
      options?: { durable?: boolean }
    ): Promise<any>;

    bindQueue(
      queue: string,
      exchange: string,
      routingKey: string
    ): Promise<any>;

    publish(
      exchange: string,
      routingKey: string,
      content: Buffer,
      options?: { persistent?: boolean }
    ): boolean;

    consume(
      queue: string,
      onMessage: (msg: ConsumeMessage | null) => void,
      options?: { noAck?: boolean }
    ): Promise<any>;

    ack(message: ConsumeMessage): void;
    nack(message: ConsumeMessage, allUpTo?: boolean, requeue?: boolean): void;

    close(): Promise<void>;
  }

  export interface ConsumeMessage {
    content: Buffer;
    fields: any;
    properties: any;
  }
  export function connect(url: string): Promise<Connection>;
}