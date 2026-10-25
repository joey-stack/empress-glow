export interface NotifyMeEmailProps {
  email: string;
  name?: string | null;
  productSlug?: string;
}

export function getProductName(productSlug?: string): string {
  switch (productSlug) {
    case 'empress-glow-fruity-soap':
      return 'Empress Glow Fruity Soap';
    case 'empress-glow-serum':
      return 'Empress Glow Botanical Serum';
    case 'botanical-cleanser':
      return 'Empress Glow Gentle Fruit Gel Cleanser';
    case 'radiance-body-polish':
      return 'Empress Glow Papaya & Citrus Body Polish';
    default:
      return 'Empress Glow VIP Launch Collection';
  }
}

export function renderNotifyMeHtml(props: NotifyMeEmailProps): { subject: string; html: string; text: string } {
  const customerName = props.name ? props.name.trim() : 'Valued Customer';
  const productName = getProductName(props.productSlug);
  const subject = `You're on the list for ${productName}`;
  const whatsappUrl = 'https://wa.me/2348035650299';
  const unsubscribeUrl = `https://empressglowemporium.com/unsubscribe?email=${encodeURIComponent(props.email)}`;

  const text = `
Dear ${customerName},

Thank you for your interest in Empress Glow Emporium! You are officially on the priority notification list for ${productName}.

We are currently finalizing our NAFDAC registration to ensure you receive only the highest standard of handcrafted botanical care. You'll be the very first to know the moment orders officially open.

In the meantime, have questions about your skincare routine or want personalized guidance?
Chat directly with us on WhatsApp: ${whatsappUrl}

NAFDAC Notice:
These claims have not been evaluated by NAFDAC. Our formulations are handcrafted with traditional botanical ingredients.

Empress Glow Emporium
Abuja, Nigeria
Data Protection Officer: dpo@empressglowemporium.com
To opt out of future notifications: ${unsubscribeUrl}
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f1e8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #131010;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f1e8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 0px; border: 1px solid #e5dcd0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #131010; padding: 32px 40px; text-align: center;">
              <span style="display: inline-block; background-color: #2d5508; color: #ffffff; font-weight: bold; font-size: 14px; width: 36px; height: 36px; line-height: 36px; border-radius: 0px; text-align: center; margin-bottom: 12px;">EG</span>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 400; font-family: Georgia, serif; letter-spacing: 0.5px;">
                Empress Glow Emporium
              </h1>
              <p style="margin: 6px 0 0; color: #5a8210; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                Handcrafted Nigerian Botanicals
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #524f46;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #3d3b35;">
                Warm greetings from Mary Asuquo and the entire Empress Glow Emporium family. You are officially confirmed on our exclusive priority list for <strong style="color: #2d5508;">${productName}</strong>.
              </p>

              <!-- Status Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #fdfaf4; border-left: 4px solid #2d5508; border-radius: 0px; padding: 16px 20px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #2d5508; display: block; margin-bottom: 4px;">Launch Preparation Notice</span>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #7b7366;">
                      We're currently finalizing our NAFDAC registration to ensure you receive only the highest standard of handcrafted botanical care. You'll be the very first to know when orders officially open.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Consultation CTA -->
              <div style="margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #736e63;">
                  Have questions about your skincare routine in the meantime?
                </p>
                <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #2d5508; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 0px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Chat Directly on WhatsApp →
                </a>
              </div>

              <!-- Mandatory NAFDAC Caution -->
              <div style="border-top: 1px solid #f0ede6; padding-top: 20px; margin-top: 24px;">
                <p style="margin: 0; font-size: 11px; color: #7b7366; line-height: 1.5; font-style: italic;">
                  *These claims have not been evaluated by NAFDAC. Empress Glow Emporium preparations are inspired by traditional West African fruit and botanical knowledge and are not intended to diagnose, cure, or treat any medical conditions.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f1e8; border-top: 1px solid #e5dcd0; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 11px; color: #7b7366;">
                Empress Glow Emporium • Abuja, Nigeria
              </p>
              <p style="margin: 0 0 12px; font-size: 11px; color: #7b7366;">
                Data Protection Officer: <a href="mailto:dpo@empressglowemporium.com" style="color: #2d5508; text-decoration: none;">dpo@empressglowemporium.com</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #b4afa4;">
                You received this commercial notification because you signed up on our website. 
                <a href="${unsubscribeUrl}" style="color: #7b7366; text-decoration: underline;">Unsubscribe / Opt Out</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text };
}
