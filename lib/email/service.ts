import { Resend } from 'resend';
import { renderNotifyMeHtml, NotifyMeEmailProps } from './templates/notify-me';
import { renderLaunchAnnouncementHtml, LaunchAnnouncementEmailProps } from './templates/launch-announcement';

export interface EmailAuditRecord {
  id: string;
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  timestamp: string;
  provider: 'resend' | 'mock-audit';
  status: 'sent' | 'queued' | 'mocked';
}

const emailAuditStore: EmailAuditRecord[] = [];

export async function sendNotifyMeConfirmation(
  props: NotifyMeEmailProps
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { subject, html, text } = renderNotifyMeHtml(props);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@mail.empressglowemporium.com';
  const apiKey = process.env.RESEND_API_KEY;

  const isTestOrMockKey = !apiKey || apiKey === 're_placeholder' || apiKey.startsWith('re_test') || apiKey.includes('placeholder');

  if (isTestOrMockKey) {
    const record: EmailAuditRecord = {
      id: `mock-email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      to: props.email,
      from: fromEmail,
      subject,
      html,
      text,
      timestamp: new Date().toISOString(),
      provider: 'mock-audit',
      status: 'mocked',
    };
    emailAuditStore.unshift(record);
    console.log(`[EMAIL DISPATCH - MOCK AUDIT] To: ${props.email} | From: ${fromEmail} | Subject: "${subject}"`);
    return { success: true, id: record.id };
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: `Empress Glow Emporium <${fromEmail}>`,
      to: props.email,
      subject,
      html,
      text,
    });

    if (response.error) {
      console.error('[EMAIL RESEND ERROR]', response.error);
      return { success: false, error: response.error.message };
    }

    const record: EmailAuditRecord = {
      id: response.data?.id || `resend-${Date.now()}`,
      to: props.email,
      from: fromEmail,
      subject,
      html,
      text,
      timestamp: new Date().toISOString(),
      provider: 'resend',
      status: 'sent',
    };
    emailAuditStore.unshift(record);
    return { success: true, id: record.id };
  } catch (err: any) {
    console.error('[EMAIL EXCEPTION]', err);
    return { success: false, error: err.message || 'Unknown email transmission error' };
  }
}

export async function sendLaunchAnnouncement(
  props: LaunchAnnouncementEmailProps
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { subject, html, text } = renderLaunchAnnouncementHtml(props);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@mail.empressglowemporium.com';
  const apiKey = process.env.RESEND_API_KEY;

  const isTestOrMockKey = !apiKey || apiKey === 're_placeholder' || apiKey.startsWith('re_test') || apiKey.includes('placeholder');

  if (isTestOrMockKey) {
    const record: EmailAuditRecord = {
      id: `mock-launch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      to: props.email,
      from: fromEmail,
      subject,
      html,
      text,
      timestamp: new Date().toISOString(),
      provider: 'mock-audit',
      status: 'mocked',
    };
    emailAuditStore.unshift(record);
    console.log(`[LAUNCH BROADCAST - MOCK AUDIT] To: ${props.email} | From: ${fromEmail} | Subject: "${subject}"`);
    return { success: true, id: record.id };
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: `Empress Glow Emporium <${fromEmail}>`,
      to: props.email,
      subject,
      html,
      text,
    });

    if (response.error) {
      console.error('[LAUNCH BROADCAST ERROR]', response.error);
      return { success: false, error: response.error.message };
    }

    const record: EmailAuditRecord = {
      id: response.data?.id || `resend-launch-${Date.now()}`,
      to: props.email,
      from: fromEmail,
      subject,
      html,
      text,
      timestamp: new Date().toISOString(),
      provider: 'resend',
      status: 'sent',
    };
    emailAuditStore.unshift(record);
    return { success: true, id: record.id };
  } catch (err: any) {
    console.error('[LAUNCH BROADCAST EXCEPTION]', err);
    return { success: false, error: err.message || 'Unknown email transmission error' };
  }
}

export function getEmailAuditStore(): EmailAuditRecord[] {
  return [...emailAuditStore];
}

