import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import Event from '@modules/events/infra/typeorm/entities/Event';
import { IIncentiveType } from '@modules/incentives/infra/typeorm/entities/Incentive';
import ApplicationError from '@shared/errors/ApplicationError';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import Game from '@modules/games/infra/typeorm/entities/Game';
import ShowIncentiveByGameIdService from '../ShowIncentivesByGameIdService';

let showIncentivesByGameId: ShowIncentiveByGameIdService;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeEventsRepository: FakeEventsRepository;
let fakeGamesRepository: FakeGamesRepository;
let event: Event;
let game: Game;

describe('ShowIncentivesByGameId', () => {
  beforeEach(async () => {
    fakeIncentivesRepository = new FakeIncentivesRepository();
    fakeEventsRepository = new FakeEventsRepository();
    fakeGamesRepository = new FakeGamesRepository();
    showIncentivesByGameId = new ShowIncentiveByGameIdService(
      fakeIncentivesRepository,
      fakeEventsRepository,
      fakeGamesRepository,
    );

    event = await fakeEventsRepository.create({
      name: 'Awesome Event',
      description: 'Amazing description',
      ends_at: new Date(),
      starts_at: new Date(),
    });
    event.active = true;
    await fakeEventsRepository.save(event);

    game = await fakeGamesRepository.create({ name: 'Game' });

    await fakeIncentivesRepository.create({
      created_by: 'pseudo-user',
      name: 'Incentive 1',
      description: 'Description',
      enable_option: false,
      event_id: event.id,
      game_id: game.id,
      type: IIncentiveType.GOAL,
      goal: 2000,
    });
    await fakeIncentivesRepository.create({
      created_by: 'pseudo-user',
      name: 'Incentive 2',
      description: 'Description',
      enable_option: false,
      event_id: event.id,
      game_id: game.id,
      type: IIncentiveType.GOAL,
      goal: 2000,
    });
    await fakeIncentivesRepository.create({
      created_by: 'pseudo-user',
      name: 'Incentive 3',
      description: 'Description',
      enable_option: false,
      event_id: event.id,
      game_id: game.id,
      type: IIncentiveType.GOAL,
      goal: 2000,
    });
  });

  it('should be able to show incentives by game id', async () => {
    const incentives = await showIncentivesByGameId.execute({
      game_id: game.id,
    });

    expect(incentives.length).toBe(3);
  });

  it('should not be able to show incentives when there is no active events', async () => {
    event.active = false;
    await fakeEventsRepository.save(event);

    await expect(
      showIncentivesByGameId.execute({ game_id: game.id }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to show incentives when game does not exists', async () => {
    await expect(
      showIncentivesByGameId.execute({ game_id: 2 }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
