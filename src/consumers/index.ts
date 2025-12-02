import { KitchenApprovedConsumerService } from "../services/kitchen-approved.consumer.service";
import { registerKitchenAdminUseCase } from "../infrastructure/api/dependencies/dependencies";

export async function startConsumers() {
  const consumer = new KitchenApprovedConsumerService(
    registerKitchenAdminUseCase
  );

  await consumer.start();
}
