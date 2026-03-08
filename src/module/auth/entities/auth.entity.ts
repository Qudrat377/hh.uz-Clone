import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity"; // Yo'l o'zgardi
import { SocialAccount } from "./socialAccount.entity";
import { BaseEntity } from "src/database/base.entity";
import { UserRole } from "src/shared/constants/enum/user.role";
import { Job } from "src/module/jobs/entities/job.entity";
import { Reply } from "src/module/reply/entities/reply.entity";
import { Seved } from "src/module/seved/entities/seved.entity";

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

  // Profile bilan bog'liqlik saqlanib qoladi
  @OneToOne(() => Profile, (profile) => profile.auth, { cascade: true, onDelete: "CASCADE" })
  profile: Profile;

  @OneToMany(() => SocialAccount, (social) => social.auth, { cascade: true, onDelete: "CASCADE" })
  socialAccounts: SocialAccount[];

  @OneToMany(() => Job, (job) => job.author, {cascade: true})
  jobs: Job[];

  @OneToMany(() => Reply, (reply) => reply.author, {cascade: true})
  replies: Reply[];
  
  @OneToMany(() => Seved, (seved) => seved.author, {cascade: true})
  seveds: Seved[];
}
