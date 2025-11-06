import { AppDataSource } from '../data-source';
import { RoleSchema } from '../../database/schemas/role.schema';
import { SkillSchema } from '../../database/schemas/skill.schema';

const seedRoles = async () => {
  const roleRepository = AppDataSource.getRepository(RoleSchema);

  const rolesToSeed = [
    { name: 'Voluntario', description: 'Rol básico para voluntarios.', level: 1 },
    { name: 'Admin_cocina', description: 'Administrador de cocina.', level: 2 },
    { name: 'Super_admin', description: 'Administrador total del sistema.', level: 3 },
  ];

  for (const roleData of rolesToSeed) {
    const roleExists = await roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (!roleExists) {
      console.log(`Creando rol: ${roleData.name}`);
      const newRole = roleRepository.create(roleData);
      await roleRepository.save(newRole);
    }
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
    const skillExists = await skillRepository.findOne({
      where: { name: skillName },
    });

    if (!skillExists) {
      console.log(`Creando habilidad: ${skillName}`);
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
    await seedSkills();
  } catch (error) {
    console.error('❌ Error durante el sembrado de la base de datos:', error);
  }
};