import IStorage from "../Storage/IStorage";
import ScopedCacheStorage from "../Storage/Impl/ScopedCacheStorage";

type ConstructorType = {
  new (...args: any[]): any
};

type CacheTypeOptions = {
}


function DefaultCacheType<T extends ConstructorType>(__container?: IStorage, options?: CacheTypeOptions): (base: T) => any {
  return function (Base: T, options?: CacheTypeOptions) {
    class Genrated extends Base {
  
      __container__ = __container ? __container : undefined;
  
      constructor(...args: any[]) {
        super(...args);
  
        if (![null, undefined].includes(this.__container__)) {
          return;
        }
  
        this.__container__ = new ScopedCacheStorage(this);
      }
    }
  
    return Genrated;
  }
}

export default DefaultCacheType;