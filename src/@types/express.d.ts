/* eslint-disable @typescript-eslint/interface-name-prefix */
declare namespace Express {
  export interface Request {
    ws: SocketIO.Server;
    user: {
      id: string;
    };
  }
}
