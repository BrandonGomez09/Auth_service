import amqp from "amqplib";
import { rabbitmqConfig } from "../config/rabbitmq.config";
import { RegisterAdminKitchenUseCase } from "../application/use-cases/register-admin-kitchen.use-case";

export class KitchenApprovedConsumerService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly registerUseCase: RegisterAdminKitchenUseCase) {}

  async connect() {
    this.connection = await amqp.connect(rabbitmqConfig.url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(rabbitmqConfig.exchange, "topic", {
      durable: true
    });

    const queue = rabbitmqConfig.queues.auth;

    await this.channel.assertQueue(queue, { durable: true });

    await this.channel.bindQueue(
      queue,
      rabbitmqConfig.exchange,
      rabbitmqConfig.routingKeys.kitchenAdminRegistered
    );

    console.log(" [AUTH] KitchenApprovedConsumer READY");
  }

  async start() {
    if (!this.channel) await this.connect();

    const queue = rabbitmqConfig.queues.auth;

    const channel = this.channel!;
    channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;

        let data: any;

        try {
          data = JSON.parse(msg.content.toString());
        } catch (err) {
          console.error("❌ Invalid JSON in event");
          return channel.ack(msg);
        }

        console.log("[AUTH] Event received:");

        const requiredFields = [
          "kitchenId",
          "names",
          "firstLastName",
          "email",
          "phoneNumber",
          "password"
        ];

        for (const field of requiredFields) {
          if (!data[field]) {
            console.error(`❌ Missing field '${field}'`);
            return channel.ack(msg);
          }
        }

        try {
          await this.registerUseCase.execute(data);
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing event:", err);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  }
}