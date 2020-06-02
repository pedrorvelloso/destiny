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
import CreateGoalIncentiveService from '../CreateGoalIncentiveService';

let fakeUsersRepository: FakeUsersRepository;
let fakeEventsRepository: FakeEventsRepository;
let fakeGamesRepository: FakeGamesRepository;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeIncentiveOptions: FakeIncentiveOptionsRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let createEvent: CreateEventService;
let createGame: CreateGameService;
let createGoalIncentive: CreateGoalIncentiveService;
let user: User;
let event: Event;
let game: Game;

describe('CreateGoalIncentive', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEventsRepository = new FakeEventsRepository();
    fakeGamesRepository = new FakeGamesRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeIncentiveOptions = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    createEvent = new CreateEventService(fakeEventsRepository);
    createGame = new CreateGameService(fakeGamesRepository);
    createGoalIncentive = new CreateGoalIncentiveService(
      fakeIncentivesRepository,
      fakeUsersRepository,
      fakeEventsRepository,
      fakeGamesRepository,
      fakeIncentiveOptions,
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
    const incentive = await createGoalIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
      goal: 1000,
    });

    expect(incentive).toHaveProperty('name');
    expect(incentive).toHaveProperty('description');
    expect(incentive).toHaveProperty('enable_option');
    expect(incentive.type).toBe('goal');
    expect(incentive.created_by).toBe(user.id);
    expect(incentive.game_id).toBe(game.id);
    expect(incentive.event_id).toBe(event.id);

    expect(incentive.options.length).toBe(1);
  });

  it('should not be able to create option incentive if user/event/game doesnt exists', async () => {
    await expect(
      createGoalIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        event_id: -1,
        game_id: game.id,
        user_id: user.id,
        goal: 1000,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      createGoalIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        event_id: event.id,
        game_id: -1,
        user_id: user.id,
        goal: 1000,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      createGoalIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        event_id: event.id,
        game_id: game.id,
        user_id: 'bad',
        goal: 1000,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
  it('should not be able to create option incentive with same name as another incentive', async () => {
    await createGoalIncentive.execute({
      name: 'Cool incentive',
      description: 'Super cool incentive',
      event_id: event.id,
      game_id: game.id,
      user_id: user.id,
      goal: 1000,
    });

    await expect(
      createGoalIncentive.execute({
        name: 'Cool incentive',
        description: 'Super cool incentive',
        event_id: event.id,
        game_id: game.id,
        user_id: user.id,
        goal: 1000,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
