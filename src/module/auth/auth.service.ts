import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Auth } from "./entities/auth.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import {
  CreateAuthDto,
  ForgotPasswordAuthDto,
  LoginAuthDto,
  ResentOtpAuthDto,
} from "./dto/create-auth.dto";
import { generateOtp } from "src/common/utils/generateResetOtp";
import { MailService } from "src/providers/mail/mail.service";
import { UserService } from "./user/user.service";
import { QueryDto } from "./dto/query.dto";
import { VerifyAuthDto } from "./dto/verify.dto";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService,
    private readonly logger: LoggerService, // Bizning servis
  ) {}

  // 1. O'zgaruvchini shu yerda e'lon qiling
  private readonly context = "AuthService";

  // registeratsiya
  async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    try {
      const { email, password, role, firstName, from } = createAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (foundedUser) {
        this.logger.warn(
          `Foydalanuvchi (email: ${email}) i avvaldan bor`, 
          this.context
        );
        throw new BadRequestException("Email already exists");
      }

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

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Yangi foydalanuvchi kirdi: email ${email}, Muallif : ${firstName}`,
        this.context,
      );

      return { message: "Registered" };
    } catch (error) {
      this.logger.error(
        `Registratsiyada xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  // google login
  async googleLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);
    const payload = { id: user.id, email: user.email, roles: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    // 1. Muvaffaqiyatli amal uchun INFO log
    this.logger.log(
      `Yangi foydalanuvchi kirdi: email ${userData?.socialAccounts?.provider}, Muallif : ${userData?.profile?.firstName}`,
      this.context,
    );

    return {
      access_token,
      message: "Success",
    };
  }

  // google login
  async githubLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);
    const payload = { id: user.id, email: user.email, roles: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    // 1. Muvaffaqiyatli amal uchun INFO log
    this.logger.log(
      `Yangi foydalanuvchi kirdi: email ${userData?.socialAccounts?.provider}, Muallif : ${userData?.profile?.firstName}`,
      this.context,
    );

    return {
      access_token,
      message: "Success",
    };
  }

  async verify(
    verifyAuthDto: VerifyAuthDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundedUser) throw new BadRequestException("User not found");

      const otpValidation = /^\d{6}$/.test(otp);

      if (!otpValidation) throw new BadRequestException("Wrong otp validation");

      const time = Date.now();

      if (time > foundedUser.otpTime)
        throw new BadRequestException("Otp expired");

      if (otp !== foundedUser.otp) throw new BadRequestException("Wrong otp");

      await this.authRepository.update(foundedUser.id, { otp: "", otpTime: 0 });

      const payload = {
        id: foundedUser.id,
        email: foundedUser.email,
        roles: foundedUser.role,
      };
      const access_token = await this.jwtService.signAsync(payload);

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Yangi foydalanuvchi verifikatsiyadan o'tdi: email ${email}, Muallif : ${otp}`,
        this.context,
      );

      return {
        access_token,
      };
    } catch (error) {
      this.logger.error(
        `verifyda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{ message: string }> {
    try {
      const { email, password } = loginAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
        relations: ["profile", "socialAccounts"],
      });

      if (!foundedUser) throw new UnauthorizedException("User not found");

      if (!foundedUser.password)
        throw new UnauthorizedException(
          `${foundedUser.profile?.firstName} siz ${foundedUser.socialAccounts[0]?.provider} orqali kirganingiz uchun sizda parol yo'q. Parolni almashtirish tugmasini bosing`,
        );

      const comp = await bcrypt.compare(password, foundedUser.password!);

      if (comp) {
        const payload = {
          id: foundedUser.id,
          email: foundedUser.email,
          roles: foundedUser.role,
        };
        const access_token = await this.jwtService.signAsync(payload);

        // 1. Muvaffaqiyatli amal uchun INFO log
        this.logger.log(
          `Foydalanuvchi login qildi: email ${email}, Muallif : ${password}`,
          this.context,
        );

        return { message: access_token };
      } else {
        return { message: "Wrong password" };
      }
    } catch (error) {
      this.logger.error(
        `Login qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async resendOtp(
    resentOtpAuthDto: ResentOtpAuthDto,
  ): Promise<{ message: string }> {
    try {
      const { email } = resentOtpAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundedUser) throw new NotFoundException("User not found");

      const code = generateOtp();

      const time = Date.now() + 120000;

      await this.authRepository.update(foundedUser.id, {
        otp: code,
        otpTime: time,
      });

      await this.mailService.sendOtpEmail(email, code);

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Foydalanuvchiga kod yuborildi: email ${email}, Muallif : ${code}`,
        this.context,
      );

      return { message: "Otp sent. Please check your email" };
    } catch (error) {
      this.logger.error(
        `Resent otp qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async forgotPassword(
    forgotPasswordAuthDto: ForgotPasswordAuthDto,
  ): Promise<{ message: string }> {
    try {
      const { email, otp, new_password } = forgotPasswordAuthDto;
      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundedUser) throw new BadRequestException("User not found");

      const otpValidation = /^\d{6}$/.test(otp);

      if (!otpValidation) throw new BadRequestException("Wrong otp validation");

      const time = Date.now();

      if (time > foundedUser.otpTime)
        throw new BadRequestException("Otp expired");

      if (otp !== foundedUser.otp) throw new BadRequestException("Wrong otp");

      const hashPassword = await bcrypt.hash(new_password, 10);

      await this.authRepository.update(foundedUser.id, {
        password: hashPassword,
      });

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Yangi foydalanuvchi kirdi: email ${email}, Muallif : ${new_password}`,
        this.context,
      );

      return {
        message: "forgotPassword",
      };
    } catch (error) {
      this.logger.error(
        `Forgot password qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllUser(query: QueryDto) {
    try {
      const { page = 1, limit = 10, search } = query;

      const queryBuilder = await this.authRepository
        .createQueryBuilder("auth")
        .leftJoinAndSelect("auth.profile", "profile")
        .leftJoinAndSelect("auth.socialAccounts", "socialAccounts");
      // .where("article.isActive = :isActive", {isActive: true})
      // .where("auth.deletedAt is null");

      if (search) {
        queryBuilder.andWhere(
          "(auth.email ILIKE :search OR profile.firstName ILIKE :search OR profile.lastName ILIKE :search OR profile.from ILIKE :search)",
          {
            search: `%${search}%`,
          },
        );
      }

      const total = await queryBuilder.getCount();

      const result = await queryBuilder
        .orderBy("auth.createdAt", "DESC")
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        next: total > page * limit ? { page: page + 1 } : undefined,
        prev: page > 1 ? { page: page - 1, limit } : undefined,
        totalPage: Math.ceil(total / limit),
        result,
      };
    } catch (error) {
      this.logger.error(
        `Find all qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      const foundedArticle = await this.authRepository.findOne({
        where: { id },
      });

      if (!foundedArticle) throw new NotFoundException("User not found");

      await this.authRepository.softDelete(foundedArticle.id);

      return {
        message: "Deleted article",
      };
    } catch (error) {
      this.logger.error(
        `Delete user qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
