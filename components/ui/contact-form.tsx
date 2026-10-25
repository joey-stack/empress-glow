'use client';

import React, { useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Skincare Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      setStatus('error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim()) || email.includes('<') || email.includes('>')) {
      setErrorMessage('Please provide a valid email format.');
      setStatus('error');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please provide a message with at least 10 characters.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again or reach out on WhatsApp.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection lost. Please contact us directly on WhatsApp.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white border border-[#e5dcd0] rounded-none p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-none border border-[#2d5508] bg-[#f7f5f0] text-[#2d5508] flex items-center justify-center mx-auto text-xl font-mono">
          ✓
        </div>
        <h3 className="font-serif text-2xl text-[#131010]">Message Received</h3>
        <p className="font-mono text-xs text-[#524b42] max-w-md mx-auto leading-relaxed">
          Thank you for reaching out, <span className="font-semibold text-[#131010]">{name}</span>. Mary and the Empress Glow team will review your inquiry and reply to <span className="font-semibold text-[#131010]">{email}</span> within 24 hours.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center font-mono text-xs">
          <button
            onClick={() => {
              setStatus('idle');
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="text-[#2d5508] hover:underline uppercase tracking-wider"
          >
            Send Another Message
          </button>
          <span className="hidden sm:inline text-[#e5dcd0]">•</span>
          <a
            href="https://wa.me/2348035650299"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#131010] hover:text-[#2d5508] underline uppercase tracking-wider"
          >
            Connect on WhatsApp →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e5dcd0] rounded-none p-6 sm:p-10 space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-[#131010] font-normal">Send Us a Direct Message</h3>
        <p className="font-mono text-xs text-[#7b7366] mt-1">
          Have questions regarding formulations, orders, wholesale partnerships, or press inquiries? Fill out the details below.
        </p>
      </div>

      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-none bg-red-50 border border-red-200 text-red-800 font-mono text-xs leading-relaxed"
        >
          <span className="font-semibold block mb-0.5">Please check your submission:</span>
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1.5">
            Full Name <span className="text-[#2d5508]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mary Chukwu"
            className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] bg-white text-[#131010] font-mono text-xs focus:outline-none focus:border-[#2d5508] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1.5">
            Email Address <span className="text-[#2d5508]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] bg-white text-[#131010] font-mono text-xs focus:outline-none focus:border-[#2d5508] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1.5">
          Inquiry Topic
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] bg-white text-[#131010] font-mono text-xs focus:outline-none focus:border-[#2d5508] transition-colors"
        >
          <option value="Skincare Consultation Inquiry">Skincare Consultation Inquiry</option>
          <option value="Product Formulations & Ingredients">Product Formulations & Ingredients</option>
          <option value="Wholesale & Reseller Opportunities">Wholesale & Reseller Opportunities</option>
          <option value="Order Support & Defective Returns">Order Support & Defective Returns</option>
          <option value="Press & Media Relations">Press & Media Relations</option>
          <option value="General Question">General Question</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1.5">
          Message <span className="text-[#2d5508]">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your skin concern, request, or question here..."
          className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] bg-white text-[#131010] font-mono text-xs focus:outline-none focus:border-[#2d5508] transition-colors resize-y"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="font-mono text-[10px] text-[#7b7366] leading-relaxed">
          Protected under Nigeria Data Protection Act (NDPA) 2023.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'submitting' ? 'Sending Message...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
