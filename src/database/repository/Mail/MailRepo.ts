import sgMail from '@sendgrid/mail';

import { htmlTemplate } from './template';

export default function sendEmail({
  subject,
  subTitle,
  content,
  header,
  to,
}: {
  subject: string;
  subTitle: string;
  content: string;
  header: string;
  to: string;
}) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

  const msg = {
    to,
    from: '21520946@gm.uit.edu.vn',
    subject,
    text: subTitle || 'E-Tour Business',
    html: htmlTemplate
      .replace('{{title}}', header)
      .replace('{{content}}', content),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
}
