import { Connection, createConnection, getConnection } from 'typeorm';

export const createConn = (): Promise<Connection> => createConnection();

export const clearDatabase = async (): Promise<void> => {
  const conn = getConnection();
  await conn.dropDatabase();
  return conn.synchronize();
};

export const closeConn = (): Promise<void> => {
  const conn = getConnection();
  return conn.close();
};
