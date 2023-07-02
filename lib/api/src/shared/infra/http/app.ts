import express from 'express';

import uploadConfig from '@config/storage';
import { waitDataSource } from '@config/data_source';

import server from './server';

server.use('/files', express.static(uploadConfig.uploadsPath));

const port = process.env.PORT || 3333;

waitDataSource.then(() => {
  server.listen(port, () => {
    console.log(`🚀server online on port ${port}`);
  });
});
