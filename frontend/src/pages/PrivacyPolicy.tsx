import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shield, Eye, Lock, UserCheck, Bell, Database, FileText, Mail, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

const SECTIONS = [
  {
    id: 'data-collect',
    icon: Database,
    title: '1. Information We Collect',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    items: [
      { label: 'Account Information', desc: 'Your name, email address, password (encrypted), and account role (Volunteer, Organization, or Admin).' },
      { label: 'Profile Information', desc: 'For volunteers: skills, education, biography, profile photo. For organizations: company name, description, industry, logo, and tax registration details.' },
      { label: 'Skills & Assessment Data', desc: 'Technical skills you list, extracted skills from uploaded CVs, soft skills assessment responses, and personality assessment responses used for matching.' },
      { label: 'Opportunity Applications', desc: 'Applications submitted for volunteer opportunities, including cover letters, exam responses, and application status history.' },
      { label: 'Organization Data', desc: 'Opportunities posted by organizations including title, description, required skills, and moderation status.' },
      { label: 'Uploaded Files', desc: 'CV files and profile images uploaded to the platform. Files are stored securely on our server.' },
      { label: 'Notification Data', desc: 'Notification records created when key events occur, such as opportunity approvals, application updates, and system messages.' },
    ],
  },
  {
    id: 'how-used',
    icon: Eye,
    title: '2. How We Use Your Data',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    items: [
      { label: 'Matching & Recommendations', desc: 'Your skills, personality data, and preferences are used to surface the most relevant volunteer opportunities.' },
      { label: 'Platform Functionality', desc: 'To manage accounts, process applications, send notifications, and maintain dashboards for all roles.' },
      { label: 'Email Communication', desc: 'OTP verification, application status updates, approval/rejection notifications, and support responses.' },
      { label: 'Admin Moderation', desc: 'Admin team reviews organizations and opportunities before they go live, using submitted data to ensure quality.' },
      { label: 'Analytics & Improvement', desc: 'Aggregated, anonymized statistics help us improve the platform, track community impact, and develop future features.' },
    ],
  },
  {
    id: 'data-protection',
    icon: Lock,
    title: '3. How We Protect Your Data',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    items: [
      { label: 'Encrypted Passwords', desc: 'All passwords are hashed using bcrypt with a secure salt before storage. We never store plaintext passwords.' },
      { label: 'JWT Authentication', desc: 'All authenticated API requests are protected by signed JSON Web Tokens with a 30-day expiry.' },
      { label: 'Role-Based Access Control', desc: 'Strict server-side role verification ensures that students, organizations, and admins can only access data appropriate to their role.' },
      { label: 'Sensitive Field Stripping', desc: 'Password hashes, OTP codes, and expiry timestamps are automatically removed from all API responses.' },
      { label: 'Rate Limiting', desc: 'API endpoints are rate-limited to prevent abuse and brute-force attacks.' },
    ],
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: '4. Your Rights',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    items: [
      { label: 'Access Your Data', desc: 'You can view and update your profile information at any time through your dashboard.' },
      { label: 'Update Your Information', desc: 'Change your name, email, skills, biography, and profile image at any time.' },
      { label: 'Delete Your Account', desc: 'You may request account deletion by contacting support. Deletions are processed within 30 days.' },
      { label: 'Withdraw Consent', desc: 'You can stop using the platform at any time. Inactive accounts are not shared with third parties.' },
      { label: 'Contact Us', desc: 'For any privacy-related requests, contact us via the Contact Support page or directly at our support email.' },
    ],
  },
  {
    id: 'data-sharing',
    icon: Bell,
    title: '5. Data Sharing & Disclosure',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    items: [
      { label: 'We Do Not Sell Your Data', desc: 'We never sell, rent, or trade personal information to third parties for commercial purposes.' },
      { label: 'Within the Platform', desc: 'Organizations can see the applications submitted to their opportunities. Admins can view all platform data for moderation purposes.' },
      { label: 'Legal Requirements', desc: 'We may disclose information when required by law or to protect the rights, property, or safety of inPlace, its users, or the public.' },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    title: '6. Contact & Support',
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
    items: [
      { label: 'Privacy Questions', desc: 'For any questions about this Privacy Policy or how your data is handled, visit our Contact Support page.' },
      { label: 'Data Requests', desc: 'To request data access, corrections, or deletion, use the Contact Support form with the subject "Data Request".' },
      { label: 'Support Email', desc: 'You can also reach our team directly at the email address provided in the Contact Support section.' },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 50%, #FAF5FF 100%)' }}
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[130px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-violet-200 text-sm font-semibold text-violet-700 shadow-sm">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-foreground">Your privacy,</span><br />
            <span className="gradient-primary-text">our responsibility.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy explains how inPlace collects, uses, and protects your personal information when you use our platform.
          </p>
          <p className="text-sm text-muted-foreground/70">Last updated: May 2026 · Effective immediately</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-white dark:bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="bg-violet-50 dark:bg-violet-950/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-900/30">
              <h2 className="text-sm font-bold text-violet-700 uppercase tracking-widest mb-4">Table of Contents</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-700 transition-colors group py-1"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-violet-400 group-hover:translate-x-1 transition-transform" />
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {SECTIONS.map((section) => (
            <FadeSection key={section.id}>
              <div id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className={`${section.bg} rounded-2xl p-6 border border-border space-y-4`}>
                  {section.items.map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">{item.label}: </span>
                        <span className="text-muted-foreground text-sm leading-relaxed">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          ))}

          {/* Final note */}
          <FadeSection>
            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 rounded-2xl p-8 border border-violet-100 dark:border-violet-900/30 text-center">
              <Shield className="h-10 w-10 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">We take your privacy seriously.</h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                inPlace is committed to maintaining the trust of our volunteers, organizations, and community. If anything in this policy is unclear, please don't hesitate to contact our support team.
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
