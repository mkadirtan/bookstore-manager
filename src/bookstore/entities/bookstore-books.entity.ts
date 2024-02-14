import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Bookstore } from './bookstore.entity';

@Entity({
  database: 'bookstore-manager',
  synchronize: true,
  name: 'bookstore_book',
})
@Unique(['book_id', 'bookstore_id'])
export class BookstoreBook {
  @PrimaryColumn()
  book_id: number;

  @PrimaryColumn()
  bookstore_id: number;

  @Column({ type: 'smallint' })
  quantity: number;

  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.id)
  @JoinColumn({ name: 'bookstore_id' })
  bookstore: Bookstore;
}
