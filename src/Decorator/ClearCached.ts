import resolveKey, { KeyPropertyType } from "../Util/resolveKey";
import IStorage from "../Storage/IStorage";
import ScopedCacheStorage from "../Storage/Impl/ScopedCacheStorage";

type TypedDecoratorResult<T> = (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;

type CachedOptions = {
  container?: IStorage;
  runIfCacheIsCleared?: boolean;
};

function ClearCached<T extends Function>(
  _key?: KeyPropertyType,
  _options?: CachedOptions
): TypedDecoratorResult<T> {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    const __originalMethod__ = descriptor.value;

    let _container = _options ? _options.container : undefined;

    descriptor.value = function(...args: any) {
      const __self = this;
      const method = () => __originalMethod__.apply(__self, args);

      const key = resolveKey(_key, `${this.name}_${propertyKey}`, args);

      let container = _container;

      if (container === undefined) {
        container = this.__contianer__ || new ScopedCacheStorage(__self);
      }

      const hasKey = container.has(key);

      if (hasKey || _options.runIfCacheIsCleared) {
        return method();
      }

      if (hasKey) {
        container.unset(key);
      }
    } as any;
  }
}

export default ClearCached;