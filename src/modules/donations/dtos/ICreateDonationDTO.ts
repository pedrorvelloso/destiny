export default interface ICreateDonationDTO {
  from: string;
  message: string;
  amount: number;
  source: string;
  event_id?: number | null;
}
