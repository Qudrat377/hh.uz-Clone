import {
    Entity,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Auth } from "src/module/auth/entities/auth.entity";

@Entity({name: "saved"})
export class Seved extends BaseEntity {
  @ManyToOne(() => Auth, (auth) => auth.seveds, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: Auth;

  @ManyToOne(() => Job, (job) => job.seveds, { onDelete: "CASCADE" })
  @JoinColumn({ name: "job_id" })
  jobs: Job;
}