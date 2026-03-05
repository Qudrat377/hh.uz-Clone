import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profile } from "./profile.entity";
import { SocialAccount } from "./socialAccount.entity";
import { UserRole } from "src/shared/constants/user.role";

@Entity({ name: "auth" })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: "0" })
  otp: string;

  @Column({ type: "bigint", nullable: true })
  otpTime: number;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToOne(() => Profile, (profile) => profile.auth, { cascade: true, onDelete: "CASCADE" })
  profile: Profile;

  @OneToMany(() => SocialAccount, (social) => social.auth, {cascade: true, onDelete: "CASCADE"} )
  socialAccounts: SocialAccount[];
}
