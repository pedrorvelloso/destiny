import client from 'socket.io-client';

import IDonationListener from '../models/IDonationListener';

interface IEvent {
  for: string;
  type: 'donation';
}

class StreamlabsListener implements IDonationListener {
  private client: SocketIOClient.Socket;

  constructor() {
    this.client = client(
      `https://sockets.streamlabs.com?token=${process.env.STREAMLABS_TOKEN}`,
      { transports: ['websocket'] },
    );
  }

  public listen(): void {
    console.log('🔉 Listening Streamlabs');

    this.client.on('event', (eventData: IEvent) => {
      if (eventData.type === 'donation') console.log('new donation');
    });
  }
}

export default StreamlabsListener;
