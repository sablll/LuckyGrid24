import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Contact Us | My India Lottery"
        description="Get in touch with My India Lottery for inquiries, gazette corrections, or technical assistance."
      />

      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b-2 border-blue-600">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs text-blue-900 font-bold">
          <Mail className="w-4 h-4 text-blue-600" />
          Public Support &amp; Gazette Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
          Have a question about official draw publications or need assistance? Reach out to our public archival team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info & Policy */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-blue-900 uppercase">
              Archival Team Contact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              My India Lottery maintains an index of official state government lottery gazettes. For data correction requests, please include the state name, lottery scheme name, draw date, and draw number.
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-semibold pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900 font-bold">contact@myindialottery.online</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Fabrication Data Team</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-xs text-slate-700">
            <div className="font-bold text-blue-900 flex items-center gap-1.5 uppercase">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Notice on Ticket Purchases
            </div>
            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              Please note that we are strictly an informational portal. We do not sell lottery tickets, accept wagers, or distribute prize claims. For prize disbursements, please contact the respective State Lottery Directorate.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-blue-900">
                Message Received
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto font-medium">
                Thank you for contacting My India Lottery. Our archival team will review your inquiry.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-black text-blue-900 uppercase">
                Send an Inquiry
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Draw result question or feedback"
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer"
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
