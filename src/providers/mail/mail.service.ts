import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "assomad377@gmail.com",
            pass: process.env.APP_KEY,
        }
    })
}

  async sendOtpEmail(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: "assomad377@gmail.com",
        to: email,
        subject: 'Tasdiqlash kodi - Hh.uz Clone',
        html: `
          <div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #333;">Ro'yxatdan o'tishni tasdiqlang</h2>
            <p>Sizning 6 xonali tasdiqlash kodingiz:</p>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">Ushbu kod 2 daqiqa davomida amal qiladi.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <small style="color: #999;">Agar siz ushbu so'rovni yubormagan bo'lsangiz, ushbu xatga e'tibor bermang.</small>
          </div>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw new Error('Email yuborish tizimida muammo yuzaga keldi');
    }
  }

}

// await this.transporter.sendMail({
//         from: "assomad377@gmail.com",
//         to: email,
//         subject: "Otp",
//         text: "Simple",
//         html: `<b>${code}</b>`,
//       });