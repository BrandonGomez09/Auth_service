import { config } from 'dotenv';

config();

export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || '',
  exchange: process.env.RABBITMQ_EXCHANGE || '',
  exchangeType: 'topic' as const,
  queues: {
    auth: process.env.RABBITMQ_QUEUE_AUTH || '',
    emailVerification: 'email_verification_queue',
    phoneVerification: 'phone_verification_queue',
    passwordReset: 'password_reset_queue'
  },
  routingKeys: {
    userRegistered: 'user.registered',
    userEmailVerified: 'user.email.verified',
    userPhoneVerified: 'user.phone.verified',
    passwordResetRequested: 'user.password.reset.requested',
    passwordResetCompleted: 'user.password.reset.completed',
    roleAssigned: 'user.role.assigned',
    roleRemoved: 'user.role.removed',
    kitchenAdminRegistered: 'kitchen.admin.registered'
  },
  options: {
    durable: true,
    persistent: true,
    prefetch: 10
  }
};