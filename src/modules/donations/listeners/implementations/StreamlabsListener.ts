import client from 'socket.io-client';
import { injectable, inject } from 'inversify';

import { container } from '@shared/container';

import { websocket } from '@shared/infra/http/server';
import { EVENTS } from '@shared/infra/ws/events';

import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import IDonationListener from '../models/IDonationListener';

interface IDonationMessage {
  from: string;
  amount: number;
  message: string;
}

interface IStreamLabsEvent {
  for: string;
  type: 'donation';
  message: IDonationMessage[];
}

@injectable()
class StreamlabsListener implements IDonationListener {
  private client: SocketIOClient.Socket;

  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {
    this.client = client(
      `https://sockets.streamlabs.com?token=${process.env.STREAMLABS_TOKEN}`,
      { transports: ['websocket'] },
    );
  }

  public async listen(): Promise<void> {
    const saveNewDonation = container.resolve(SaveNewDonationService);
    console.log('🔉 Listening Streamlabs');

    this.client.on('event', async (eventData: IStreamLabsEvent) => {
      const activeEvent = await this.eventsRepository.fetchActiveEvent();
      if (eventData.type === 'donation') {
        if (!activeEvent) {
          console.error('🚫 There is no event going on, skiping donation');
        } else {
          eventData.message.forEach(async ({ amount, from, message }) => {
            const donation = await saveNewDonation.execute({
              from,
              amount,
              message,
              source: 'Streamlabs',
              event_id: activeEvent.id,
            });

            websocket.emit(EVENTS.NEW_DONATION, donation);
          });
        }
      }
    });
  }
}

export default StreamlabsListener;
