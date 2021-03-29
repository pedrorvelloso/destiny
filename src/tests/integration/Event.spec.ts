import { apiTest } from '../utils/api';
import { clearDatabase } from '../utils/database';

describe('event integration', () => {
  afterEach(() => clearDatabase());

  it('should be able te create event', async () => {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 2);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 20);

    const response = await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('active');
  });

  it('should fail to create event if starts before today or today', async () => {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 20);

    const response = await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: new Date(),
      ends_at: endsAt,
    });

    expect(response.status).toBe(400);
  });

  it('should fail to create event if startsAt is after endsAt', async () => {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 20);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 2);

    const response = await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    expect(response.status).toBe(400);
  });

  it('should be able to start event', async () => {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 2);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 20);

    const {
      body: { id, active },
    } = await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    expect(active).toBe(false);

    const response = await apiTest.patch(`/events/${id}/start`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('active');
    expect(response.body.active).toBe(true);
  });

  it('should fail to start event if theres another event going on', async () => {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 2);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 20);

    const {
      body: { id: idEvent1 },
    } = await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    await apiTest.patch(`/events/${idEvent1}/start`);

    const {
      body: { id: idEvent2 },
    } = await apiTest.post('/events').send({
      name: 'BrAT 2077/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    const response = await apiTest.patch(`/events/${idEvent2}/start`);

    expect(response.status).toBe(400);
  });

  it('should be able to list events', async () => {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 2);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 20);

    await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    await apiTest.post('/events').send({
      name: 'BrAT 2020/2',
      description: 'Evento para ajudar MSF',
      starts_at: startsAt,
      ends_at: endsAt,
    });

    const response = await apiTest.get('/events');

    expect(response.body.length).toBe(2);
  });
});
