import { WithPrecisionColumnType } from 'typeorm/driver/types/ColumnTypes';

export const timestamp: WithPrecisionColumnType =
  process.env.NODE_ENV === 'test' ? 'time' : 'timestamp with time zone';
