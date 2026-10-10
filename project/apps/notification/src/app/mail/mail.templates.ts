import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Handlebars from 'handlebars';
import { DigestTemplate, TEMPLATES_DIRECTORY } from './mail.constants';

const DATE_TIME_LENGTH = 16;

// An isolated environment keeps helpers away from the global Handlebars
const environment = Handlebars.create();

environment.registerHelper('formatDate', (date: Date | string) =>
  new Date(date).toISOString().slice(0, DATE_TIME_LENGTH).replace('T', ' ')
);

function readTemplate(name: string): string {
  return readFileSync(join(__dirname, TEMPLATES_DIRECTORY, name), 'utf-8');
}

export interface DigestTemplates {
  html: HandlebarsTemplateDelegate;
  text: HandlebarsTemplateDelegate;
}

export function compileDigestTemplates(): DigestTemplates {
  return {
    // Values are HTML-escaped by default
    html: environment.compile(readTemplate(DigestTemplate.Html)),
    // A plain text letter must not contain HTML entities
    text: environment.compile(readTemplate(DigestTemplate.Text), {
      noEscape: true,
    }),
  };
}
