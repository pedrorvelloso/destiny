import 'reflect-metadata';
import { closeConn, createConn } from './database';

/**
 * Create new database connection at the start
 */
beforeAll(() => {
  return createConn();
});

/**
 * Closes database connection when test cases ends
 */
afterAll(() => {
  return closeConn();
});
