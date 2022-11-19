import { container } from 'tsyringe';

import SharpBlurhashProvider from './implementations/SharpBlurhashProvider';
import IBlurhashProvider from './models/IBlurhashProvider';

container.registerSingleton<IBlurhashProvider>(
  'BlurhashProvider',
  SharpBlurhashProvider,
);
