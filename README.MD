
# A simple caching library using annotations

## Example: 

### Without args

```javascript
class Example {

  @Cacheable()
  // Same as @Cacheable('method')
  // Same as @Cacheable((...args) => 'method' + JSON.stringify(args))
  method() {

  }

  @ClearCached('method')
  // Same as @ClearCached((...args) => 'method' + JSON.stringify(args))
  clearCache() {

  }
}
```

### With args

```javascript
class Example {
  @Cacheable()
  // Same as @Cacheable('method')
  // Same as @Cacheable((...args) => 'method' + JSON.stringify(args))
  method(arg0, arg1) {

  }

  // The first argument (the key) does not have be the method name, but if no key is given, it will default to the method name.
  // Since we want to clear the cache for the Example.method() function, and it does not have a custom key, we will need to set 'method' as a key.
  @ClearCached('method')
  // Same as @ClearCached((...args) => 'method' + JSON.stringify(args))
  clearCache(arg0, arg1) {
  }
}
```


### With args but stored

This example will catch the first call and then always return the first given result.

```javascript
class Example {
  @Cacheable(() => 'method')
  method(arg0, arg1) {

  }

  // The first argument (the key) does not have be the method name, but if no key is given, it will default to the method name.
  // Since we want to clear the cache for the Example.method() function, and it does not have a custom key, we will need to set 'method' as a key.
  // When we return the key from a function, the arguments will not be added automattically to the key.
  @ClearCached(() => 'method')
  clearCache(arg0, arg1) {

  }
}
```

If you want to clear all the caches while having multiple arguments, you will need to store the keys or we will implement a functionality for that ?