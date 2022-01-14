export interface IEmailMessage {
  to: string;
  subject: string;
}

export interface BodyEmailMessage extends IEmailMessage {
  body: string;
}

export interface TemplateEmailMessage extends IEmailMessage {
  template: string;
  context: any;
}
