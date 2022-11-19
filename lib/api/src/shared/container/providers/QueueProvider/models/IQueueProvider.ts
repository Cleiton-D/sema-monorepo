import IQueueJob from './IQueueJob';

export default interface IQueueProvider {
  add: (job: Type<IQueueJob>) => Promise<void>;
  init: () => Promise<void>;
  stop: () => Promise<void>;
}
