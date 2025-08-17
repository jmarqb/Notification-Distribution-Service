import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

  //TODO: DELETE - CONTROLLER IT'S ONLY FOR TESTING PURPOSES
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendEmail() {
    return this.emailService.sendEmail({
      to: ['jacmelbalu7@gmail.com'],
      body: 'prueba de correo',
      subject: 'testeando email',
    });
  }
}
