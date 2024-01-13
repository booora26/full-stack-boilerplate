import { Body, Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('bill')
  async sendBill(
    @Body('to') to: string,
    @Body('referenceNumber') referenceNumber: string,
  ) {
    try {
      const subject = `Instrukcije za placanje za ${referenceNumber}`;
      const text = 'U prilogu maila su instrukcije za placanje racuna';

      const result = await this.emailService.sendBill(
        to,
        subject,
        text,
        referenceNumber,
      );
      return { message: 'Email sent successfully', result };
    } catch (error) {
      return { message: 'Error sending email', error };
    }
  }
  @Get('event')
  async sendCalendarEvent(@Body() body) {
    try {
      const {
        to,
        subject,
        startTime,
        endTime,
        summary,
        description,
        location,
        url,
        name,
        email,
      } = body;

      const result = await this.emailService.sendCalendarEvent(
        to,
        subject,
        startTime,
        endTime,
        summary,
        description,
        location,
        url,
        name,
        email,
      );
      return { message: 'Email sent successfully', result };
    } catch (error) {
      return { message: 'Error sending email', error };
    }
  }
}
