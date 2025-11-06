import { RegisterUserDto } from '../dtos/register-user.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { EmailVerification } from '../../domain/entities/email-verification.entity';
import { UserValidator } from '../../domain/validators/user.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: RegisterUserDto): Promise<{
    message: string;
    user: User;
  }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw {
        http_status: 409,
        message: 'Email already registered'
      };
    }

    const passwordValidator = new PasswordStrengthValidator(dto.password);
    await passwordValidator.validate();

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const newUser = new User(
      0,
      dto.names,
      dto.firstLastName,
      dto.secondLastName,
      dto.email,
      hashedPassword,
      null,
      dto.phoneNumber || null,
      0,
      null,
      UserStatus.PENDING,
      false,
      false,
      null,
      null,
      dto.stateId,
      dto.municipalityId,
      new Date(),
      new Date(),
      null
    );

    const userValidator = new UserValidator(newUser);
    await userValidator.validateWithCustomRules();

    const savedUser = await this.userRepository.save(newUser);

    const verificationToken = this.tokenGenerator.generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const emailVerification = new EmailVerification(
      0,
      savedUser.id,
      verificationToken,
      expiresAt,
      false,
      new Date(),
      null
    );

    await this.emailVerificationRepository.save(emailVerification);

    await this.eventPublisher.publish('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      names: savedUser.names,
      verificationToken,
      timestamp: new Date().toISOString()
    });

    return {
      message: 'User registered successfully. Please verify your email to activate your account.',
      user: savedUser
    };
  }
}