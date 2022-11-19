import sharp from 'sharp';

import blurhashConfig from '@config/blurhash';

import IBlurhashProvider from '../models/IBlurhashProvider';

class SharpBlurhashProvider implements IBlurhashProvider {
  public async encode(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sharp(path)
        .raw()
        .ensureAlpha()
        .resize(blurhashConfig.width, blurhashConfig.height, { fit: 'inside' })
        .jpeg({
          overshootDeringing: blurhashConfig.overshootDeringing,
          quality: blurhashConfig.quality,
        })
        .toBuffer((err, buffer) => {
          if (err) return reject(err);

          resolve(`data:image/jpeg;base64,${buffer.toString('base64')}`);
        });
    });
  }
}

export default SharpBlurhashProvider;
