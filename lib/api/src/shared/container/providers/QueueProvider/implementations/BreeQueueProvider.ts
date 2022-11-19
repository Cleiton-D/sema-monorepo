/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import Bree from 'bree';

import QueueJobDTO from '../dtos/QueueJobDTO';
import IQueueJob from '../models/IQueueJob';

import IQueueProvider from '../models/IQueueProvider';

class BreeQueueProvider implements IQueueProvider {
  private client: Bree;

  constructor() {
    this.client = new Bree({
      root: false,
      doRootCheck: false,
    });

    this.init();
  }

  public async init(): Promise<void> {
    this.client.start();
  }

  public async stop(): Promise<void> {
    await this.client.stop();
  }

  public async add(job: Type<IQueueJob>): Promise<void> {
    const metadata = Reflect.getMetadata('jobMetadata', job) as QueueJobDTO;

    this.client.add({
      name: metadata.name,
      cron: metadata.cron,
      path: () => {
        const { workerData } = require('worker_threads');
        const path = require('path');

        require(path.resolve(
          workerData.dirname,
          '../../../../infra/app/preload',
        ));

        const { waitDataSource } = require(path.resolve(
          workerData.dirname,
          '../../../../../config/data_source',
        ));
        const { container } = require('tsyringe');
        const { default: jobExecutor } = require(workerData.jobPath);

        waitDataSource.then(() => {
          const jobInstance: IQueueJob = container.resolve(jobExecutor);
          jobInstance.execute();
        });
      },
      worker: {
        workerData: {
          jobPath: metadata.path,
          dirname: __dirname,
        },
      },
    });
  }
}

export default BreeQueueProvider;
