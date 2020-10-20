import client from 'socket.io-client';
import { injectable, inject } from 'inversify';

import { container } from '@shared/container';

import { websocket } from '@shared/infra/http/server';

import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import IDonationListener from '../models/IDonationListener';

interface IDonationMessage {
  from: string;
  amount: number;
  message: string;
}

@injectable()
class FakeServerListener implements IDonationListener {
  private client: SocketIOClient.Socket;

  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {
    this.client = client(`http://localhost:6000`, {
      transports: ['websocket'],
    });
  }

  public async listen(): Promise<void> {
    const saveNewDonation = container.resolve(SaveNewDonationService);
    console.log('🔉 Listening Fake Server');

    this.client.on('donation', async (eventData: IDonationMessage) => {
      const activeEvent = await this.eventsRepository.fetchActiveEvent();
      if (!activeEvent) {
        console.error('🚫 There is no event going on, skiping donation');
      } else {
        const donation = await saveNewDonation.execute({
          from: eventData.from,
          amount: eventData.amount,
          message: eventData.message,
          source: FakeServerListener.name,
          event_id: activeEvent.id,
        });

        websocket.emit.newDonation(donation);
      }
    });
  }
}

export default FakeServerListener;
