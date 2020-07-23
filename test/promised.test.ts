import GenerateTestClassWithPromises from "./Util/GenerateTestClassWithPromises";
import { expect } from "chai";
import { DefaultCacheType, Storages } from "../src";

describe('Cache counter value', () => {
  describe('With promises', () => {
    it ('Should count and compare', async () => {

      const TestClass = GenerateTestClassWithPromises();
  
      const test1 = new TestClass();
      const test2 = new TestClass();
  
  
      // Step 1: Create promise.
      // Step 2: Request value.
      const result1 = test1.cachedFunction();
      // Step 3: Request value.
      const result2 = test1.cachedFunction();
  
      const result3 = test2.cachedFunction();
  
      expect(TestClass.counter).to.equal(0);
  
      // Step 4: Resolve promise.
      test1.resolve();
      const results = await Promise.all([result1, result2]);
  
      // values from steps 2, 3 should be filled with the resolved value.
      results.forEach((result) => expect(result).to.equal(0));
      expect(TestClass.counter).to.equal(1);
  
      test2.resolve();
  
      expect(await result3).to.equal(1);
      expect(TestClass.counter).to.equal(2);

      // Step 5: Expect same result, since we cached it.
      expect(await test1.cachedFunction()).to.equal(0);
      expect(await test2.cachedFunction()).to.equal(1);
    });
  
    it ('Should cache globally', async () => {
  
      @DefaultCacheType(new Storages.ScopedCacheStorage(), {  })
      class TestClass extends GenerateTestClassWithPromises() {}
  
      const test1 = new TestClass();
      const test2 = new TestClass();
  
  
      // Step 1: Create promise.
      // Step 2: Request value.
      const result1 = test1.cachedFunction();
      // Step 3: Request value.
      const result2 = test1.cachedFunction();
  
      const result3 = test2.cachedFunction();
  
      expect(TestClass.counter).to.equal(0);
  
      // Step 4: Resolve promise.
      test1.resolve();
      const results = await Promise.all([result1, result2]);
  
      // values from steps 2, 3 should be filled with the resolved value.
      results.forEach((result) => expect(result).to.equal(0));
      expect(TestClass.counter).to.equal(1);
  
  
      expect(await result3).to.equal(0);
      expect(TestClass.counter).to.equal(1);


      // Step 5: Expect same result, since we cached it.
      expect(await test1.cachedFunction()).to.equal(0);
      expect(await test2.cachedFunction()).to.equal(0);
    });
  });
});