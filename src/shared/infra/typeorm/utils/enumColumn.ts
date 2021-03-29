import { ColumnOptions } from 'typeorm';

/**
 * ENUM doesnt work with SQLITE
 */
export const enumColumn: ColumnOptions['type'] =
  process.env.NODE_ENV === 'test' ? 'text' : 'enum';
