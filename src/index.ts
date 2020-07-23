import Cached from './Decorator/Cached';
import ClearCached from './Decorator/ClearCached';
import DefaultCacheType from './Decorator/DefaultCacheType';
import IStorage from './Storage/IStorage';
import ScopedCacheStorage from './Storage/Impl/ScopedCacheStorage';

const Storages = {
  ScopedCacheStorage
}


export { Cached, ClearCached, DefaultCacheType, IStorage, Storages };