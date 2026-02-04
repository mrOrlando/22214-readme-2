export type EntityIdType = string;

export type DefaultPojoType = object;

export interface Entity<T extends EntityIdType, PojoType = DefaultPojoType> {
  id?: T;
  toPOJO(): PojoType;
}
