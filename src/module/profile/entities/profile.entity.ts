import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";

@Entity({ name: "profile" })
export class Profile extends BaseEntity {
  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({nullable: true, default: "" })
  from: string;

  @Column({nullable: true, default: "" })
  latitude: string;

  @Column({nullable: true, default: ""})
  longitude: string;

  @Column({nullable: true})
  resume: string;

  @OneToOne(() => Auth, (auth) => auth.profile, {onDelete: "CASCADE"} )
  @JoinColumn()
  auth: Auth;
}
