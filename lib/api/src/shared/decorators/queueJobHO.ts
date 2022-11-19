import QueueJobDTO from '@shared/container/providers/QueueProvider/dtos/QueueJobDTO';
import IQueueJob from '../container/providers/QueueProvider/models/IQueueJob';

function queueJobHO(
  target: Type<IQueueJob>,
  props: QueueJobDTO,
): Type<IQueueJob> {
  // Object.defineProperty(target, 'jobMetadata', { value: props });
  Reflect.defineMetadata('jobMetadata', props, target);
  return target;
}

export default queueJobHO;
