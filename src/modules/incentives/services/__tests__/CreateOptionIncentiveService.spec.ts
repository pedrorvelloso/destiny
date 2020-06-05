import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateEventService from '@modules/events/services/CreateEventService';
import CreateGameService from '@modules/games/services/CreateGameService';
import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import Event from '@modules/events/infra/typeorm/entities/Event';
import Game from '@modules/games/infra/typeorm/entities/Game';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ApplicationError from '@shared/errors/ApplicationError';
import FakeIncentiveOptionsRepository from '@modules/incentives/repositories/fakes/FakeIncentiveOptionsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { INCENTIVES_LIST } from '@shared/container/providers/CacheProvider/utils/prefixes';
import CreateOptionIncentiveService from '../CreateOptionIncentiveService';

let fakeUsersRepository: FakeUsersRepository;
let fakeEventsRepository: FakeEventsRepository;
let fakeGamesRepository: FakeGamesRepository;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeIncentiveOptions: FakeIncentiveOptionsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let createEvent: CreateEventService;
let createGame: CreateGameService;
let createOptionIncentive: CreateOptionIncentiveService;
let user: User;
let event: Event;
let game: Game;

describe('CreateOptionIncentive', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEventsRepository = new FakeEventsRepository();
    fakeGamesRepository = new FakeGamesRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeIncentiveOptions = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    createEvent = new CreateEventService(fakeEventsRepository);
    createGame = new CreateGameService(fakeGamesRepository);
    createOptionIncentive = new CreateOptionIncentiveService(
      fakeIncentivesRepository,
      fakeUsersRepository,
      fakeEventsRepository,
      fakeGamesRepository,
      fakeIncentiveOptions,
      fakeCacheProvider,
    );
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });

    user = await createUser.execute({
      name: 'User',
      email: 'email@email.com',
      password: 'password',
    });
    event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });
    game = await createGame.execute({
      name: 'Super Game',
    });
  });

  it('should be able to create option incentive', async () => {
    const incentive = await createOptionIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      enable_option: true,
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
    });

    expect(incentive).toHaveProperty('name');
    expect(incentive).toHaveProperty('description');
    expect(incentive).toHaveProperty('enable_option');
    expect(incentive.type).toBe('option');
    expect(incentive.created_by).toBe(user.id);
    expect(incentive.game_id).toBe(game.id);
    expect(incentive.event_id).toBe(event.id);
  });

  it('should be able to create option incentive w/ default options', async () => {
    const incentive = await createOptionIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      enable_option: true,
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
      default_options: ['Option 1', 'Option 2'],
    });

    expect(incentive.options.length).toBe(2);
  });

  it('should invalidate incentives list cache', async () => {
    const invalidate = jest.spyOn(fakeCacheProvider, 'invalidate');
    expect(invalidate).toBeCalledTimes(0);

    await createOptionIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      enable_option: true,
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
      default_options: ['Option 1', 'Option 2'],
    });

    expect(invalidate).toBeCalledTimes(1);
    expect(invalidate).toBeCalledWith(`${INCENTIVES_LIST}:*`);
  });

  it('should not be able to create option incentive if user/event/game doesnt exists', async () => {
    await expect(
      createOptionIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        enable_option: true,
        event_id: -1,
        game_id: game.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      createOptionIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        enable_option: true,
        event_id: event.id,
        game_id: -1,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      createOptionIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        enable_option: true,
        event_id: event.id,
        game_id: game.id,
        user_id: 'bad',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
  it('should not be able to create option incentive with same name as another incentive', async () => {
    await createOptionIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      enable_option: true,
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
    });

    await expect(
      createOptionIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        enable_option: true,
        event_id: event.id,
        game_id: game.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
