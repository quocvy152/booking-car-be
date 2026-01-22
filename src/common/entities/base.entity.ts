export interface BaseEntity {
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export class BaseEntityImpl implements BaseEntity {
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;

  constructor() {
    this.created_at = new Date();
    this.updated_at = new Date();
    this.is_deleted = false;
  }
}
