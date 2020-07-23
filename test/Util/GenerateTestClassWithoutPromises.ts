import { ClearCached, Cached } from '../../src';


function GenerateTestClassWithoutPromises() {

  class TestClass {

    static counter: number = 0;

    @Cached("test")
    cachedFunction() {
      const result = TestClass.counter;
      TestClass.counter += 1;
      return result;
    }

    @ClearCached("test")
    uncache() {}
  }

  return TestClass;
}

export default GenerateTestClassWithoutPromises;