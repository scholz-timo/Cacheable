
export type CacheOptions = {

}

interface IStorage {

  supportsType<T>(obj: T): boolean;

  has(key: string): boolean;

  get<T>(key: string): T;

  set<T>(key: string, value: T, options: CacheOptions): void;

  unset(key: string): void;
}

export default IStorage;