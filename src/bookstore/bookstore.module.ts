import { Module } from '@nestjs/common';
import { BookstoreService } from './bookstore.service';
import { BookstoreController } from './bookstore.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, Bookstore, BookstoreBook, ManagerBookstore } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Book,
      Bookstore,
      BookstoreBook,
      ManagerBookstore,
    ]),
  ],
  controllers: [BookstoreController],
  providers: [BookstoreService],
})
export class BookstoreModule {}
