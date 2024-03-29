import {
  EntitySubscriberInterface,
  UpdateEvent,
  EventSubscriber,
} from 'typeorm';

import { container } from '@shared/container';
import { websocket } from '@shared/infra/http/server';

import ShowEventTotalDonationsService from '@modules/events/services/ShowEventTotalDonationsService';

import Donation from '../entities/Donation';

@EventSubscriber()
class DonationSubscriber implements EntitySubscriberInterface<Donation> {
  listenTo(): typeof Donation {
    return Donation;
  }

  async afterUpdate({
    entity: donation,
  }: UpdateEvent<Donation>): Promise<void> {
    if (donation.event_id && donation.reviewed) {
      const showEventTotalDonations = container.resolve(
        ShowEventTotalDonationsService,
      );

      const total = await showEventTotalDonations.execute({
        event_id: donation.event_id,
      });

      websocket.emit.totalDonations({
        event_id: donation.event_id,
        total: total + donation.amount,
      });
    }
  }
}

export default DonationSubscriber;
