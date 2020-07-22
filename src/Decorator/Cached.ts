import IStorage from "../Storage/IStorage";
import ScopedCacheStorage from "../Storage/Impl/ScopedCacheStorage";
import resolveKey, { KeyPropertyType } from "../Util/resolveKey";

type TypedDecoratorResult<T> = (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;

type CachedOptions = {
  container?: IStorage;
};

function Cached<T extends Function>(
  _key?: KeyPropertyType,
  options?: CachedOptions
): TypedDecoratorResult<T> {



  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const __originalMethod__ = descriptor.value;

    let promises: Record<string, {
      promises: Array<[Function, Function]>; 
      promise: Promise<any>
    }|undefined> = {};

    const _container = options ? options.container : undefined;

    descriptor.value = function(...args: any) {

      const __self = this;
      const method = () => __originalMethod__.apply(__self, args);

      let container = _container;

      if (container === undefined) {
        container = this.__contianer__ || new ScopedCacheStorage(__self);
      }

      const key = resolveKey(_key, `${this.name}_${propertyKey}`, args);

      // TODO: Check if we have a stored result.
      if (container.has(key)) {
        return container.get(key);
      }

      if (promises[key] !== undefined) {
        return new Promise((resolve, reject) => promises[key].promises.push([resolve, reject]));
      }

      
      const store = (data: any) => { 
        if (!container.supportsType(data)) {
          throw new Error("Cannot cache value.");
        }

        container.set(key, data);
        return data;
      }

      let result = method();

      // We have a result and it is not a promise.
      if (!(result instanceof Promise)) {
        return store(result);
      }

      if (promises[key] === undefined) {
        promises[key] = { promise: undefined, promises: [] };
      }

      // We have a promised result.

      // Helper function, to make sure that only the latest promise will resolve/reject all the created promises.
      const getPromises = () => promises[key].promise === result ? promises[key].promises : [];

      // We create a new promise.
      return new Promise((resolve, reject) => {
        result = result
        // Store the data.
        .then((...data) => store(data))
        .then((...data) => {
          // Resolve all the promises.
          getPromises().forEach(([resolve]) => resolve(...data));
          return data;
        })
        .catch((...data) => {
          // Reject all the promises.
          getPromises().forEach(([, reject]) => reject(...data));
          return data;
        })
        .finally(() => {
          if (promises[key].promise !== result) {
            return;
          }

          promises[key] = undefined;
        });

        promises[key].promise = result;
        promises[key].promises.push([resolve, reject]);
      });
    } as any;
  }
}

export default Cached;
