import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "../entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Auth) private userRepository: Repository<Auth>,
  ) {}

  async findOrCreate(userData: any): Promise<Auth> {
    // userData ichida socialAccounts massiv bo'lib kelyapti
    const { email, profile, socialAccounts } = userData;
    const incomingAccount = socialAccounts[0]; // Kelayotgan yangi account ma'lumoti

    let user = await this.userRepository.findOne({
      where: { email },
      relations: ["profile", "socialAccounts"],
    });

    if (user) {
      // 1. Profilni yangilaymiz
      this.userRepository.merge(user, { profile });

      // 2. some() orqali tekshiramiz: Bazadagi accountlar ichida
      // hozir kelgan provider (google) va id bormi?
      const hasSocial = user.socialAccounts?.some(
        (acc) =>
          acc.provider === incomingAccount.provider &&
          acc.externalId === incomingAccount.externalId,
      );

      // 3. Agar bazada bu social account hali yo'q bo'lsa, qo'shamiz
      if (!hasSocial) {
        user.socialAccounts.push(incomingAccount);
      }
    } else {
      // 4. Yangi user yaratish
      user = this.userRepository.create({
        email,
        profile,
        socialAccounts: [incomingAccount],
      });
    }

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
