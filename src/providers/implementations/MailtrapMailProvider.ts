import nodemailer from 'nodemailer';
import { IMailProvider, IMessage } from '../IMailProvider';
import Mail from 'nodemailer/lib/mailer';

export class MailtrapMailProvider implements IMailProvider {
	private transporter: Mail;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: '3358c84be1d4fc',
				pass: 'f3f1eddeaea5c6',
			},
		});
	}

	async sendMail(message: IMessage): Promise<void> {
		await this.transporter.sendMail({
			to: {
				name: message.to.name,
				address: message.to.email,
			},
			from: {
				name: message.from.name,
				address: message.from.email,
			},
			subject: message.subject,
			html: message.body,
		});
	}
}
