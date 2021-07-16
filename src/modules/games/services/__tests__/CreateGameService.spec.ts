import ApplicationError from '@shared/errors/ApplicationError';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import CreateGameService from '../CreateGameService';

let fakeGamesRepository: FakeGamesRepository;
let createGame: CreateGameService;

describe('CreateGame', () => {
  beforeEach(() => {
    fakeGamesRepository = new FakeGamesRepository();
    createGame = new CreateGameService(fakeGamesRepository);
  });

  it('should be able to create game', async () => {
    const game = await createGame.execute({
      name: 'Super Game',
    });

    expect(game).toHaveProperty('id');
    expect(game).toHaveProperty('name');
  });

  it('should not be able to create game with same name', async () => {
    await createGame.execute({
      name: 'Super Game',
    });

    await expect(
      createGame.execute({
        name: 'Super Game',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
