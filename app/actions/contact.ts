'use server';

interface ContactState {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitContactForm(
  prevState: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = (formData.get('subject') as string) || 'General Inquiry';
    const message = formData.get('message') as string;

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name (at least 2 characters).' };
    }

    if (!email) {
      return { success: false, error: 'A valid email address is required.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.includes('<') || trimmedEmail.includes('>')) {
      return { success: false, error: 'Please provide a valid email format.' };
    }

    if (!message || message.trim().length < 10) {
      return { success: false, error: 'Please write a message with at least 10 characters.' };
    }

    const sanitizedName = name.replace(/[<>]/g, '').trim();
    const sanitizedSubject = subject.replace(/[<>]/g, '').trim();
    const sanitizedMessage = message.replace(/[<>]/g, '').trim();

    console.log(
      `[SERVER ACTION: CONTACT] from="${sanitizedName}" <${trimmedEmail}> subject="${sanitizedSubject}" message="${sanitizedMessage.slice(0, 50)}..."`
    );

    return {
      success: true,
      message: 'Thank you for reaching out! Mary and the Empress Glow team will respond to your message shortly.',
    };
  } catch (err: any) {
    console.error('Server action contact error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try contacting us directly on WhatsApp.',
    };
  }
}
