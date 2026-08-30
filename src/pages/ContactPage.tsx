import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Mail, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Contact Us | My India Lottery"
        description="Get in touch with My India Lottery for inquiries, gazette corrections, or technical assistance."
      />

      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-300 px-3.5 py-1.5 rounded-full text-xs text-stone-800 font-semibold font-mono-code">
          <Mail className="w-4 h-4 text-stone-700" />
          Public Support &amp; Gazette Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Have a question about official draw publications or need assistance? Reach out to our public archival team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info & Policy */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-stone-950 font-editorial-serif">
              Archival Team Contact
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              My India Lottery maintains an index of official state government lottery gazettes. For data correction requests, please include the state name, lottery scheme name, draw date, and draw number.
            </p>

            <div className="space-y-2 text-xs text-stone-700 font-mono-code pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500" />
                <span>contact@myindialottery.online</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Zero-Fabrication Data Team</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-600">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Notice on Ticket Purchases
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Please note that we are strictly an informational gazette portal. We do not sell lottery tickets, accept wagers, or distribute prize claims. For prize disbursements, please contact the respective State Lottery Directorate.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-950 font-editorial-serif">
                Message Received
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Thank you for contacting My India Lottery. Our archival team will review your inquiry.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-stone-950 font-editorial-serif">
                Send an Inquiry
              </h2>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Draw result question or feedback"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs font-mono-code"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
