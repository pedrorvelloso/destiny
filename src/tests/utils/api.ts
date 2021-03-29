import request from 'supertest';

import { httpServer } from '@shared/infra/http/server';

export const apiTest = request(httpServer);
