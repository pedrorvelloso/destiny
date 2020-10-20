/* eslint-disable @typescript-eslint/interface-name-prefix */
declare namespace Express {
  export interface Request {
    ws: import('@shared/infra/ws/index').IWebsocketUtils;
    user: {
      id: string;
    };
  }
}
