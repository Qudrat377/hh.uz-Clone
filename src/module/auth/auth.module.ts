import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "./entities/auth.entity";
// import { Profile } from "./entities/profile.entity";
import { SocialAccount } from "./entities/socialAccount.entity";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/providers/mail/mail.module";
import { JwtStrategy } from "./jwt-strategy";
import { GoogleStrategy } from "./google-strategy";
import { GithubStrategy } from "./github-strategy";
import { UserModule } from "./user/user.module";
import { JobsModule } from "../jobs/jobs.module";
import { ProfileModule } from "../profile/profile.module";
import { ReplyModule } from "../reply/reply.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth, SocialAccount]),
        JwtModule.register({
            global: true,
            secret: String(process.env.SECRET),
            signOptions: {expiresIn: "5d"}
        }),
        MailModule,
        UserModule,
        // JobsModule,
        ProfileModule,
        // ReplyModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
    exports: [AuthService, TypeOrmModule],
})

export class AuthModule {}