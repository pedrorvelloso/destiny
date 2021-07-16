import { IIncentiveType } from '../infra/typeorm/entities/Incentive';

export default interface ICreateIncentiveDTO {
  name: string;
  description: string;
  created_by: string;
  game_id: number;
  event_id: number;
  type: IIncentiveType;
  enable_option: boolean;
  goal?: number;
}
