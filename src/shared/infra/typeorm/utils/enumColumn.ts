import { ColumnOptions } from 'typeorm';

export const enumColumn: ColumnOptions['type'] =
  process.env.NODE_ENV === 'test' ? 'text' : 'enum';
