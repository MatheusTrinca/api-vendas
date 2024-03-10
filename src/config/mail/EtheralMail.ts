import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface IMailContact {
  name: string;
  email: string;
}

interface IParseMailVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  template: string;
  variables: IParseMailVariable;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    // Generate SMTP service account from ethereal.email
    const account = await nodemailer.createTestAccount();

    const handlebarsMailTemplate = new HandlebarsMailTemplate();

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    const message = {
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from?.name || 'Equipe API Vendas',
        address: from?.email || 'equipe@apivendas.com',
      },
      subject,
      html: await handlebarsMailTemplate.parse(templateData),
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
