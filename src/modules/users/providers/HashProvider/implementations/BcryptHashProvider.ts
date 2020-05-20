import { injectable } from 'inversify';
import { compare, hash } from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

@injectable()
export default class BcryptHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
