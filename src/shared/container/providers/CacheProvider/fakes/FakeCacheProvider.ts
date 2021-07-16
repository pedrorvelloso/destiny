import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(
    key: string,
    value: any,
    _transform?: boolean,
  ): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    const match = /(.)+:\*/g;

    if (key.match(match)) {
      const [prefix] = key.split(':');

      const keys = Object.keys(this.cache).filter(k => k.startsWith(prefix));

      keys.forEach(k => delete this.cache[k]);
    } else {
      delete this.cache[key];
    }
  }
}

export default FakeCacheProvider;
