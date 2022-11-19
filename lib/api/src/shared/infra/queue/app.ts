import { container } from 'tsyringe';

import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

import ControlSchoolTermPeriodsJob from '@modules/queues/jobs/ControlSchoolTermPeriodsJob';
import ControlSchoolYearJob from '@modules/queues/jobs/ControlSchoolYearJob';

const queue = container.resolve<IQueueProvider>('QueueProvider');

// queue.add(ListStudentsJob);
queue.add(ControlSchoolTermPeriodsJob);
queue.add(ControlSchoolYearJob);

queue.init();
