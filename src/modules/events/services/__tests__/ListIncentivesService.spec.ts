import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import FakeIncentiveOptionsRepository from '@modules/incentives/repositories/fakes/FakeIncentiveOptionsRepository';
import Incentive, {
  IIncentiveType,
} from '@modules/incentives/infra/typeorm/entities/Incentive';
import IncentiveOption from '@modules/incentives/infra/typeorm/entities/IncentiveOption';
import ApplicationError from '@shared/errors/ApplicationError';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ListIncentivesService from '../ListIncentivesService';

let listIncentive: ListIncentivesService;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeIncentiveOptionsRepository: FakeIncentiveOptionsRepository;
let fakeEventsRepository: FakeEventsRepository;
let initialIncentive: Incentive;
let option1: IncentiveOption;
let option2: IncentiveOption;

describe('ListIncentives', () => {
  beforeEach(async () => {
    fakeIncentiveOptionsRepository = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository(
      fakeIncentiveOptionsRepository,
    );
    fakeEventsRepository = new FakeEventsRepository();

    const event = await fakeEventsRepository.create({
      name: 'Event',
      description: 'Description',
      ends_at: new Date(),
      starts_at: new Date(),
    });

    initialIncentive = await fakeIncentivesRepository.create({
      created_by: 'user',
      description: 'Incentive Description',
      enable_option: true,
      event_id: event.id,
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

    const incentive2 = await fakeIncentivesRepository.create({
      created_by: 'user',
      description: 'Incentive Description 2',
      enable_option: true,
      event_id: 1,
      game_id: 1,
      name: 'Super Cool Incentive 2',
      type: IIncentiveType.OPTION,
    });

    const op1Incentive2 = await fakeIncentiveOptionsRepository.create({
      name: 'Option 1',
      created_by: 'user',
      incentive_id: incentive2.id,
    });
    const op2Incentive2 = await fakeIncentiveOptionsRepository.create({
      name: 'Option 2',
      created_by: 'user',
      incentive_id: incentive2.id,
    });
    const op3Incentive2 = await fakeIncentiveOptionsRepository.create({
      name: 'Option 2',
      created_by: 'user',
      incentive_id: incentive2.id,
    });

    op1Incentive2.total = 258;
    op2Incentive2.total = 3500;
    op3Incentive2.total = 800;

    await fakeIncentiveOptionsRepository.save(op1Incentive2);
    await fakeIncentiveOptionsRepository.save(op2Incentive2);
    await fakeIncentiveOptionsRepository.save(op3Incentive2);

    listIncentive = new ListIncentivesService(
      fakeIncentivesRepository,
      fakeEventsRepository,
    );
  });

  it('should be able to list incentives with sorted options', async () => {
    const incentives = await listIncentive.execute({
      event_id: 1,
    });

    expect(incentives.length).toBe(2);
    expect(incentives[0].options[0].total).toBe(option2.total);
    expect(incentives[1].options[0].total).toBe(3500);
  });

  it('should not be able to list incentives if event does not exists', async () => {
    await expect(listIncentive.execute({ event_id: 0 })).rejects.toBeInstanceOf(
      ApplicationError,
    );
  });
});
