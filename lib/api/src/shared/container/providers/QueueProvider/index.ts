import { container } from 'tsyringe';

import IQueueProvider from './models/IQueueProvider';
import BreeQueueProvider from './implementations/BreeQueueProvider';

container.registerSingleton<IQueueProvider>('QueueProvider', BreeQueueProvider);
