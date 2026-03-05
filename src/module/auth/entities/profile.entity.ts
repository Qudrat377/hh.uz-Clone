import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auth } from "./auth.entity";

@Entity({ name: "profile" })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => Auth, (auth) => auth.profile, {onDelete: "CASCADE"} )
  @JoinColumn()
  auth: Auth;
}
