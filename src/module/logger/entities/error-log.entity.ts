import { BaseEntity } from "src/database/base.entity";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity({ name: 'error_logs' })
export class ErrorLog extends BaseEntity {
  @Column({ type: 'text' }) message: string;
  @Column({ type: 'text', nullable: true }) stack: string;
  @Column({ nullable: true }) context: string;
  @CreateDateColumn() timestamp: Date;
}