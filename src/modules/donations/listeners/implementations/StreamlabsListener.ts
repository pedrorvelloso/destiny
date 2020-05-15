import client from 'socket.io-client';

import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';
import { container } from '@shared/container';

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

class StreamlabsListener implements IDonationListener {
  private client: SocketIOClient.Socket;

  constructor() {
    this.client = client(
      `https://sockets.streamlabs.com?token=${process.env.STREAMLABS_TOKEN}`,
      { transports: ['websocket'] },
    );
  }

  public async listen(): Promise<void> {
    const saveNewDonation = container.resolve(SaveNewDonationService);
    console.log('🔉 Listening Streamlabs');

    this.client.on('event', (eventData: IStreamLabsEvent) => {
      if (eventData.type === 'donation') {
        eventData.message.forEach(async ({ amount, from, message }) => {
          await saveNewDonation.execute({
            from,
            amount,
            message,
            source: 'Streamlabs',
          });
        });
      }
    });
  }
}

export default StreamlabsListener;
