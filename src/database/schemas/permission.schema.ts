import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Permissions')
export class PermissionSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  module!: string;

  @Column({ type: 'varchar', length: 255 })
  action!: string;

  @Column({ type: 'varchar', length: 255 })
  resource!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;
}
