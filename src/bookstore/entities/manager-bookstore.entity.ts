import { Entity, ManyToOne, Unique, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Bookstore } from './index';

@Entity({
  database: 'bookstore-manager',
  synchronize: true,
  name: 'manager_bookstore',
})
@Unique(['manager_id', 'bookstore_id'])
export class ManagerBookstore {
  @PrimaryColumn()
  manager_id: number;

  @PrimaryColumn()
  bookstore_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.id)
  @JoinColumn({ name: 'bookstore_id' })
  bookstore: Bookstore;
}
