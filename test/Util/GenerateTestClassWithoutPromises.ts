import { ClearCached, Cached } from '../../src';


function GenerateTestClassWithoutPromises(key: any = "test") {

  class TestClass {

    static counter: number = 0;

    @Cached(key)
    cachedFunction() {
      const result = TestClass.counter;
      TestClass.counter += 1;
      return result;
    }

    @ClearCached(key)
    uncache() {}
  }

  return TestClass;
}

export default GenerateTestClassWithoutPromises;