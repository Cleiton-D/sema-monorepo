export default interface IQueueJob {
  execute: () => Promise<void>;
}
