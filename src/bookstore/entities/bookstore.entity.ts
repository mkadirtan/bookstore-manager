import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'bookstore-manager', synchronize: true, name: 'bookstore' })
export class Bookstore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
