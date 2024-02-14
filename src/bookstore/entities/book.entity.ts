import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'bookstore-manager', name: 'book', synchronize: true })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
