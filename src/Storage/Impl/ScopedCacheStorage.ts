import IStorage, { CacheOptions } from "../IStorage";

class CacheEntry {
  constructor(
    public value: any,
    protected options: CacheOptions
  ) {}

  validate() {
    return true;
  }
}

class ScopedCacheStorage implements IStorage {

  constructor(instance?: any) {
    this._container = [null, undefined].includes(instance) ? {} : instance;
  }

  private _container;

  has(key: string): boolean {
    const entry = this._container[key];
    if (!(entry instanceof CacheEntry)) {
      return false;
    }

    if (entry.validate()) {
      return true;
    }

    this._container[key] = undefined;
    return false;
  }

  supportsType() {
    return true;
  }

  get<T>(key: string): T {
    if (!this.has(key)) {
      throw new Error("No entry.")
    }
    return this._container[key].value;
  }

  set<T>(key: string, value: T, options?: CacheOptions): void {
    if (!this.has(key)) {
      this._container[key] = new CacheEntry(value, options);
    } else {
      this._container[key].value = value;
    }
  }

  unset(key: string) {
    this._container[key] = undefined;
  }

}

export default ScopedCacheStorage;