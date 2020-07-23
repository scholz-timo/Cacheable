import { Test } from "mocha";
import { Cached, ClearCached } from "../../src";
import GenerateTestClassWithoutPromises from "./GenerateTestClassWithoutPromises";

function GenerateTestClassWithPromises(key: any = "test") {

  class TestClass {

    static counter: number = 0;

    private promise;
    private resolveOrReject;

    private ensurePromise() {
      if (this.promise === undefined) {
        this.promise = new Promise((resolve, reject) => { 
          this.resolveOrReject = [resolve, reject]; 
        });
      }

      return [this.promise, this.resolveOrReject];
    }

    @Cached(key)
    async cachedFunction() {

      await this.ensurePromise()[0];

      const result = TestClass.counter;
      TestClass.counter += 1;
      return result;
    }

    resolve() {
      this.ensurePromise()[1][0]();
      this.afterResolveOrReject();
    }

    reject() {
      this.ensurePromise()[1][1]();
      this.afterResolveOrReject();
    }

    private afterResolveOrReject() {
      this.promise = undefined;
      this.resolveOrReject = undefined;
    }

    @ClearCached(key)
    uncache() {}
  }

  return TestClass;
}

export default GenerateTestClassWithPromises;