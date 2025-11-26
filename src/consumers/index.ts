import { KitchenApprovedConsumerService } from "../services/kitchen-approved.consumer.service";
import { registerKitchenAdminUseCase } from "../infrastructure/api/dependencies/dependencies";

export async function startConsumers() {
  console.log("📥 Starting consumers...");

  const consumer = new KitchenApprovedConsumerService(
    registerKitchenAdminUseCase
  );

  await consumer.start();

  console.log("✅ Consumers initialized successfully");
}
