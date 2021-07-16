export default interface IPaginationResultDTO<T> {
  cursor: number | null;
  hasNextPage: boolean;
  edges: T[];
}
