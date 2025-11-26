import amqp from "amqplib";
import { rabbitmqConfig } from "../config/rabbitmq.config";
import { RegisterAdminKitchenUseCase } from "../application/use-cases/register-admin-kitchen.use-case";

export class KitchenApprovedConsumerService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly registerUseCase: RegisterAdminKitchenUseCase) {}

  async connect() {
    if (!rabbitmqConfig.url) {
      throw new Error("RabbitMQ URL is undefined");
    }

    this.connection = await amqp.connect(rabbitmqConfig.url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(rabbitmqConfig.exchange, "topic", {
      durable: true,
    });

    const authQueue = rabbitmqConfig.queues.auth;
    if (!authQueue) {
      throw new Error("❌ rabbitmqConfig.queues.auth is undefined");
    }

    await this.channel.assertQueue(authQueue, { durable: true });

    await this.channel.bindQueue(
      authQueue,
      rabbitmqConfig.exchange,
      rabbitmqConfig.routingKeys.kitchenAdminRegistered
    );

    console.log("📥 [AUTH] KitchenApprovedConsumer READY");
  }

  async start() {
    if (!this.channel) await this.connect();

    const authQueue = rabbitmqConfig.queues.auth!;
    
    this.channel!.consume(
      authQueue,
      async (msg) => {
        if (!msg) return;

        const raw = msg.content.toString();
        let data: any;

        try {
          data = JSON.parse(raw);
        } catch {
          console.error("❌ Invalid JSON in received event:", raw);
          this.channel!.ack(msg); 
          return;
        }

        console.log("📦 [AUTH] Event received:", data);

        const required = ["names", "firstLastName", "email", "phoneNumber", "password"];

        for (const field of required) {
          if (!data[field]) {
            console.error(`❌ Missing field '${field}' in event`);
            this.channel!.ack(msg);
            return;
          }
        }

        try {
          await this.registerUseCase.execute(data);
          this.channel!.ack(msg);
        } catch (err) {
          console.error("❌ Error processing event:", err);
          this.channel!.nack(msg, false, false); 
        }
      },
      { noAck: false }
    );
  }
}