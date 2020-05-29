import Game from '@modules/games/infra/typeorm/entities/Game';
import ICreateGameDTO from '@modules/games/dtos/ICreateGameDTO';
import ISearchGameDTO from '@modules/games/dtos/ISearchGameDTO';
import IGamesRepository from '../IGamesRepository';

class FakeGamesRepository implements IGamesRepository {
  private games: Game[] = [];

  public async findById(id: number): Promise<Game | undefined> {
    return this.games.find(game => game.id === id);
  }

  public async findByName(name: string): Promise<Game | undefined> {
    return this.games.find(game => game.name === name);
  }

  public async search({ input, limit }: ISearchGameDTO): Promise<Game[]> {
    const findGames = (input
      ? this.games.filter(game => game.name.includes(input))
      : [...this.games]
    ).splice(0, limit || 5);

    return findGames;
  }

  public async create(gameData: ICreateGameDTO): Promise<Game> {
    const game = new Game();

    Object.assign(game, { id: this.games.length + 1, active: false }, gameData);

    this.games.push(game);

    return game;
  }
}

export default FakeGamesRepository;
