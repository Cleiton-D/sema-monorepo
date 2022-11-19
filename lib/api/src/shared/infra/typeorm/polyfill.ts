import 'reflect-metadata';
import { SelectQueryBuilder } from 'typeorm';

import { VIRTUAL_COLUMN_KEY } from '@shared/decorators/virtualColumn';

SelectQueryBuilder.prototype.getMany = async function getMany() {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    Object.entries<string>(metaInfo).forEach(([propertyKey, name]) => {
      // eslint-disable-next-line no-param-reassign
      entitiy[propertyKey] = item[name];
    });

    return entitiy;
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function getOne() {
  const { entities, raw } = await this.getRawAndEntities();
  if (!entities[0]) return null;

  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

  Object.entries<string>(metaInfo).forEach(([propertyKey, name]) => {
    entities[0][propertyKey] = raw[0][name];
  });

  return entities[0];
};
