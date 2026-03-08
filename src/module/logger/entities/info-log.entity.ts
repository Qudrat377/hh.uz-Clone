import { BaseEntity } from "src/database/base.entity";
import { Column, CreateDateColumn, Entity } from "typeorm";

// src/module/logger/entities/info-log.entity.ts
@Entity({ name: 'info_logs' })
export class InfoLog extends BaseEntity {
  @Column({ type: 'text' }) message: string;
  @Column({ nullable: true }) context: string;
  @CreateDateColumn() timestamp: Date;
}

// // src/module/logger/entities/logger.entity.ts
// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// @Entity({ name: 'system_logs' })
// export class Log {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ default: 'info' })
//   level: string; // error, info, warn

//   @Column({ type: 'text' })
//   message: string;

//   @Column({ nullable: true })
//   context: string; // Qaysi modul (masalan, AuthModule)

//   @Column({ type: 'text', nullable: true })
//   stack: string; // Faqat error bo'lganda stack-trace saqlash uchun

//   @CreateDateColumn()
//   timestamp: Date;
// }
