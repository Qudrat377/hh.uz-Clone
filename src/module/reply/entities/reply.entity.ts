import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { isAbout } from "src/shared/constants/enum/isAbout";

@Entity({ name: "reply" })
export class Reply extends BaseEntity {
  @Column({ type: "enum", enum: isAbout, default: isAbout.PADDING })
  cauntry: isAbout;

  @Column({ type: "text", nullable: true })
  message?: string;

  @DeleteDateColumn()
  deletedAt: Date;

  // Profile bilan bog'liqlik saqlanib qoladi
  @ManyToOne(() => Auth, (auth) => auth.replies, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: Auth;

  @ManyToOne(() => Job, (job) => job.replies, { onDelete: "CASCADE" })
  @JoinColumn({ name: "job_id" })
  job: Job;
}
