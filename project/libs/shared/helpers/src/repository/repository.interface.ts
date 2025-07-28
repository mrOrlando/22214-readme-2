import { Entity, EntityIdType } from './entity.interface';

export interface Repository<T extends Entity<EntityIdType>> {
  findById(id: EntityIdType): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(id: EntityIdType, entity: T): Promise<T>;
  deleteById(id: EntityIdType): Promise<void>;
}
