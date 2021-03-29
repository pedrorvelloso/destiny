import { apiTest } from '../utils/api';
import { clearDatabase, closeConn, createConn } from '../utils/database';

describe('auth integration', () => {
  beforeAll(() => {
    return createConn();
  });

  beforeEach(() => {
    return clearDatabase();
  });

  afterAll(() => {
    return closeConn();
  });

  it('should create new user', async () => {
    const response = await apiTest
      .post('/users')
      .send({ name: 'user', email: 'user@email.com', password: 'password' });

    expect(response.status).toBe(200);
  });

  it('should fail to create an user if email already exists', async () => {
    await apiTest
      .post('/users')
      .send({ name: 'user', email: 'user@email.com', password: 'password' });

    const response = await apiTest
      .post('/users')
      .send({ name: 'user', email: 'user@email.com', password: 'password' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-mail address already used');
    expect(response.body.status).toBe('error');
  });

  it('should be able to login', async () => {
    await apiTest
      .post('/users')
      .send({ name: 'user', email: 'user@email.com', password: 'password' });

    const response = await apiTest
      .post('/auth')
      .send({ email: 'user@email.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to login with incorrect/non-existing user', async () => {
    const response = await apiTest
      .post('/auth')
      .send({ email: 'user@email.com', password: 'password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect email/password combination');
  });
});
