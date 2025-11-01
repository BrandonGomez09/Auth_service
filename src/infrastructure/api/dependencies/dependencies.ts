import { UserRepository } from '../../adapters/user.adaptador';
import { EmailVerificationRepository } from '../../adapters/email-verification.adapter';
import { PhoneVerificationRepository } from '../../adapters/phone-verification.adapter';
import { PasswordResetTokenRepository } from '../../adapters/password-reset-token.adapter';
import { RoleRepository } from '../../adapters/role.adapter';
import { PermissionRepository } from '../../adapters/permission.adapter';

import { BcryptPasswordHasherService } from '../../../services/bcrypt-password-hasher.service';
import { JwtTokenGeneratorService } from '../../../services/jwt-token-generator.service';
import { RabbitMQEventPublisherService } from '../../../services/rabbitmq-event-publisher.service';

import { RegisterUserUseCase } from '../../../application/use-case/register-user.use-case';
import { LoginUserUseCase } from '../../../application/use-case/login-user.use-case';
import { VerifyEmailUseCase } from '../../../application/use-case/verify-email.use-case';
import { ResendEmailVerificationUseCase } from '../../../application/use-case/resend-email-verification.use-case';
import { VerifyPhoneUseCase } from '../../../application/use-case/verify-phone.use-case';
import { ResendPhoneVerificationUseCase } from '../../../application/use-case/resend-phone-verification.use-case';
import { RequestPasswordResetUseCase } from '../../../application/use-case/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../../../application/use-case/reset-password.use-case';
import { ValidateTokenUseCase } from '../../../application/use-case/validate-token.use-case';
import { RefreshTokenUseCase } from '../../../application/use-case/refresh-token.use-case';
import { AssignRoleUseCase } from '../../../application/use-case/assign-role.use-case';
import { RemoveRoleUseCase } from '../../../application/use-case/remove-role.use-case';
import { GetUserPermissionsUseCase } from '../../../application/use-case/get-user-permissions.use-case';
import { CheckUserPermissionUseCase } from '../../../application/use-case/check-user-permission.use-case';

import { RegisterUserController } from '../controllers/register-user.controller';
import { LoginUserController } from '../controllers/login-user.controller';
import { VerifyEmailController } from '../controllers/verify-email.controller';
import { ResendEmailVerificationController } from '../controllers/resend-email-verification.controller';
import { VerifyPhoneController } from '../controllers/verify-phone.controller';
import { ResendPhoneVerificationController } from '../controllers/resend-phone-verification.controller';
import { RequestPasswordResetController } from '../controllers/request-password-reset.controller';
import { ResetPasswordController } from '../controllers/reset-password.controller';
import { ValidateTokenController } from '../controllers/validate-token.controller';
import { RefreshTokenController } from '../controllers/refresh-token.controller';
import { AssignRoleController } from '../controllers/assign-role.controller';
import { RemoveRoleController } from '../controllers/remove-role.controller';
import { GetUserPermissionsController } from '..//controllers/get-user-permissions.controller';
import { CheckUserPermissionController } from '../controllers/check-user-permission.controller';


const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();
const phoneVerificationRepository = new PhoneVerificationRepository();
const passwordResetTokenRepository = new PasswordResetTokenRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();

const passwordHasher = new BcryptPasswordHasherService();
const tokenGenerator = new JwtTokenGeneratorService();
const eventPublisher = new RabbitMQEventPublisherService();

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  emailVerificationRepository,
  passwordHasher,
  tokenGenerator,
  eventPublisher
);

const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  roleRepository,
  passwordHasher,
  tokenGenerator
);

const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  emailVerificationRepository,
  eventPublisher
);

const resendEmailVerificationUseCase = new ResendEmailVerificationUseCase(
  userRepository,
  emailVerificationRepository,
  tokenGenerator,
  eventPublisher
);

const verifyPhoneUseCase = new VerifyPhoneUseCase(
  userRepository,
  phoneVerificationRepository,
  eventPublisher
);

const resendPhoneVerificationUseCase = new ResendPhoneVerificationUseCase(
  userRepository,
  phoneVerificationRepository,
  tokenGenerator,
  eventPublisher
);

const requestPasswordResetUseCase = new RequestPasswordResetUseCase(
  userRepository,
  passwordResetTokenRepository,
  tokenGenerator,
  eventPublisher
);

const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordResetTokenRepository,
  passwordHasher,
  eventPublisher
);

const validateTokenUseCase = new ValidateTokenUseCase(
  tokenGenerator,
  userRepository
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  tokenGenerator,
  userRepository,
  roleRepository
);

const assignRoleUseCase = new AssignRoleUseCase(
  userRepository,
  roleRepository,
  eventPublisher
);

const removeRoleUseCase = new RemoveRoleUseCase(
  userRepository,
  roleRepository,
  eventPublisher
);

const getUserPermissionsUseCase = new GetUserPermissionsUseCase(
  permissionRepository
);

const checkUserPermissionUseCase = new CheckUserPermissionUseCase(
  permissionRepository
);


export const registerUserController = new RegisterUserController(registerUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase);
export const verifyEmailController = new VerifyEmailController(verifyEmailUseCase);
export const resendEmailVerificationController = new ResendEmailVerificationController(resendEmailVerificationUseCase);
export const verifyPhoneController = new VerifyPhoneController(verifyPhoneUseCase);
export const resendPhoneVerificationController = new ResendPhoneVerificationController(resendPhoneVerificationUseCase);
export const requestPasswordResetController = new RequestPasswordResetController(requestPasswordResetUseCase);
export const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
export const validateTokenController = new ValidateTokenController(validateTokenUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
export const assignRoleController = new AssignRoleController(assignRoleUseCase);
export const removeRoleController = new RemoveRoleController(removeRoleUseCase);
export const getUserPermissionsController = new GetUserPermissionsController(getUserPermissionsUseCase);
export const checkUserPermissionController = new CheckUserPermissionController(checkUserPermissionUseCase);


export { tokenGenerator, eventPublisher };