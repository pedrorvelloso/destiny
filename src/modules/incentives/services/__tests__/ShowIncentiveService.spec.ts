import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import FakeIncentiveOptionsRepository from '@modules/incentives/repositories/fakes/FakeIncentiveOptionsRepository';
import Incentive, {
  IIncentiveType,
} from '@modules/incentives/infra/typeorm/entities/Incentive';
import IncentiveOption from '@modules/incentives/infra/typeorm/entities/IncentiveOption';
import ApplicationError from '@shared/errors/ApplicationError';
import ShowIncentiveService from '../ShowIncentiveService';

let showIncentive: ShowIncentiveService;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeIncentiveOptionsRepository: FakeIncentiveOptionsRepository;
let initialIncentive: Incentive;
let option1: IncentiveOption;
let option2: IncentiveOption;

describe('ShowIncentiveService', () => {
  beforeEach(async () => {
    fakeIncentiveOptionsRepository = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository(
      fakeIncentiveOptionsRepository,
    );

    initialIncentive = await fakeIncentivesRepository.create({
      created_by: 'user',
      description: 'Incentive Description',
      enable_option: true,
      event_id: 1,
      game_id: 1,
      name: 'Super Cool Incentive',
      type: IIncentiveType.OPTION,
    });

    option1 = await fakeIncentiveOptionsRepository.create({
      name: 'Option 1',
      created_by: 'user',
      incentive_id: initialIncentive.id,
    });
    option2 = await fakeIncentiveOptionsRepository.create({
      name: 'Option 2',
      created_by: 'user',
      incentive_id: initialIncentive.id,
    });

    option1.total = 100;
    option2.total = 250;

    await fakeIncentiveOptionsRepository.save(option1);
    await fakeIncentiveOptionsRepository.save(option2);

    showIncentive = new ShowIncentiveService(fakeIncentivesRepository);
  });

  it('should be able to list incentive with sorted options', async () => {
    const incentive = await showIncentive.execute({
      incentive_id: initialIncentive.id,
    });

    expect(incentive.options.length).toBe(2);
    expect(incentive.options[0].total).toBe(option2.total);
  });

  it('should not be able to list non-existing incentive', async () => {
    await expect(
      showIncentive.execute({
        incentive_id: -1,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
