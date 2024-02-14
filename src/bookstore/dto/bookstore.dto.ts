import { IsInt, Min, IsNotEmpty, IsString } from 'class-validator';
import { Book, Bookstore, BookstoreBook } from '../entities';
import { ApiHideProperty, IntersectionType, PickType } from '@nestjs/swagger';

class Quantity extends PickType(BookstoreBook, ['quantity']) {}

class BookWithQuantity extends IntersectionType(Book, Quantity) {}

class BookstoreWithQuantity extends IntersectionType(Bookstore, Quantity) {}

export class GetBookstoresResponse {
  bookstores: Bookstore[];
}

export class GetBookstoreBooksDto {
  @IsInt()
  @Min(0)
  bookstoreId: number;
}

export class GetBookstoreBooksResponse {
  books: BookWithQuantity[];
}

export class GetBookstoresByBookDto {
  @IsInt()
  @Min(0)
  bookId: number;
}

export class GetBookstoresByBookResponse {
  bookstores: BookstoreWithQuantity[];
}

export class AddBookToBookstoreDto {
  @IsInt()
  @Min(0)
  @ApiHideProperty()
  bookId: number;

  @IsInt()
  @Min(0)
  @ApiHideProperty()
  bookstoreId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class AddBookToBookstoreResponse {
  quantity: number;
}

export class RemoveBookFromBookstoreDto {
  @IsInt()
  @Min(0)
  @ApiHideProperty()
  bookId: number;

  @IsInt()
  @Min(0)
  @ApiHideProperty()
  bookstoreId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class RemoveBookFromBookstoreResponse {
  quantity: number;
}

export class CreateBookstoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateBookstoreResponse {
  bookstore: Bookstore;
}

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class CreateBookResponse {
  book: Book;
}

export class AssignManagerDto {
  @IsInt()
  @IsNotEmpty()
  managerId: number;

  @IsInt()
  @IsNotEmpty()
  bookstoreId: number;
}

export class DismissManagerDto {
  @IsInt()
  @IsNotEmpty()
  managerId: number;

  @IsInt()
  @IsNotEmpty()
  bookstoreId: number;
}
