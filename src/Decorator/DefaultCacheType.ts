import IStorage from "../Storage/IStorage";
import ScopedCacheStorage from "../Storage/Impl/ScopedCacheStorage";

type ConstructorType = {
  new (...args: any[]): any
};

type CacheTypeOptions = {
  container?: IStorage;
}


function DefaultCacheType<T extends ConstructorType>(Base: T, options?: CacheTypeOptions) {
  class Genrated extends Base {

    __contianer__ = options ? options.container : undefined;

    constructor(...args: any[]) {
      super(...args);

      if (![null, undefined].includes(this.__contianer__)) {
        return;
      }

      this.__contianer__ = new ScopedCacheStorage(this);
    }
  }

  return Genrated;
}

export default DefaultCacheType;