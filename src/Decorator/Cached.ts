import IStorage from "../Storage/IStorage";
import ScopedCacheStorage from "../Storage/Impl/ScopedCacheStorage";
import resolveKey, { KeyPropertyType } from "../Util/resolveKey";

type TypedDecoratorResult<T> = (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;

type CachedOptions = {
  container?: IStorage;
  containerOptions?: CachedOptions;
};

function Cached<T extends Function>(
  _key?: KeyPropertyType,
  options?: CachedOptions
): TypedDecoratorResult<T> {



  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const __originalMethod__ = descriptor.value;

    const _container = options ? options.container : undefined;
    const _containerOptions = options ? options.containerOptions : undefined;

    descriptor.value = function(...args: any) {

      const __self = this;
      const method = () => __originalMethod__.apply(__self, args);

      let container = _container;

      if (container === undefined) {
        container = __self.__container__ || new ScopedCacheStorage(__self);
      }

      const key = resolveKey(_key, `${this.name}_${propertyKey}`, args);

      // TODO: Check if we have a stored result.
      if (container.has(key)) {
        return container.get(key);
      }

      if (container.has(`${key}_promises`)) {
        return new Promise((resolve, reject) => ((container.get(`${key}_promises`) as any)).promises.push([resolve, reject]));
      }

      
      const store = (data: any) => { 
        if (!container.supportsType(data)) {
          throw new Error("Cannot cache value.");
        }

        container.set(key, data, _containerOptions);
        return data;
      }

      let result = method();

      // We have a result and it is not a promise.
      if (!(result instanceof Promise)) {
        return store(result);
      }

      if (!container.has(`${key}_promises`)) {
        container.set(`${key}_promises`, {
          promise: undefined,
          promises: []
        });
      }

      // We have a promised result.

      // Helper function, to make sure that only the latest promise will resolve/reject all the created promises.
      const getPromises = () => container.has(`${key}_promises`) && (container.get(`${key}_promises`) as any).promise === result ? (container.get(`${key}_promises`) as any).promises : [];

      // We create a new promise.
      return new Promise((resolve, reject) => {
        result = result
        // Store the data.
        .then((data) => store(data))
        .then((data) => {
          // Resolve all the promises.
          getPromises().forEach(([resolve]) => resolve(data));
          return data;
        })
        .catch((err) => {
          // Reject all the promises.
          getPromises().forEach(([, reject]) => reject(err));
        })
        .finally(() => {
          if (!container.has(`${key}_promises`) || (container.get(`${key}_promises`) as any).promise !== result ) {
            return;
          }

          container.unset(`${key}_promises`);
        });

        (container.get(`${key}_promises`) as any).promise = result;
        (container.get(`${key}_promises`) as any).promises.push([resolve, reject]);
      });
    } as any;
  }
}

export default Cached;
