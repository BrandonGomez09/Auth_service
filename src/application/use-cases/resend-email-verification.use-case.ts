import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { EmailVerification } from '../../domain/entities/email-verification.entity';

export class ResendEmailVerificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: { userId: number }): Promise<{ message: string }> {
    if (!dto.userId) {
      throw { http_status: 400, message: 'User ID is required' };
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw { http_status: 404, message: 'User not found' };
    }

    if (user.verifiedEmail) {
      throw { http_status: 400, message: 'Email is already verified' };
    }

    const lastVerification = await this.emailVerificationRepository.findLatestByUserId(user.id);
    if (lastVerification) {
      const diff = Date.now() - lastVerification.createdAt.getTime();
      if (diff < 60_000) {
        throw { http_status: 429, message: 'Please wait before requesting a new verification email' };
      }
    }

    const verificationToken = this.tokenGenerator.generateRandomToken();

    const emailVerification = new EmailVerification(
      0,
      user.id,
      verificationToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      false,
      new Date(),
      null
    );

    await this.emailVerificationRepository.save(emailVerification);

    const verificationUrl = `${process.env.EMAIL_VERIFICATION_BASE_URL}/email/${verificationToken}`;

    await this.eventPublisher.publish("user.email.verification.resent", {
      userId: user.id,
      email: user.email,
      verificationToken,
      userName: user.names,
      verificationUrl
    });

    return { message: 'A new verification link has been sent to your email.' };
  }
}