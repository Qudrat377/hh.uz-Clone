import { BaseEntity } from "src/database/base.entity";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity({ name: 'warn_logs' })
export class WarnLog extends BaseEntity {
  @Column({ type: 'text' }) message: string;
  @Column({ nullable: true }) context: string;
  @CreateDateColumn() timestamp: Date;
}