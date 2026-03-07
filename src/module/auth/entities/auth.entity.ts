import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Profile } from "./profile.entity";
import { SocialAccount } from "./socialAccount.entity";
import { BaseEntity } from "src/database/base.entity";
import { UserRole } from "src/shared/constants/enum/user.role";
import { Job } from "src/module/jobs/entities/job.entity";

@Entity({ name: "auth" })
export class Auth extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: "0" })
  otp: string;

  @Column({ type: "bigint", nullable: true })
  otpTime: number;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CANDIDATE })
  role: UserRole;

  @OneToOne(() => Profile, (profile) => profile.auth, { cascade: true, onDelete: "CASCADE" })
  profile: Profile;

  @OneToMany(() => SocialAccount, (social) => social.auth, {cascade: true, onDelete: "CASCADE"} )
  socialAccounts: SocialAccount[];

  @OneToMany(() => Job, (job) => job.author)
  jobs: Job[];
}
