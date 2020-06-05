export default interface ICacheProvider {
  save(key: string, value: any, transform?: boolean): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
}
