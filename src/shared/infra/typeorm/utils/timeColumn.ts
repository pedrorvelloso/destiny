import { WithPrecisionColumnType } from 'typeorm/driver/types/ColumnTypes';

/**
 * timestamp doesnt work with SQLITE
 */
export const timestamp: WithPrecisionColumnType =
  process.env.NODE_ENV === 'test' ? 'time' : 'timestamp with time zone';
