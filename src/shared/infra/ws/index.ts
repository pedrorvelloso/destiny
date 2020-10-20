import socketIo from 'socket.io';
import { Server } from 'http';

import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import { EVENTS } from './events';
import IEmitTotalDonationsDTO from './dtos/IEmitTotalDonationsDTO';

export interface IWebsocketUtils {
  socket: socketIo.Server;
  emit: {
    newDonation(donation: Donation): void;
    totalDonations(data: IEmitTotalDonationsDTO): void;
    reviewedDonation(donation: Donation): void;
  };
}

interface IDestinySocket {
  get(): IWebsocketUtils;
  emitNewDonation(donation: Donation): void;
  emitTotalDonations(data: IEmitTotalDonationsDTO): void;
  emitReviewedDonation(donation: Donation): void;
}

export class DestinySocket implements IDestinySocket {
  websocket: socketIo.Server;

  constructor(server: Server) {
    this.websocket = socketIo(server);
  }

  emitNewDonation(donation: Donation): void {
    this.websocket.emit(
      `${EVENTS.NEW_DONATION}:${donation.event_id}`,
      donation,
    );
  }

  emitTotalDonations({ event_id, total }: IEmitTotalDonationsDTO): void {
    this.websocket.emit(`${EVENTS.TOTAL_DONATIONS}:${event_id}`, total);
  }

  emitReviewedDonation(donation: Donation): void {
    this.websocket.emit(
      `${EVENTS.NEW_REVIEWED_DONATION}:${donation.event_id}`,
      donation,
    );
  }

  public get(): IWebsocketUtils {
    return {
      socket: this.websocket,
      emit: {
        newDonation: this.emitNewDonation.bind(this),
        reviewedDonation: this.emitReviewedDonation.bind(this),
        totalDonations: this.emitTotalDonations.bind(this),
      },
    };
  }
}
