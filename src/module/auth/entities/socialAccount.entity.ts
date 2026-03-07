import { Column, Entity, ManyToOne } from "typeorm";
import { Auth } from "./auth.entity";
import { BaseEntity } from "src/database/base.entity";

@Entity({name: "socialAccount"})
export class SocialAccount extends BaseEntity {
    @Column({nullable: true})
    provider: string;

    @Column({nullable: true})
    externalId: string;

    @ManyToOne(() => Auth, (auth) => auth.socialAccounts, { onDelete: "CASCADE" })
    auth: Auth
}