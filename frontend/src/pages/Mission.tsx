import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Heart, Users, Target, Zap, Shield, Globe, ArrowRight,
  Code2, Database, Layout, Star, CheckCircle, Sparkles
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

function useInView(threshold = 0.15) {
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

const MISSION_PILLARS = [
  {
    icon: Target,
    title: 'Skill-Matched Volunteering',
    desc: 'We go beyond generic listings. Our platform matches volunteers to opportunities based on their actual technical skills — Frontend, Backend, and Database development.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
  },
  {
    icon: Heart,
    title: 'Meaningful Impact',
    desc: 'Every volunteer hour is tracked, measured, and celebrated. We believe real contribution deserves real recognition — not just certificates.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
  },
  {
    icon: Users,
    title: 'Community Growth',
    desc: "Organizations find passionate contributors. Students build real portfolios. That's the inPlace ecosystem — where mutual benefit drives community forward.",
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    icon: Sparkles,
    title: 'Personality-Powered Matching',
    desc: 'Our onboarding captures soft skills, work style, and personality traits — ensuring volunteers and organizations are truly compatible, not just technically aligned.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    icon: Shield,
    title: 'Admin-Verified Quality',
    desc: 'Every opportunity is reviewed and approved by our admin team before going live. No spam. No fake listings. Just real, vetted opportunities.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    icon: Globe,
    title: 'Portfolio & Experience',
    desc: 'Volunteers gain real-world experience they can showcase. Organizations get skilled contributors. Both sides grow — that is the inPlace promise.',
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
  },
];

const FOCUS_AREAS = [
  { icon: Layout, label: 'Frontend Development', desc: 'React, Vue, HTML/CSS, JavaScript', color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-950/40' },
  { icon: Code2, label: 'Backend Development', desc: 'Node.js, PHP, Laravel, APIs', color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-950/40' },
  { icon: Database, label: 'Database Development', desc: 'MongoDB, MySQL, PostgreSQL', color: 'text-fuchsia-600', bg: 'bg-fuchsia-100 dark:bg-fuchsia-950/40' },
];

const STATS = [
  { value: '12,000+', label: 'Active Volunteers' },
  { value: '850+', label: 'Opportunities Posted' },
  { value: '300+', label: 'Partner Organizations' },
  { value: '100%', label: 'Admin-Verified Listings' },
];

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-32 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 50%, #FAF5FF 100%)' }}
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-300/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-violet-200 text-sm font-semibold text-violet-700 shadow-sm">
            <Heart className="h-4 w-4 text-rose-500" />
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-foreground">Skills that</span><br />
            <span className="gradient-primary-text">serve a purpose.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe every developer has skills that can change a community. inPlace connects passionate technical volunteers with organizations building real-world impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-10 rounded-full gradient-primary text-white font-semibold shadow-xl shadow-violet-400/30 hover:shadow-violet-400/50 hover:-translate-y-1 transition-all duration-300">
                Join as Volunteer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup?role=company">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-violet-200 text-violet-800 hover:bg-violet-50 font-semibold transition-all">
                List Your Organization
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <FadeSection key={s.label}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold gradient-primary-text">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Pillars */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="text-center mb-16 space-y-3">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">What We Stand For</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our core principles</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Six beliefs that guide every decision we make at inPlace.
              </p>
            </div>
          </FadeSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MISSION_PILLARS.map((p, i) => (
              <FadeSection key={p.title}>
                <div className={`${p.bg} rounded-3xl p-7 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5 shadow-md`}>
                    <p.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{p.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Focus Areas */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="text-center mb-14 space-y-3">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">Where We Focus</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Technical opportunity areas</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                We specialize in developer-focused volunteering — where your code creates real community impact.
              </p>
            </div>
          </FadeSection>

          <div className="grid md:grid-cols-3 gap-6">
            {FOCUS_AREAS.map((area) => (
              <FadeSection key={area.label}>
                <div className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${area.bg} flex items-center justify-center mx-auto mb-5`}>
                    <area.icon className={`h-8 w-8 ${area.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{area.label}</h3>
                  <p className="text-sm text-muted-foreground">{area.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="text-center mb-14 space-y-3">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">The Journey</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">From profile to impact</h2>
            </div>
          </FadeSection>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Create your volunteer profile', desc: 'Tell us your skills, personality traits, and the kind of work that energizes you. Our assessment captures more than a resume ever could.' },
              { step: '02', title: 'Discover matched opportunities', desc: 'Browse admin-verified opportunities from real organizations. Filter by tech stack, time commitment, and impact area.' },
              { step: '03', title: 'Apply & get selected', desc: 'Submit your application with a cover letter. Some opportunities include a technical assessment to ensure the right fit.' },
              { step: '04', title: 'Contribute & grow', desc: 'Work with the organization, build your portfolio, and earn experience that actually matters — technical and human.' },
            ].map((item, i) => (
              <FadeSection key={item.step}>
                <div className="flex gap-6 items-start p-6 rounded-2xl border border-border hover:border-violet-200 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md shadow-violet-300/30">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 60%, #FAF5FF 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">Ready to start?</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Be the volunteer<br />that makes it count.
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Join thousands of developers who are building real portfolios while making a genuine difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-10 rounded-full gradient-primary text-white font-semibold shadow-xl shadow-violet-400/30 hover:shadow-violet-400/50 hover:-translate-y-1 transition-all duration-300">
                Join as Volunteer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup?role=company">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-violet-200 text-violet-800 hover:bg-violet-50 font-semibold">
                List Your Organization
              </Button>
            </Link>
            <Link to="/internships">
              <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-violet-700 hover:bg-violet-50 font-semibold">
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
