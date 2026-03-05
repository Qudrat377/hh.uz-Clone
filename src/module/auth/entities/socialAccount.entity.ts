import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "./auth.entity";

@Entity({name: "socialAccount"})
export class SocialAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "google"})
    provider: string;

    @Column({default: "1"})
    externalId: string;

    @ManyToOne(() => Auth, (auth) => auth.socialAccounts, { onDelete: "CASCADE" })
    auth: Auth
}