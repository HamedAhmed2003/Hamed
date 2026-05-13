import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supportService } from '@/services/api';
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, Send, Phone, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const ACCOUNT_TYPES = [
  { value: 'volunteer', label: '🎓 Volunteer / Student' },
  { value: 'organization', label: '🏢 Organization' },
  { value: 'admin', label: '🛡️ Admin' },
  { value: 'other', label: '🌐 Other' },
];

const QUICK_TOPICS = [
  { icon: HelpCircle, label: 'Account Issue', subject: 'Account Issue' },
  { icon: MessageSquare, label: 'Application Problem', subject: 'Application Problem' },
  { icon: Mail, label: 'Email / OTP Issue', subject: 'Email or OTP Issue' },
  { icon: AlertCircle, label: 'Report a Bug', subject: 'Bug Report' },
];

export default function ContactSupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    accountType: 'volunteer',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickTopic = (subject: string) => {
    setForm(prev => ({ ...prev, subject }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await supportService.submit(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '', accountType: 'volunteer' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send your message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 50%, #FAF5FF 100%)' }}
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[130px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-violet-200 text-sm font-semibold text-violet-700 shadow-sm">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-foreground">We're here</span><br />
            <span className="gradient-primary-text">to help you.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have a question, issue, or feedback? Send us a message and our team will get back to you within 24–48 hours.
          </p>
        </div>
      </section>

      {/* Support Info Cards */}
      <section className="py-12 bg-white dark:bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Clock, title: 'Response Time', desc: '24–48 hours on business days', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30' },
              { icon: Mail, title: 'Email Support', desc: 'Full support via the form below', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
              { icon: CheckCircle, title: 'Auto-Reply', desc: 'Confirmation sent to your email', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            ].map((card) => (
              <div key={card.title} className={`${card.bg} rounded-2xl p-5 border border-border flex items-start gap-4`}>
                <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{card.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Quick Topics</h2>
                <p className="text-sm text-muted-foreground">Click a topic to pre-fill the subject field.</p>
              </div>
              <div className="space-y-3">
                {QUICK_TOPICS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => handleQuickTopic(t.subject)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 hover:border-violet-400 hover:shadow-sm ${
                      form.subject === t.subject
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700'
                        : 'border-border bg-background hover:bg-violet-50/50'
                    }`}
                  >
                    <t.icon className={`h-4 w-4 flex-shrink-0 ${form.subject === t.subject ? 'text-violet-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-2xl p-5 border border-violet-100 dark:border-violet-900/30">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-widest mb-3">Before You Submit</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    'Include your account email for faster resolution.',
                    'Describe the issue with as much detail as possible.',
                    'Attach any error messages if applicable.',
                    'Check our FAQ or Documentation first.',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-violet-500 font-bold flex-shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-16 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Your message has been submitted. We have sent a confirmation to your email. Our team will respond within 24–48 hours.
                    </p>
                  </div>
                  <Button
                    onClick={() => setStatus('idle')}
                    className="gradient-primary text-white rounded-full px-8 h-12"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="support-name" className="block text-sm font-semibold mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="support-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="support-email" className="block text-sm font-semibold mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="support-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="support-account-type" className="block text-sm font-semibold mb-1.5">Account Type</label>
                    <select
                      id="support-account-type"
                      name="accountType"
                      value={form.accountType}
                      onChange={handleChange}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    >
                      {ACCOUNT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="support-subject" className="block text-sm font-semibold mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="support-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Brief summary of your issue"
                      required
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="support-message" className="block text-sm font-semibold mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="support-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Describe your issue or question in detail..."
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none leading-relaxed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{form.message.length} / 2000 characters</p>
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-sm animate-fade-in">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {errorMsg || 'An error occurred. Please try again.'}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-12 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-violet-400/25 hover:shadow-violet-400/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Send Message</>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our{' '}
                    <a href="/privacy-policy" className="text-violet-600 hover:underline">Privacy Policy</a>.
                    We'll respond to your registered email address.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
