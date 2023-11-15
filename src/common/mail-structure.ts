interface MailStructure {
  from: string;
  to: string;
  cc: string;
  subject: string;
  text?: string;
  html?: string;
}

const mailStructure = (
  from: string,
  to: string,
  cc: string,
  subject: string,
  body: string,
  html: boolean = false,
): MailStructure => {
  const mailStructure: MailStructure = {
    from,
    to,
    cc,
    subject,
    [html ? 'html' : 'text']: body,
  };

  return mailStructure;
};

export { mailStructure };
