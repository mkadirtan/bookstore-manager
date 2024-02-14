import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, Bookstore, BookstoreBook, ManagerBookstore } from './entities';
import { QueryFailedError, Repository } from 'typeorm';
import {
  CreateBookDto,
  CreateBookstoreDto,
  AddBookToBookstoreDto,
  GetBookstoreBooksDto,
  GetBookstoresByBookDto,
  RemoveBookFromBookstoreDto,
  AssignManagerDto,
  DismissManagerDto,
} from './dto/bookstore.dto';

@Injectable()
export class BookstoreService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Bookstore)
    private readonly bookstoreRepository: Repository<Bookstore>,
    @InjectRepository(BookstoreBook)
    private readonly bookstoreBooksRepository: Repository<BookstoreBook>,
    @InjectRepository(ManagerBookstore)
    private readonly managerBookstoreRepository: Repository<ManagerBookstore>,
  ) {}

  async getBookstores() {
    const bookstores = await this.bookstoreRepository.find({});
    return {
      bookstores,
    };
  }

  async getBookstoreBooks(dto: GetBookstoreBooksDto) {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .innerJoin(
        BookstoreBook,
        'bookstore_book',
        'bookstore_book.book_id = book.id AND bookstore_book.quantity > 0',
      )
      .innerJoin(
        Bookstore,
        'bookstore',
        'bookstore.id = bookstore_book.bookstore_id',
      )
      .select(['book.*', 'bookstore_book.quantity'])
      .where('bookstore.id = :id', { id: dto.bookstoreId })
      .getRawMany<Book & Pick<BookstoreBook, 'quantity'>>();

    return {
      books,
    };
  }

  async getBookstoresByBook(dto: GetBookstoresByBookDto) {
    const bookstores = await this.bookstoreRepository
      .createQueryBuilder('bookstore')
      .innerJoin(
        BookstoreBook,
        'bookstore_book',
        'bookstore_book.bookstore_id = bookstore.id AND bookstore_book.quantity > 0',
      )
      .innerJoin(Book, 'book', 'book.id = bookstore_book.book_id')
      .where('book.id = :id', { id: dto.bookId })
      .andWhere('bookstore_book.quantity > 0')
      .select(['bookstore.*', 'bookstore_book.quantity AS quantity'])
      .getRawMany<Pick<BookstoreBook, 'quantity'> & Bookstore>();

    return {
      bookstores,
    };
  }

  async addBookToBookstore(
    dto: AddBookToBookstoreDto,
  ): Promise<{ quantity: number }> {
    const { bookId, quantity, bookstoreId } = dto;

    let updatedQuantity: number;

    try {
      const result = await this.bookstoreBooksRepository
        .createQueryBuilder('bookstore_book')
        .insert()
        .values({
          bookstore_id: bookstoreId,
          book_id: bookId,
          quantity,
        })
        // this is deprecated but the new method ( orUpdate ) cannot perform this operation
        .onConflict(
          `(bookstore_id, book_id) DO UPDATE SET quantity = bookstore_book.quantity + :quantity`,
        )
        .setParameter('quantity', quantity)
        .returning(['quantity'])
        .execute();

      updatedQuantity = result.raw[0].quantity;
    } catch (e) {
      if (e instanceof QueryFailedError && e['detail'] && e['detail'] !== '') {
        if (e['detail'].endsWith('"book".')) {
          throw new NotFoundException('book not found');
        }

        if (e['detail'].endsWith('"bookstore".')) {
          throw new NotFoundException('bookstore not found');
        }
      }

      throw new InternalServerErrorException();
    }

    return { quantity: updatedQuantity };
  }

  async removeBookFromBookstore(dto: RemoveBookFromBookstoreDto) {
    const { bookId, quantity, bookstoreId } = dto;

    const result = await this.bookstoreBooksRepository
      .createQueryBuilder()
      .update(BookstoreBook)
      .set({ quantity: () => 'quantity - :removedQuantity' })
      .setParameter('removedQuantity', quantity)
      .where('bookstore_id = :bookstoreId', { bookstoreId })
      .andWhere('book_id = :bookId', { bookId })
      .andWhere('quantity >= :removedQuantity')
      .returning(['quantity'])
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        'either record not found, or insufficient quantity',
      );
    }

    const updatedQuantity = result.raw[0].quantity;
    return { quantity: updatedQuantity };
  }

  async createBookstore(dto: CreateBookstoreDto) {
    const bookstore = this.bookstoreRepository.create();
    bookstore.name = dto.name;
    await this.bookstoreRepository.save(bookstore);

    return { bookstore };
  }

  async createBook(dto: CreateBookDto) {
    const book = this.bookRepository.create();
    book.title = dto.title;
    await this.bookRepository.save(book);

    return {
      book,
    };
  }

  async assignManager(dto: AssignManagerDto) {
    try {
      await this.managerBookstoreRepository
        .createQueryBuilder('manager_bookstore')
        .insert()
        .values({
          bookstore_id: dto.bookstoreId,
          manager_id: dto.managerId,
        })
        .orIgnore()
        .execute();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async dismissManager(dto: DismissManagerDto) {
    try {
      await this.managerBookstoreRepository.delete({
        bookstore_id: dto.bookstoreId,
        manager_id: dto.managerId,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
