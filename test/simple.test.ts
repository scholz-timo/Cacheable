import { expect } from 'chai';
import GenerateTestClassWithoutPromises from './Util/GenerateTestClassWithoutPromises';
import { DefaultCacheType, Storages } from '../src';

describe('Cache counter value', () => {

  describe('Without promises', () => {
    it('Should count and compare', () => {
      const TestClass = GenerateTestClassWithoutPromises();
  
      const test1 = new TestClass();
      const test2 = new TestClass();
  
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test2.cachedFunction()).to.equal(1);
      expect(TestClass.counter).to.equal(2);
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(2);
    });

    it('Should count, compare and clear', () => {
      const TestClass = GenerateTestClassWithoutPromises();
  
      const test1 = new TestClass();
      const test2 = new TestClass();
  
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test2.cachedFunction()).to.equal(1);
      expect(TestClass.counter).to.equal(2);

      test1.uncache();

      expect(test1.cachedFunction()).to.equal(2);
      expect(TestClass.counter).to.equal(3);
      expect(test1.cachedFunction()).to.equal(2);
      expect(TestClass.counter).to.equal(3);

      expect(test2.cachedFunction()).to.equal(1);

      test1.uncache();
      test2.uncache();

      expect(test2.cachedFunction()).to.equal(3);
      expect(TestClass.counter).to.equal(4);
      expect(test1.cachedFunction()).to.equal(4);
      expect(TestClass.counter).to.equal(5);
    });
  
    it('Should cache globally', () => {
      @DefaultCacheType(new Storages.ScopedCacheStorage(), {  })
      class TestClass extends GenerateTestClassWithoutPromises() {}
  
      const test1 = new TestClass();
      const test2 = new TestClass();
  
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test2.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);
      expect(test1.cachedFunction()).to.equal(0);
      expect(TestClass.counter).to.equal(1);

      const test3 = new TestClass();
      expect(test3.cachedFunction()).to.equal(0);
    });
  });
});