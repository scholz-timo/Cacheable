import ScopedCacheStorage from "../../../src/Storage/Impl/ScopedCacheStorage";
import { expect } from "chai";

describe('Test the scoped cache storage', () => {
  it("Should store and maintain the instance.", () => {
    const storage = new ScopedCacheStorage();

    expect(() => storage.get("test")).to.throw();
    expect(storage.has("test")).to.equal(false);

    storage.set("test", "foo");
    expect(storage.has("test")).to.equal(true);
    expect(storage.get("test")).to.equal("foo");

    storage.set("test", "bar");
    expect(storage.has("test")).to.equal(true);
    expect(storage.get("test")).to.equal("bar");

    storage.unset("test");
    expect(storage.has("test")).to.equal(false);
    expect(() => storage.get("test")).to.throw();
  });
})