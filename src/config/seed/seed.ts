require('dotenv').config();

import { AppDataSource } from '../data-source';
import { RoleSchema } from '../../database/schemas/role.schema';
import { SkillSchema } from '../../database/schemas/skill.schema';
import { UserSchema, UserStatus } from '../../database/schemas/user.schema';
import { UserRoleSchema } from '../../database/schemas/user-role.schema';
import { BcryptPasswordHasherService } from '../../services/bcrypt-password-hasher.service';
import bcrypt from 'bcrypt';

const seedRoles = async () => {
  const roleRepository = AppDataSource.getRepository(RoleSchema);

  const rolesToSeed = [
    { name: 'Voluntario', description: 'Rol básico para voluntarios.', level: 1 },
    { name: 'Admin_cocina', description: 'Administrador de cocina.', level: 2 },
    { name: 'Super_admin', description: 'Administrador total del sistema.', level: 3 },
  ];

  for (const roleData of rolesToSeed) {
    const exists = await roleRepository.findOne({ where: { name: roleData.name } });

    if (!exists) {
      await roleRepository.save(roleRepository.create(roleData));
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
    console.error('⚠ No se configuraron las variables USER_ADMIN_EMAIL o USER_ADMIN_PASSWORD.');
    return;
  }

  const superAdminRole = await roleRepository.findOne({ where: { name: 'Super_admin' } });

  if (!superAdminRole) {
    console.error('⚠ No se encontró el rol Super_admin. Primero ejecutar seedRoles.');
    return;
  }

  let user = await userRepository.findOne({ where: { email: SUPER_ADMIN_EMAIL } });

  if (!user) {
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

    user = await userRepository.save(newUser);

    await userRoleRepository.save(
      userRoleRepository.create({
        userId: user.id,
        roleId: superAdminRole.id,
        assignedBy: user.id,
        isPrimary: true,
      })
    );

    console.log('👑 Usuario Super Admin creado correctamente.');
    return;
  }

  const passwordMatch = await bcrypt.compare(DEFAULT_PASSWORD, user.passwordHash);

  if (!passwordMatch) {
    const newHash = await passwordHasher.hash(DEFAULT_PASSWORD);
    user.passwordHash = newHash;
    await userRepository.save(user);

    console.log('🔁 Password de Super Admin actualizado exitosamente.');
    return;
  }

  console.log('✔ Usuario Super Admin existente con credenciales válidas.');
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
    console.log('🌱 Ejecutando seeds iniciales...');
    await seedRoles();
    await seedSuperAdmin();
    await seedSkills();
    console.log('✅ Seeds ejecutados correctamente.');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  }
};