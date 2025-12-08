import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { firebaseAdmin } from '../../config/firebase.config'; 
import { UserStatus } from '../../domain/entities/user.entity';

export class GoogleLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  async execute(googleToken: string) {
    let decodedToken;
    try {
      // Intentamos verificar el token con Firebase
      decodedToken = await firebaseAdmin.auth().verifyIdToken(googleToken);
    } catch (error: any) {
      // --- IMPORTANTE: Logs ANTES de lanzar el error para poder verlos ---
      console.error("❌ ERROR FIREBASE DETALLADO:", error); 
      console.error("🔍 Token recibido (inicio):", googleToken ? googleToken.substring(0, 50) + "..." : "NULL");
      // ------------------------------------------------------------------

      throw { http_status: 401, message: `Token de Google inválido o expirado: ${error.message}` };
    }

    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      throw { http_status: 400, message: 'La cuenta de Google no tiene un email asociado' };
    }

    let user = await this.userRepository.findByEmail(email);

    // --- ESCENARIO A: USUARIO NUEVO (NO EXISTE) ---
    if (!user) {
      return {
        isNewUser: true,
        prefillData: {
          email: email,
          names: name || '', 
          googleUserId: uid,
          imageProfile: picture
        }
      };
    }

    // --- ESCENARIO B: USUARIO YA EXISTE (LOGIN) ---
    if (!user.googleUserId) {
      user.googleUserId = uid;
      if (!user.imageProfile && picture) {
        user.imageProfile = picture;
      }
      await this.userRepository.update(user);
    }

    if (user.status === UserStatus.SUSPENDED) throw { http_status: 403, message: 'Cuenta suspendida' };
    if (user.status === UserStatus.INACTIVE) throw { http_status: 403, message: 'Cuenta inactiva' };

    const roles = await this.roleRepository.getUserRoles(user.id);
    const roleNames = roles.map((role) => role.name);
    
    const accessToken = this.tokenGenerator.generateAccessToken(
      user.id,
      user.email,
      roleNames,
      user.stateId ?? null,
      user.municipalityId ?? null
    );
    const refreshToken = this.tokenGenerator.generateRefreshToken(user.id);

    return {
      isNewUser: false, 
      loginData: {
        user: {
          id: user.id,
          email: user.email,
          names: user.names,
          fullName: `${user.names} ${user.firstLastName} ${user.secondLastName}`,
          status: user.status,
          verifiedEmail: user.verifiedEmail,
          verifiedPhone: user.verifiedPhone,
          imageProfile: user.imageProfile
        },
        accessToken,
        refreshToken,
        roles: roleNames
      }
    };
  }
}