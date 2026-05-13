import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileText, Users, Building2, Shield, AlertTriangle, CheckCircle, XCircle, Mail, ChevronRight } from 'lucide-react';
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
    id: 'user-responsibilities',
    icon: Users,
    title: '1. Volunteer Responsibilities',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    items: [
      { label: 'Honest Profile', desc: 'Volunteers must provide accurate information about their skills, education, and experience. Misrepresentation may result in account suspension.' },
      { label: 'Respectful Conduct', desc: 'All interactions with organizations, admins, and fellow volunteers must remain professional and respectful.' },
      { label: 'Commitment', desc: 'Once accepted for an opportunity, volunteers are expected to honor the commitment and communicate promptly if circumstances change.' },
      { label: 'Single Accounts', desc: 'Each person is permitted one volunteer account. Creating multiple accounts is a violation of these terms.' },
      { label: 'Assessment Integrity', desc: 'Technical assessments and personality evaluations must be completed personally and honestly. Using unauthorized assistance is strictly prohibited.' },
      { label: 'Portfolio Accuracy', desc: 'Any work claimed as portfolio contributions through inPlace must be authentic contributions made during an active volunteer engagement.' },
    ],
  },
  {
    id: 'org-responsibilities',
    icon: Building2,
    title: '2. Organization Responsibilities',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    items: [
      { label: 'Verified Registration', desc: 'Organizations must provide accurate business details including company name, description, and tax registration information.' },
      { label: 'Accurate Listings', desc: 'All posted opportunities must accurately describe the work, required skills, time commitment, and intended impact.' },
      { label: 'Volunteer Welfare', desc: 'Organizations must not exploit volunteers. Volunteer roles should be clearly defined and should provide genuine experience or skill development.' },
      { label: 'Timely Communication', desc: 'Organizations are expected to respond to applicants within a reasonable timeframe and provide clear acceptance/rejection feedback.' },
      { label: 'Content Standards', desc: 'Opportunity listings must not contain offensive, discriminatory, or misleading content.' },
      { label: 'Admin Cooperation', desc: 'Organizations must cooperate with admin review processes and promptly address any compliance concerns raised.' },
    ],
  },
  {
    id: 'admin-moderation',
    icon: Shield,
    title: '3. Admin Moderation',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    items: [
      { label: 'Organization Approval', desc: 'All new organizations must be reviewed and approved by an inPlace admin before they can post opportunities.' },
      { label: 'Opportunity Review', desc: 'Every submitted opportunity is reviewed by admins before being published to volunteers. Listings that violate our standards will be rejected.' },
      { label: 'User Suspension', desc: 'Admins may suspend or permanently remove accounts that violate these terms, at their sole discretion.' },
      { label: 'Final Authority', desc: 'Admin decisions on approvals, rejections, and suspensions are final. Appeals may be submitted via the Contact Support page.' },
    ],
  },
  {
    id: 'acceptable-use',
    icon: CheckCircle,
    title: '4. Acceptable Use',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    items: [
      { label: 'Platform Purpose', desc: 'inPlace is designed exclusively for legitimate technical volunteering. Using the platform for commercial recruitment, spam, or unrelated purposes is prohibited.' },
      { label: 'No Automated Scraping', desc: 'Using bots, scrapers, or automated tools to harvest platform data is strictly forbidden.' },
      { label: 'Content Rights', desc: 'You retain ownership of content you create but grant inPlace a license to display it within the platform context.' },
      { label: 'No Harmful Activity', desc: 'Any attempt to hack, disrupt, or abuse the platform infrastructure will result in immediate account termination and potential legal action.' },
    ],
  },
  {
    id: 'applications',
    icon: FileText,
    title: '5. Application Rules',
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
    items: [
      { label: 'Honest Applications', desc: 'All cover letters and application materials must be original and accurately represent your intentions and capabilities.' },
      { label: 'One Application Per Opportunity', desc: 'Submitting duplicate applications for the same opportunity is not permitted.' },
      { label: 'Exam Honesty', desc: 'Technical exams are designed to assess genuine understanding. Sharing exam content or using unauthorized resources violates these terms.' },
      { label: 'Withdrawal', desc: 'Volunteers may withdraw an application before it is accepted. Post-acceptance withdrawals should be communicated directly to the organization.' },
    ],
  },
  {
    id: 'account-security',
    icon: AlertTriangle,
    title: '6. Account Security & Termination',
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    items: [
      { label: 'Account Security', desc: 'You are responsible for maintaining the confidentiality of your login credentials. Notify support immediately if you suspect unauthorized access.' },
      { label: 'Termination by User', desc: 'You may request account deletion at any time via the Contact Support page.' },
      { label: 'Termination by Platform', desc: 'inPlace reserves the right to suspend or terminate accounts that violate these Terms without prior notice.' },
      { label: 'Data on Termination', desc: 'Upon termination, your personal data will be handled per our Privacy Policy. Some data may be retained for legal compliance purposes.' },
    ],
  },
  {
    id: 'platform-limitations',
    icon: XCircle,
    title: '7. Platform Limitations',
    color: 'from-slate-500 to-gray-600',
    bg: 'bg-slate-50 dark:bg-slate-950/20',
    items: [
      { label: 'No Guarantee of Placement', desc: 'inPlace facilitates connections but cannot guarantee that volunteers will be selected or that organizations will receive sufficient applicants.' },
      { label: 'Service Availability', desc: 'We strive for high uptime but cannot guarantee uninterrupted access. Scheduled maintenance may cause temporary outages.' },
      { label: 'Third-Party Actions', desc: 'inPlace is not responsible for the behavior of organizations or volunteers after connections are made outside the platform.' },
      { label: 'Limitation of Liability', desc: 'inPlace\'s liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.' },
    ],
  },
  {
    id: 'contact-tos',
    icon: Mail,
    title: '8. Contact & Support',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    items: [
      { label: 'Questions', desc: 'If you have questions about these Terms of Service, visit the Contact Support page.' },
      { label: 'Violations', desc: 'To report violations of these terms by other users or organizations, use the Contact Support form with subject "Report Violation".' },
      { label: 'Updates to Terms', desc: 'We may update these terms periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.' },
    ],
  },
];

export default function TermsOfServicePage() {
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
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-foreground">Clear rules,</span><br />
            <span className="gradient-primary-text">fair community.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            These Terms of Service govern your use of the inPlace platform. By creating an account, you agree to these terms.
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
              <FileText className="h-10 w-10 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Thank you for being part of inPlace.</h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                These terms exist to keep our community safe, fair, and impactful. If you have any questions or concerns, our support team is always happy to help.
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
