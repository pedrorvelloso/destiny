import { container } from '@shared/container';
import IDonationListener from './models/IDonationListener';
import StreamlabsListener from './implementations/StreamlabsListener';

const streamlabsListener: IDonationListener = container.resolve(
  StreamlabsListener,
);

streamlabsListener.listen();
