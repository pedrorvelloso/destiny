import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import SearchGameService from '../SearchGameService';
import CreateGameService from '../CreateGameService';

let fakeGamesRepository: FakeGamesRepository;
let searchGame: SearchGameService;
let createGame: CreateGameService;

describe('SearchGame', () => {
  beforeEach(() => {
    fakeGamesRepository = new FakeGamesRepository();
    createGame = new CreateGameService(fakeGamesRepository);
    searchGame = new SearchGameService(fakeGamesRepository);
  });

  it('should be able to search games', async () => {
    await createGame.execute({ name: 'Game' });
    await createGame.execute({ name: 'Another One' });
    await createGame.execute({ name: 'Another Game' });

    const search1 = await searchGame.execute({ search: 'One' });
    expect(search1.length).toBe(1);

    const search2 = await searchGame.execute({ search: 'Game' });
    expect(search2.length).toBe(2);

    const search3 = await searchGame.execute({ search: 'Another' });
    expect(search3.length).toBe(2);
  });

  it('should max 5 results with/without search input', async () => {
    await createGame.execute({ name: 'Game' });
    await createGame.execute({ name: 'Another One' });
    await createGame.execute({ name: 'Another Game' });
    await createGame.execute({ name: 'Game 1' });
    await createGame.execute({ name: 'Another One 1' });
    await createGame.execute({ name: 'Another Game 1' });
    await createGame.execute({ name: 'Game 2' });
    await createGame.execute({ name: 'Game 3' });

    const search1 = await searchGame.execute();
    expect(search1.length).toBe(5);

    const search2 = await searchGame.execute({ search: 'Game' });
    expect(search2.length).toBe(5);
  });

  it('should max results with/without search input based on limit', async () => {
    await createGame.execute({ name: 'Game' });
    await createGame.execute({ name: 'Another One' });
    await createGame.execute({ name: 'Another Game' });
    await createGame.execute({ name: 'Game 1' });
    await createGame.execute({ name: 'Another One 1' });
    await createGame.execute({ name: 'Another Game 1' });
    await createGame.execute({ name: 'Game 2' });
    await createGame.execute({ name: 'Game 3' });

    const limit = 2;

    const search1 = await searchGame.execute({ limit });
    expect(search1.length).toBe(limit);

    const search2 = await searchGame.execute({ search: 'Game', limit });
    expect(search2.length).toBe(limit);
  });
});
