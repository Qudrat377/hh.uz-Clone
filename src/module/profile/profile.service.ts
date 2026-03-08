import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./entities/profile.entity";
import { ProfileBaseDto } from "./dto/profile-base.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import path from "path";
import fs from "fs";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  // added resume 
  async create(
    userId: number,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    try {
      const foundedProfile = await this.profileRepository.findOne({
        where: { auth: { id: userId } },
        relations: ["auth"],
      });

      if (!foundedProfile) throw new NotFoundException("Profile not found");

      if (file) {
        const imageName = file.filename;
        await this.profileRepository.update(foundedProfile.id, {
          resume: `http://localhost:${process.env.PORT}/uploads/${imageName}`,
        });
      }

      return { message: "Uploadet resume" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // deleted resume
  async deletedResume(userId: number): Promise<{ message: string }> {
    try {
      const foundedProfile = await this.profileRepository.findOne({
        where: { auth: { id: userId } },
        relations: ["auth"],
      });

      if (!foundedProfile) throw new NotFoundException("Profile not found");

      if (foundedProfile.resume) {
        const oldFileName = foundedProfile?.resume.split("/").pop();
        const oldImagePath = path.join(process.cwd(), "uploads", oldFileName!);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Eski faylni o'chirish
        }
        await this.profileRepository.update(foundedProfile.id, {
          resume: "",
        });
      }
      return { message: "Deleted resume profile" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async myProfile(userId: number): Promise<Profile> {
    try {
      const job = await this.profileRepository.findOne({
        where: { auth: { id: userId } },
        relations: ["auth"],
        order: { createdAt: "DESC" }, // Yangilari tepada turishi uchuna
      });

      if (!job) throw new NotFoundException("Profile not found");

      return job;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update profile
  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
    file: Express.Multer.File,
  ): Promise<Profile> {
    try {
      const foundedProfile = await this.profileRepository.findOne({
        where: { auth: { id: userId } },
        relations: ["auth"],
      });

      if (!foundedProfile) throw new NotFoundException("Profile not found");

      // 1. Eskisiga yangisini "qovushtiramiz" (merge)
      const updatedProfile = this.profileRepository.merge(
        foundedProfile,
        updateProfileDto,
      );

      if (file) {
        const imageName = file.filename;
        if (foundedProfile.avatarUrl) {
          const oldFileName = foundedProfile?.avatarUrl.split("/").pop();
          const oldImagePath = path.join(
            process.cwd(),
            "uploads",
            oldFileName!,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Eski faylni o'chirish
          }
        }

        updatedProfile.avatarUrl = `http://localhost:${process.env.PORT}/uploads/${imageName}`;
      }
      // 2. Bazaga saqlaymiz va yangilangan Profile-ni qaytaramiz
      return await this.profileRepository.save(updatedProfile);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // deleted image
  async remove(userId: number): Promise<{ message: string }> {
    try {
      const foundedProfile = await this.profileRepository.findOne({
        where: { auth: { id: userId } },
        relations: ["auth"],
      });

      if (!foundedProfile) throw new NotFoundException("Profile not found");

      if (foundedProfile.avatarUrl) {
        const oldFileName = foundedProfile?.avatarUrl.split("/").pop();
        const oldImagePath = path.join(process.cwd(), "uploads", oldFileName!);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Eski faylni o'chirish
        }
        await this.profileRepository.update(foundedProfile.id, {
          avatarUrl: "",
        });
      }
      return { message: "Deleted imag profile" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
