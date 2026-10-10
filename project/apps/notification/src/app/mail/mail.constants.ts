export const MAIL_DIGEST_SUBJECT = 'New publications on Readme';

export const MAX_SMTP_CONNECTIONS = 5;
export const SMTPS_PORT = 465;

// Templates are copied to the "assets" folder of the build
export const TEMPLATES_DIRECTORY = 'assets/templates';

export const DigestTemplate = {
  Html: 'new-publications.html.hbs',
  Text: 'new-publications.text.hbs',
} as const;
