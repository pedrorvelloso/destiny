import IDonationListener from './models/IDonationListener';
import StreamlabsListener from './implementations/StreamlabsListener';

const streamlabsListener: IDonationListener = new StreamlabsListener();

streamlabsListener.listen();
