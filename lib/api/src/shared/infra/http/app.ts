import express from 'express';

import uploadConfig from '@config/storage';

import server from './server';

server.use('/files', express.static(uploadConfig.uploadsPath));

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`🚀server online on port ${port}`);
});
