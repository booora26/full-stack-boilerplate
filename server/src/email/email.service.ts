import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { writeFile, readFile } from 'fs/promises';
import ical, { ICalCalendarMethod, ICalEventStatus } from 'ical-generator';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bgluvacevic@gmail.com', // Vaš Gmail korisnički nalog
        pass: 'eprp rghn yknk gqor', // Lozinka za Gmail nalog
      },
    });
  }

  async sendBill(
    to: string,
    subject: string,
    text: string,
    referenceNumber: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const file = await readFile(`./src/bill/storage/${referenceNumber}.pdf`);
    const htmlBody = this.generateHtmlBody(subject, text);
    const attachments = [
      {
        // stream as an attachment
        filename: `${referenceNumber}-instrukcije-za-placanje.pdf`,
        content: file,
      },
    ];

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'bgluvacevic@gmail.com', // Vaš Gmail korisnički nalog
      to,
      subject,
      html: htmlBody,
      attachments,
      //   icalEvent: {
      //     filename: 'invitation.ics',
      //     method: 'publish',
      //     content: content,
      //   },
    };

    return this.transporter.sendMail(mailOptions);
  }

  generateHtmlBody(subject: string, text?: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">

        <img src="https://placeholderlogo.com/img/placeholder-logo-7.png" />
  
          <h1 style="color: #333;">${subject}</h1>
  
          <p style="color: #666;">${text}</p>
  
          <p style="color: #888;">Best regards,<br>Your Name</p>
  
        </div>
  
      </body>
      </html>
    `;
  }

  async sendCalendarEvent(
    to: string,
    subject: string,
    startTime: Date,
    endTime: Date,
    summary?: string,
    description?: string,
    location?: string,
    url?: string,
    name?: string,
    email?: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const htmlBody = this.generateHtmlBody(subject);

    const calendar = await this.generateCalendarEvent(
      startTime,
      endTime,
      summary,
      description,
      location,
      url,
      name,
      email,
    );

    const content = calendar.toString();

    console.log(calendar);

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'bgluvacevic@gmail.com', // Vaš Gmail korisnički nalog
      to,
      subject,
      html: htmlBody,
      //   headers: {
      //     'x-invite': {
      //       prepared: true,
      //       value: subject,
      //     },
      //   },
      //   icalEvent: {
      //     filename: `${subject}.ics`,
      //     // method: 're',
      //     content: content,
      //   },
      alternatives: [
        {
          contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
          content: content,
        },
      ],
    };

    return this.transporter.sendMail(mailOptions);
  }

  async generateCalendarEvent(
    startTime,
    endTime,
    summary,
    description,
    location,
    url,
    name,
    email,
  ) {
    const cal = ical({
      //   domain: 'mytestwebsite.com',
      name: 'New event',
      timezone: 'Europe/Paris',
      method: ICalCalendarMethod.REQUEST,
    });
    // cal.domain('mytestwebsite.com');
    console.log('create event', cal);

    const start = startTime.split(',');
    const end = endTime.split(',');

    cal.createEvent({
      start: new Date(start[0], start[1] - 1, start[2], start[3], start[4]), // eg : moment()
      end: new Date(end[0], end[1] - 1, end[2], end[3], end[4]), // eg : moment(1,'days')
      summary: summary, // 'Summary of your event'
      description: description, // 'More description'
      location: location, // 'Delhi'
      url: url, // 'event url'
      status: ICalEventStatus.CONFIRMED,
      organizer: {
        // 'organizer details'
        name: name,
        email: email,
      },
    });

    return cal;
  }
}
