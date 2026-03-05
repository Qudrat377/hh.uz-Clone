import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "../entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(Auth) private userRepository: Repository<Auth>) {}

    async findOrCreate(userData: any): Promise<Auth> {
    // userData ichidan ma'lumotlarni ajratib olamiz
    // GoogleStrategy yuborgan nom bilan (socialAccountData)
    const { email, profile, socialAccountData } = userData;

    let user = await this.userRepository.findOne({
        where: { email },
        relations: ['profile', 'socialAccounts']
    });

    if (user) {
        // Profilni yangilaymiz
        this.userRepository.merge(user, { profile });

        // Social account bor-yo'qligini tekshiramiz
        const hasSocial = user.socialAccounts?.some(
            acc => acc.provider === socialAccountData.provider && acc.externalId === socialAccountData.externalId
        );

        if (!hasSocial) {
            // MUHIM: Entity dagi nomi 'socialAccounts' (ko'plikda)
            user.socialAccounts.push(socialAccountData);
        }
    } else {
        // Yangi user yaratishda Entity maydon nomiga (socialAccounts) moslaymiz
        user = this.userRepository.create({
            email,
            profile,
            socialAccounts: [socialAccountData] // socialAccountData EMAS, socialAccounts
        });
    }

    return await this.userRepository.save(user);
}

    async findByEmail(email: string): Promise<Auth | null> {
        return this.userRepository.findOne({where: {email}})
    }
}