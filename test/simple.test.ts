import ScopedCacheStorage from '../src/Storage/Impl/ScopedCacheStorage';
import { ClearCached, Cached } from '../src';
import { expect } from 'chai';

describe('Cache counter value', () => {


  it('Should count and compare', () => {
    // const container = new ScopedCacheStorage();

    let counter = 0;

    class TestClass {
      @Cached("test")
      cachedFunction() {
        return counter++;
      }

      @ClearCached("test")
      uncache() {}
    }

    const test1 = new TestClass();
    const test2 = new TestClass();

    expect(test1.cachedFunction()).to.equal(0);
    expect(counter).to.equal(1);
    expect(test1.cachedFunction()).to.equal(0);
    expect(counter).to.equal(1);
    expect(test2.cachedFunction()).to.equal(1);
    expect(counter).to.equal(2);
    expect(test1.cachedFunction()).to.equal(0);
    expect(counter).to.equal(2);
  });
});