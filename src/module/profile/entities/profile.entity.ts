import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Auth } from "../../auth/entities/auth.entity"; // Yo'l o'zgardi
import { BaseEntity } from "src/database/base.entity";
import { UserRole } from "src/shared/constants/enum/user.role";

@Entity({ name: "profile" })
export class Profile extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, default: "" })
  from: string;

  @Column({ nullable: true, default: "" })
  latitude: string;

  @Column({ nullable: true, default: "" })
  longitude: string;

  // @Column({ type: "enum", enum: UserRole, default: UserRole.CANDIDATE })
  // role: UserRole;

  @Column({ nullable: true })
  resume: string;

  // Profil kimga tegishli ekanligini bilish uchun
  @OneToOne(() => Auth, (auth) => auth.profile, { onDelete: "CASCADE" })
  @JoinColumn()
  auth: Auth;
}