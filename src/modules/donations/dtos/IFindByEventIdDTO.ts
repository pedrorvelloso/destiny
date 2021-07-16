import IPaginationDTO from '@shared/dtos/IPaginationDTO';

export default interface IFindByEventIdDTO {
  event_id: number;
  pagination?: IPaginationDTO;
}
