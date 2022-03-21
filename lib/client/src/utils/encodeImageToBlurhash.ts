import sharp from 'sharp';

export const encodeImageToBlurhash = (path: string) => {
  return new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(64, 64, { fit: 'inside' })
      .jpeg({
        overshootDeringing: true,
        quality: 40
      })
      .toBuffer((err, buffer) => {
        if (err) return reject(err);

        resolve(`data:image/jpeg;base64,${buffer.toString('base64')}`);
      });
  });
};
