import ApplicationError from '@shared/errors/ApplicationError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create user', async () => {
    const hashPassword = jest.spyOn(fakeHashProvider, 'generate');

    const user = await createUser.execute({
      email: 'admin@example.com',
      name: 'Admin',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('admin@example.com');
    expect(user.name).toBe('Admin');

    expect(hashPassword).toBeCalledWith('123456');
  });

  it('should not be able to create two users with same email', async () => {
    await createUser.execute({
      email: 'admin@example.com',
      name: 'Admin',
      password: '123456',
    });

    await expect(
      createUser.execute({
        email: 'admin@example.com',
        name: 'Admin',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
