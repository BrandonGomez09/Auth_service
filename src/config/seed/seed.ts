require('dotenv').config();

import { AppDataSource } from '../data-source';
import { RoleSchema } from '../../database/schemas/role.schema';
import { SkillSchema } from '../../database/schemas/skill.schema';
import { UserSchema, UserStatus } from '../../database/schemas/user.schema';
import { UserRoleSchema } from '../../database/schemas/user-role.schema';
import { BcryptPasswordHasherService } from '../../services/bcrypt-password-hasher.service';

const seedRoles = async () => {
  const roleRepository = AppDataSource.getRepository(RoleSchema);
  const rolesToSeed = [
    { name: 'Voluntario', description: 'Rol básico para voluntarios.', level: 1 },
    { name: 'Admin_cocina', description: 'Administrador de cocina.', level: 2 },
    { name: 'Super_admin', description: 'Administrador total del sistema.', level: 3 },
  ];
  for (const roleData of rolesToSeed) {
    const roleExists = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!roleExists) {
      const newRole = roleRepository.create(roleData);
      await roleRepository.save(newRole);
    }
  }
};

const seedSuperAdmin = async () => {
  const userRepository = AppDataSource.getRepository(UserSchema);
  const roleRepository = AppDataSource.getRepository(RoleSchema);
  const userRoleRepository = AppDataSource.getRepository(UserRoleSchema);
  const passwordHasher = new BcryptPasswordHasherService();

  const SUPER_ADMIN_EMAIL = process.env.USER_ADMIN_EMAIL;
  const DEFAULT_PASSWORD = process.env.USER_ADMIN_PASSWORD;

  if (!SUPER_ADMIN_EMAIL || !DEFAULT_PASSWORD) {
    console.error(
      '❌ ERROR: Variables de entorno USER_ADMIN_EMAIL y USER_ADMIN_PASSWORD requeridas.'
    );
    return;
  }

  const superAdminRole = await roleRepository.findOne({ where: { name: 'Super_admin' } });
  if (!superAdminRole) {
    console.error('❌ Error: El rol Super_admin no existe. Ejecute seedRoles primero.');
    return;
  }

  let superAdminUser = await userRepository.findOne({ where: { email: SUPER_ADMIN_EMAIL } });

  if (!superAdminUser) {
    const hashedPassword = await passwordHasher.hash(DEFAULT_PASSWORD);

    const newUser = userRepository.create({
      email: SUPER_ADMIN_EMAIL,
      passwordHash: hashedPassword,
      names: 'Admin',
      firstLastName: 'Super',
      secondLastName: 'System',
      reputationScore: 100,
      status: UserStatus.ACTIVE,
      verifiedEmail: true,
      verifiedPhone: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    });

    superAdminUser = await userRepository.save(newUser);

    const userRole = userRoleRepository.create({
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
      assignedBy: superAdminUser.id,
      isPrimary: true,
    });

    await userRoleRepository.save(userRole);
  }
};

const seedSkills = async () => {
  const skillRepository = AppDataSource.getRepository(SkillSchema);
  const skillsToSeed = [
    'Cocinero',
    'Mesero',
    'Personal de limpieza',
    'Coordinador de eventos',
    'Ayudante de cocina',
    'Personal de apoyo (Multi-habilidades)',
  ];
  for (const skillName of skillsToSeed) {
    const skillExists = await skillRepository.findOne({ where: { name: skillName } });
    if (!skillExists) {
      const newSkill = skillRepository.create({
        name: skillName,
        description: '',
        isActive: true,
      });
      await skillRepository.save(newSkill);
    }
  }
};

export const runSeeds = async () => {
  try {
    await seedRoles();
    await seedSuperAdmin();
    await seedSkills();
  } catch (error) {
    console.error('❌ Error durante el sembrado de la base de datos:', error);
  }
};