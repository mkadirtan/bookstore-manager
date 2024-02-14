import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { BookstoreService } from './bookstore.service';
import {
  CreateBookDto,
  CreateBookstoreDto,
  AddBookToBookstoreDto,
  GetBookstoreBooksDto,
  GetBookstoresByBookDto,
  RemoveBookFromBookstoreDto,
  AssignManagerDto,
  DismissManagerDto,
  GetBookstoresResponse,
  GetBookstoreBooksResponse,
  GetBookstoresByBookResponse,
  AddBookToBookstoreResponse,
  RemoveBookFromBookstoreResponse,
  CreateBookstoreResponse,
  CreateBookResponse,
} from './dto/bookstore.dto';
import { validate } from 'class-validator';
import { Role, Roles } from '../auth/roles';
import { RolesGuard } from '../auth/roles.guard';
import { Manager } from './manager';
import { ManagerGuard } from './manager.guard';

@Controller('bookstore')
// order of the guards is important, ManagerGuard needs to be registered last
@UseGuards(RolesGuard, ManagerGuard)
export class BookstoreController {
  constructor(private readonly bookstoreService: BookstoreService) {}

  @Roles(Role.Owner, Role.Manager, Role.User)
  @Get('/')
  getBookstores(): Promise<GetBookstoresResponse> {
    return this.bookstoreService.getBookstores();
  }

  @Roles(Role.Owner, Role.Manager, Role.User)
  @Get('/:bookstoreId')
  async getBookstoreBooks(
    @Param('bookstoreId', new ParseIntPipe()) bookstoreId: number,
  ): Promise<GetBookstoreBooksResponse> {
    const dto = new GetBookstoreBooksDto();
    dto.bookstoreId = bookstoreId;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.bookstoreService.getBookstoreBooks(dto);
  }

  @Roles(Role.Owner, Role.Manager, Role.User)
  @Get('/book/:bookId')
  async getBookstoresByBook(
    @Param('bookId', new ParseIntPipe()) bookId: number,
  ): Promise<GetBookstoresByBookResponse> {
    const dto = new GetBookstoresByBookDto();
    dto.bookId = bookId;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.bookstoreService.getBookstoresByBook(dto);
  }

  @Roles(Role.Manager, Role.Owner)
  @Manager((req) => +req.params['bookstoreId'])
  @Post('/:bookstoreId/book/:bookId')
  async addBookToBookstore(
    @Body() body: AddBookToBookstoreDto,
    @Param('bookstoreId', new ParseIntPipe()) bookstoreId: number,
    @Param('bookId', new ParseIntPipe()) bookId: number,
  ): Promise<AddBookToBookstoreResponse> {
    const dto = new AddBookToBookstoreDto();
    dto.bookId = bookId;
    dto.bookstoreId = bookstoreId;
    dto.quantity = body.quantity;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.bookstoreService.addBookToBookstore(dto);
  }

  @Roles(Role.Manager, Role.Owner)
  @Manager((req) => +req.params['bookstoreId'])
  @Delete('/:bookstoreId/book/:bookId')
  async removeBookFromBookstore(
    @Body() body: RemoveBookFromBookstoreDto,
    @Param('bookstoreId', new ParseIntPipe()) bookstoreId: number,
    @Param('bookId', new ParseIntPipe()) bookId: number,
  ): Promise<RemoveBookFromBookstoreResponse> {
    const dto = new RemoveBookFromBookstoreDto();
    dto.bookId = bookId;
    dto.bookstoreId = bookstoreId;
    dto.quantity = body.quantity;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.bookstoreService.removeBookFromBookstore(dto);
  }

  @Roles(Role.Owner)
  @Post('/')
  createBookstore(
    @Body(new ValidationPipe()) body: CreateBookstoreDto,
  ): Promise<CreateBookstoreResponse> {
    return this.bookstoreService.createBookstore(body);
  }

  @Roles(Role.Owner)
  @Post('/book')
  createBook(
    @Body(new ValidationPipe()) body: CreateBookDto,
  ): Promise<CreateBookResponse> {
    return this.bookstoreService.createBook(body);
  }

  @Roles(Role.Owner)
  @Put('/assign-manager')
  assignManager(
    @Body(new ValidationPipe()) body: AssignManagerDto,
  ): Promise<void> {
    return this.bookstoreService.assignManager(body);
  }

  @Roles(Role.Owner)
  @Delete('/dismiss-manager')
  dismissManager(
    @Body(new ValidationPipe()) body: DismissManagerDto,
  ): Promise<void> {
    return this.bookstoreService.dismissManager(body);
  }
}
