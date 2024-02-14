import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../auth/roles';

export type UserPayload = Pick<User, 'id' | 'email' | 'role'>;

@Entity({ synchronize: true, database: 'bookstore-manager', name: 'user' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ enum: Role })
  role: Role;

  @Column()
  password_hash: string;
}
