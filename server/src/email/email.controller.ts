import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Options,
  Res,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

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
  @Get('event-generate')
  async generateCalendarEvent(@Res() res: Response, @Body() body) {
    try {
      const {
        startTime,
        endTime,
        summary,
        description,
        location,
        url,
        name,
        email,
      } = body;

      const result = await this.emailService.generateCalendarEvent(
        startTime,
        endTime,
        summary,
        description,
        location,
        url,
        name,
        email,
      );
      res.header(
        'Content-Type',
        'text/calendar; charset=utf-8; method=REQUEST; name=invite.ics',
      );
      res.header(
        'Content-Disposition',
        `attachment; filename=${summary.replaceAll(' ', '-')}.ics`,
      );
      res.send(result.toString());
    } catch (error) {
      return { message: 'Error sending email', error };
    }
  }
}
