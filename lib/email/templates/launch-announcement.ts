export interface LaunchAnnouncementEmailProps {
  email: string;
  name?: string | null;
}

export function renderLaunchAnnouncementHtml(props: LaunchAnnouncementEmailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const customerName = props.name ? props.name.trim() : 'Valued Empress';
  const subject = 'Empress Glow is officially live — Your radiant skin awaits';
  const shopUrl = 'https://empressglowemporium.com/shop';
  const whatsappUrl = 'https://wa.me/2348035650299';
  const unsubscribeUrl = `https://empressglowemporium.com/unsubscribe?email=${encodeURIComponent(props.email)}`;

  const text = `
Dear ${customerName},

We're registered. We're officially live!

The wait is over. Empress Glow Fruity Soap and our handcrafted botanical collection are now available for immediate purchase online.

HERO PRODUCT: EMPRESS GLOW FRUITY SOAP
Handcrafted fruit enzyme formulation supporting natural melanin radiance:
• Small (150g) — ₦3,000
• Medium (300g) — ₦7,000
• Large (500g) — ₦11,000
• Extra Large (1kg) — ₦16,000

Shop the Collection Now: ${shopUrl}

Have questions or need routine advice before ordering?
Chat directly with our skincare specialists on WhatsApp: ${whatsappUrl}

---
REGULATORY & LEGAL DISCLOSURES:
NAFDAC Notice: These claims have not been evaluated by NAFDAC. Our formulations are handcrafted with traditional botanical ingredients.
FCCPC Return Policy: Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return.
Empress Glow Emporium | Abuja, Nigeria | CAC Reg.
NDPA Data Protection Officer: dpo@empressglowemporium.com
To unsubscribe from marketing broadcasts: ${unsubscribeUrl}
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
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 0px; border: 1px solid #eae7e1; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #131010; padding: 36px 30px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #5a8210; font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">
                Official Store Launch
              </p>
              <h1 style="margin: 0; color: #f7f1e8; font-size: 26px; font-weight: 700; letter-spacing: -0.02em;">
                Empress Glow Emporium
              </h1>
              <p style="margin: 6px 0 0 0; color: #e4d8c8; font-size: 14px; font-style: italic;">
                "...Own your spot."
              </p>
            </td>
          </tr>

          <!-- Main Announcement Content -->
          <tr>
            <td style="padding: 40px 32px 30px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2d5508;">
                Dear ${customerName},
              </p>
              <h2 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 700; color: #131010; line-height: 1.3;">
                We're registered. We're officially live!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #5a5751;">
                The wait is over! Empress Glow Fruity Soap and our entire handcrafted botanical collection are now available for purchase online. Thank you for being a part of our founding waitlist.
              </p>

              <!-- Product Showcase Box -->
              <div style="background-color: #f7f5f0; border-radius: 0px; border: 1px solid #e8e3d8; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #2d5508; letter-spacing: 0.05em;">
                  Featured Botanical Care
                </p>
                <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #131010;">
                  Empress Glow Fruity Soap
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #5a5751; line-height: 1.5;">
                  Handcrafted with pure botanical enzymes from fresh papaya, avocado, banana, and berries to gently restore natural radiance.
                </p>

                <!-- Pricing Table -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 8px;">
                  <tr style="border-bottom: 1px solid #ded8cc;">
                    <td style="padding: 8px 0; font-size: 14px; color: #131010; font-weight: 600;">Small (150g)</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #2d5508; font-weight: 700; text-align: right;">₦3,000</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ded8cc;">
                    <td style="padding: 8px 0; font-size: 14px; color: #131010; font-weight: 600;">Medium (300g)</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #2d5508; font-weight: 700; text-align: right;">₦7,000</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ded8cc;">
                    <td style="padding: 8px 0; font-size: 14px; color: #131010; font-weight: 600;">Large (500g)</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #2d5508; font-weight: 700; text-align: right;">₦11,000</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #131010; font-weight: 600;">Extra Large (1kg)</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #2d5508; font-weight: 700; text-align: right;">₦16,000</td>
                  </tr>
                </table>
              </div>

              <!-- Primary Shop CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 28px 0 20px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="${shopUrl}" style="display: inline-block; background-color: #2d5508; color: #ffffff; padding: 16px 36px; border-radius: 0px; font-size: 16px; font-weight: 700; text-decoration: none; letter-spacing: 0.02em;">
                      Shop the Collection Now →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Consultation Secondary CTA -->
              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #5a5751; text-align: center;">
                Need personal advice on choosing the best routine for your skin?
                <br>
                <a href="${whatsappUrl}" style="color: #2d5508; font-weight: 600; text-decoration: underline;">
                  Chat with Mary on WhatsApp for a Complimentary Consultation
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer Disclosures -->
          <tr>
            <td style="background-color: #f7f5f0; padding: 24px 32px; border-top: 1px solid #eae7e1; font-size: 12px; line-height: 1.5; color: #878278;">
              <p style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #2d5508; letter-spacing: 0.05em;">
                Regulatory & Legal Disclosures
              </p>
              <p style="margin: 0 0 8px 0;">
                <strong>NAFDAC Notice:</strong> These claims have not been evaluated by NAFDAC. Our formulations are handcrafted with traditional botanical ingredients.
              </p>
              <p style="margin: 0 0 12px 0;">
                <strong>FCCPC Policy:</strong> Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return.
              </p>
              <p style="margin: 0 0 6px 0;">
                Empress Glow Emporium • Abuja, Nigeria • Registered CAC Enterprise
              </p>
              <p style="margin: 0;">
                NDPA 2023 DPO: <a href="mailto:dpo@empressglowemporium.com" style="color: #878278; text-decoration: underline;">dpo@empressglowemporium.com</a> • 
                <a href="${unsubscribeUrl}" style="color: #878278; text-decoration: underline;">Unsubscribe</a>
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
