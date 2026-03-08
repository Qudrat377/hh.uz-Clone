import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(private configService: ConfigService) {
    super({
      callbackURL: "http://localhost:4042/auth/github/callback",
      clientID: configService.get<string>("GITHUB_CLIENT_ID")!,
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET")!,
      scope: ["user:email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {

      const { emails, photos, provider, id } = profile;
console.log(profile);

      const user = {
        email: emails[0].value,
        accessToken,
        profile: {
          firstName: profile.displayName ? profile.displayName : profile.username,
          avatarUrl: photos[0]?.value || "",
        },

        socialAccounts: [
          {
            provider: provider,
            externalId: id, // Yoki Google bergan unique ID
          },
        ],
      };
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
