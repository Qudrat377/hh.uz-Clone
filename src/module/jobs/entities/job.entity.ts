import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "src/database/base.entity";
import { Cauntry } from "src/shared/constants/enum/country";
import { UzbekistanCity } from "src/shared/constants/enum/city";
import { WorkYears } from "src/shared/constants/enum/work.years";
import { Position } from "src/shared/constants/enum/position";
import { WorkHeader } from "src/shared/constants/enum/work.title";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Reply } from "src/module/reply/entities/reply.entity";
import { Seved } from "src/module/seved/entities/seved.entity";

@Entity({ name: "job" })
export class Job extends BaseEntity {
  @Column({ type: "enum", enum: WorkHeader })
  workHeader: WorkHeader;

  @Column({
    type: "text",
    nullable: true,
  })
  workDescription: string;

  @Column({ nullable: true })
  workGrafik: string;

  @Column({
    type: "jsonb",
    nullable: true,
    default: [], // Shunchaki bo'sh massiv
  })
  requirements: any;

  @Column({
    type: "jsonb",
    nullable: true,
    default: [], // Default qiymat sifatida bo'sh massiv berish yaxshi amaliyot
  })
  advantages: any[];

  @Column({ nullable: true })
  fromSalary: string;

  @Column({ nullable: true })
  toSalary: string;

  @Column({ type: "enum", enum: Cauntry })
  cauntry: Cauntry;

  @Column({ type: "enum", enum: UzbekistanCity })
  city: UzbekistanCity;

  @Column({ type: "enum", enum: WorkYears })
  work_years: WorkYears;

  @Column({ type: "enum", enum: Position, nullable: true })
  position: Position;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  //   relations
  @ManyToOne(() => Auth, (user) => user.jobs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "author_id" })
  author: Auth;

  @OneToMany(() => Reply, (reply) => reply.job, {cascade: true})
  replies: Reply[];
  
  @OneToMany(() => Seved, (seved) => seved.jobs, {cascade: true})
  seveds: Seved[];
}
