import { container } from '@shared/container';
import IDonationListener from './models/IDonationListener';

import StreamlabsListener from './implementations/StreamlabsListener';
import FakeServerListener from './implementations/FakeServerListener';

const streamlabsListener: IDonationListener = container.resolve(
  StreamlabsListener,
);

streamlabsListener.listen();

if (process.env.NODE_ENV === 'development') {
  const fakeServerListener: IDonationListener = container.resolve(
    FakeServerListener,
  );

  fakeServerListener.listen();
}
