import Cached from './Decorator/Cached';
import ClearCached from './Decorator/ClearCached';
import IStorage from './Storage/IStorage';
import ScopedCacheStorage from './Storage/Impl/ScopedCacheStorage';

const Storages = {
  ScopedCacheStorage
}


export { Cached, ClearCached, IStorage, Storages };