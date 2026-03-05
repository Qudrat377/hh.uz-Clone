import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Auth } from "./entities/auth.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { generateOtp } from "src/common/utils/generateResetOtp";
import { MailService } from "src/providers/mail/mail.service";
import { UserService } from "./user/user.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    try {
      const { firstName, email, password, from, role } = createAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (foundedUser) throw new BadRequestException("Email already exists");

      const hashPassword = await bcrypt.hash(password, 10);
      const code = generateOtp();

      await this.mailService.sendOtpEmail(email, code);

      const time = Date.now() + 120000;

      const user = this.authRepository.create({
        email,
        password: hashPassword,
        otp: code,
        otpTime: time,
        role: role,
        profile: {
          firstName,
          from: from ? from : "",
        },
      });

      await this.authRepository.save(user);

      return { message: "Registered" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // google login
  async googleLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);
    const payload = { id: user.id, email: user.email, roles: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      message: "Success",
    };
  }


  
}

// // 2. Yangi foydalanuvchi yaratish (Agar bazada bo'lmasa)
//     const newUser = this.userRepository.create({
//       email: googleUser.email,
//       // Diqqat: { cascade: true } bo'lgani uchun Profile va SocialAccount-ni shunchaki biriktiramiz
//       profile: {
//         firstName: googleUser.firstName,
//         lastName: googleUser.lastName,
//         avatarUrl: googleUser.picture
//       },
//       socialAccounts: [
//         {
//           provider: 'google',
//           externalId: googleUser.accessToken // Yoki Google bergan unique ID
//         }
//       ]
//     });
