import { ContainerModule, interfaces } from 'inversify';
import EventsRepository from '../infra/typeorm/repositories/EventsRepository';
import IEventsRepository from '../repositories/IEventsRepository';

const eventsContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IEventsRepository>('EventsRepository')
      .to(EventsRepository)
      .inSingletonScope();
  },
);

export default eventsContainer;
