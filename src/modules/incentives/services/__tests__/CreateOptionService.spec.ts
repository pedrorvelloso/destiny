import FakeIncentiveOptionsRepository from '@modules/incentives/repositories/fakes/FakeIncentiveOptionsRepository';
import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import Incentive, {
  IIncentiveType,
} from '@modules/incentives/infra/typeorm/entities/Incentive';
import ApplicationError from '@shared/errors/ApplicationError';
import CreateOptionService from '../CreateOptionService';

let fakeIncentiveOptionsRepository: FakeIncentiveOptionsRepository;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeUsersRepository: FakeUsersRepository;
let createOption: CreateOptionService;
let user: User;
let incentive: Incentive;

describe('CreateOption', () => {
  beforeEach(async () => {
    fakeIncentiveOptionsRepository = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createOption = new CreateOptionService(
      fakeIncentiveOptionsRepository,
      fakeIncentivesRepository,
      fakeUsersRepository,
    );

    user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: 'password',
    });

    incentive = await fakeIncentivesRepository.create({
      name: 'Cool Incentive',
      description: 'Cool Incentive Description',
      created_by: user.id,
      enable_option: true,
      event_id: 1,
      game_id: 1,
      type: IIncentiveType.OPTION,
    });
  });

  it('should be able to create new option for incentive (option w/ options enabled)', async () => {
    const option = await createOption.execute({
      name: 'New Option',
      created_by: user.id,
      incentive_id: incentive.id,
    });

    expect(option).toHaveProperty('id');
    expect(option.name).toBe('New Option');
  });

  it('should not be able to create new option if its a goal incentive', async () => {
    const goalIncentive = await fakeIncentivesRepository.create({
      name: 'Cool Incentive Goal',
      description: 'Cool Incentive Description',
      created_by: user.id,
      enable_option: false,
      event_id: 1,
      game_id: 1,
      type: IIncentiveType.GOAL,
      goal: 1000,
    });

    await expect(
      createOption.execute({
        name: 'New Option',
        created_by: user.id,
        incentive_id: goalIncentive.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create new option if options is disabled', async () => {
    const optionsOffIncentive = await fakeIncentivesRepository.create({
      name: 'Cool Incentive',
      description: 'Cool Incentive Description',
      created_by: user.id,
      enable_option: false,
      event_id: 1,
      game_id: 1,
      type: IIncentiveType.OPTION,
    });

    await expect(
      createOption.execute({
        name: 'New Option',
        created_by: user.id,
        incentive_id: optionsOffIncentive.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create option if incentive does not exists', async () => {
    await expect(
      createOption.execute({
        name: 'New Option',
        created_by: user.id,
        incentive_id: 0,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create option if create user does not exists', async () => {
    await expect(
      createOption.execute({
        name: 'New Option',
        created_by: 'bad',
        incentive_id: incentive.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
