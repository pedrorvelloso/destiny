import {
  interfaces,
  controller,
  httpGet,
  response,
  httpPost,
  request,
  httpPatch,
  requestParam,
} from 'inversify-express-utils';
import { Response, Request } from 'express';

import { container } from '@shared/container';

import CreateEventService from '@modules/events/services/CreateEventService';
import ListEventsService from '@modules/events/services/ListEventsService';
import StartEventService from '@modules/events/services/StartEventService';
import EndEventService from '@modules/events/services/EndEventService';
import ShowEventTotalDonationsService from '@modules/events/services/ShowEventTotalDonationsService';

import { createEventValidation, parameterIdValidation } from '../validations';

@controller('/events')
class EventsController implements interfaces.Controller {
  @httpGet('/')
  public async getEvents(@response() res: Response): Promise<Response> {
    const listEvents = container.resolve(ListEventsService);

    const events = await listEvents.execute();

    return res.json(events);
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
}

export default EventsController;
