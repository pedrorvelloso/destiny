import {
  interfaces,
  controller,
  httpGet,
  response,
  httpPost,
  request,
  httpPatch,
  requestParam,
  queryParam,
} from 'inversify-express-utils';
import { Response, Request } from 'express';
import { classToClass } from 'class-transformer';

import { container } from '@shared/container';

import CreateEventService from '@modules/events/services/CreateEventService';
import ListEventsService from '@modules/events/services/ListEventsService';
import StartEventService from '@modules/events/services/StartEventService';
import EndEventService from '@modules/events/services/EndEventService';
import ShowEventTotalDonationsService from '@modules/events/services/ShowEventTotalDonationsService';
import ShowActiveEventService from '@modules/events/services/ShowActiveEventService';
import ListAllEventDonationsService from '@modules/events/services/ListAllEventDonationsService';
import ListIncentivesService from '@modules/events/services/ListIncentivesService';

import { createEventValidation, parameterIdValidation } from '../validations';

@controller('/events')
class EventsController implements interfaces.Controller {
  @httpGet('/')
  public async getEvents(@response() res: Response): Promise<Response> {
    const listEvents = container.resolve(ListEventsService);

    const events = await listEvents.execute();

    return res.json(events);
  }

  @httpGet('/active')
  public async getActiveEvent(@response() res: Response): Promise<Response> {
    const showActiveEvent = container.resolve(ShowActiveEventService);

    const event = await showActiveEvent.execute();

    return res.json(event);
  }

  @httpPost('/', createEventValidation)
  public async createEvent(
    @response() res: Response,
    @request() req: Request,
  ): Promise<Response> {
    const { name, description, starts_at, ends_at } = req.body;

    const createEvent = container.resolve(CreateEventService);

    const event = await createEvent.execute({
      name,
      description,
      starts_at,
      ends_at,
    });

    return res.json(event);
  }

  @httpPatch('/:id/start', parameterIdValidation)
  public async startEvent(
    @requestParam('id') event_id: number,
    @response() res: Response,
  ): Promise<Response> {
    const startEvent = container.resolve(StartEventService);

    const event = await startEvent.execute({ event_id });

    return res.json(event);
  }

  @httpPatch('/:id/end', parameterIdValidation)
  public async endEvent(
    @requestParam('id') event_id: number,
    @response() res: Response,
  ): Promise<Response> {
    const endEvent = container.resolve(EndEventService);

    const event = await endEvent.execute({ event_id });

    return res.json(event);
  }

  @httpGet('/:id/total', parameterIdValidation)
  public async eventTotal(
    @requestParam('id') event_id: number,
    @response() res: Response,
  ): Promise<Response> {
    const showEventTotalDonations = container.resolve(
      ShowEventTotalDonationsService,
    );

    const total = await showEventTotalDonations.execute({ event_id });

    return res.json({ total });
  }

  @httpGet('/:id/donations', parameterIdValidation)
  public async eventDonations(
    @requestParam('id') event_id: number,
    @response() res: Response,
    @queryParam('limit') limit: number,
    @queryParam('cursor') cursor?: number,
  ): Promise<Response> {
    const listAllEventDonations = container.resolve(
      ListAllEventDonationsService,
    );

    const donations = await listAllEventDonations.execute({
      event_id,
      pagination: { limit, cursor },
    });

    return res.json(donations);
  }

  @httpGet('/:id/incentives', parameterIdValidation)
  public async eventIncentives(
    @response() res: Response,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const listIncentives = container.resolve(ListIncentivesService);

    const incentives = await listIncentives.execute({
      event_id: id,
    });

    return res.json(classToClass(incentives));
  }
}

export default EventsController;
