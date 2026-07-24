import { Resend } from "resend";

/**
 * All outbound email goes through Resend. When RESEND_API_KEY is missing
 * (local dev), sendMail logs the message to the console instead so the app
 * works with no email account at all.
 */
export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `\n✉️  [dev mail fallback] To: ${opts.to}\nSubject: ${opts.subject}\n${opts.text}\n`
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "PoorStudents <hello@poorstudents.eu>",
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  if (error) {
    throw new Error(`Resend failed to send "${opts.subject}" to ${opts.to}: ${error.message}`);
  }
}
