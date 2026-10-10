export const MAIL_DIGEST_SUBJECT = 'New publications on Readme';

// Templates are copied to the "assets" folder of the build
export const TEMPLATES_DIRECTORY = 'assets/templates';

export const DigestTemplate = {
  Html: 'new-publications.html.hbs',
  Text: 'new-publications.text.hbs',
} as const;
