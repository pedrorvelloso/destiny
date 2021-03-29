import { ColumnType } from 'typeorm';

/**
 * timestamp doesnt work with SQLITE
 */
export const timestamp: ColumnType =
  process.env.NODE_ENV === 'test' ? 'time' : 'timestamp with time zone';
