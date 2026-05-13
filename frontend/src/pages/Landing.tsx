import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Heart, Shield, Sparkles, Star, Quote, CheckCircle, Zap, BarChart3, Target } from 'lucide-react';

import { useEffect, useRef, useState, useCallback } from 'react';
import { scrollToSection } from '@/lib/scrollToSection';
import { Footer } from '@/components/Footer';

// Scroll-reveal: adds 'revealed' class when element enters viewport
function useScrollReveal() {
  const apply = useCallback(() => {
    const els = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) el.classList.add('revealed');
    });
  }, []);

  useEffect(() => {
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    return () => window.removeEventListener('scroll', apply);
  }, [apply]);
}

// Animated Counter Hook
function useCounter(target: number, duration: number = 2000, startTrigger: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startTrigger]);
  return count;
}

// Intersection observer hook
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

// Stat Counter Component
function StatCounter({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1800, inView);
  return (
    <div ref={ref} className="stat-card text-center card-hover">
      <div className="text-4xl md:text-5xl font-extrabold gradient-primary-text mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: "I found my first volunteering role through this platform. It matched me to exactly the kind of work I'd been looking for. It changed how I see my skills.",
    name: "Maya Patel",
    role: "Frontend Volunteer",
    avatar: "M",
    color: "bg-violet-500",
  },
  {
    quote: "Mentoring junior developers while shipping real features for nonprofits — it's the best kind of give-and-take. The personality match was spot-on.",
    name: "Daniel Okafor",
    role: "Backend Mentor",
    avatar: "D",
    color: "bg-purple-500",
  },
  {
    quote: "I now lead data initiatives for a climate-tech nonprofit. It all started with a single two-hour task I found here. The impact compounds.",
    name: "Priya Raman",
    role: "Data Lead",
    avatar: "P",
    color: "bg-fuchsia-500",
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create your profile',
    desc: 'Tell us about your interests, availability, and soft-skill strengths through our personality assessment.',
    icon: Target,
  },
  {
    step: '02',
    title: 'Get matched',
    desc: 'Our recommendation engine surfaces the most compatible opportunities tailored specifically to you.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Contribute & grow',
    desc: 'Connect with organizations, make meaningful contributions, and build your real-world experience.',
    icon: BarChart3,
  },
];

const ABOUT_VALUES = [
  {
    icon: Heart,
    title: 'Care',
    desc: 'We match with empathy — not just resumes.',
    color: 'bg-rose-50 dark:bg-rose-950/30',
    iconColor: 'text-rose-500',
  },
  {
    icon: Shield,
    title: 'Trust',
    desc: 'Verified organizations. Transparent impact.',
    color: 'bg-sky-50 dark:bg-sky-950/30',
    iconColor: 'text-sky-500',
  },
  {
    icon: Zap,
    title: 'Growth',
    desc: 'Earn experience, mentors, and real portfolio work.',
    color: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Impact',
    desc: 'Every hour tracked, measured, celebrated.',
    color: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconColor: 'text-emerald-500',
  },
];

export default function Landing() {
  const location = useLocation();
  useScrollReveal();

  // Handle cross-page scroll anchors (e.g. footer links from other routes)
  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo;
    if (scrollTo) {
      scrollToSection(scrollTo);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden hero-gradient-shift">
        {/* Dotted grid overlay */}
        <div className="absolute inset-0 hero-dot-grid opacity-60 pointer-events-none" />

        {/* Decorative blobs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-400/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-fuchsia-400/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full bg-purple-300/10 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 md:pt-32 md:pb-44 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Copy — staggered entrance */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-violet-200/80 text-sm font-semibold text-violet-700 shadow-md shadow-violet-100/50">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Intelligent Volunteering Ecosystem
              </div>

              <h1 className="hero-h1 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                <span className="text-foreground">Skills that</span><br />
                <span className="gradient-primary-text">serve a purpose.</span>
              </h1>

              <p className="hero-sub text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Match with meaningful volunteering opportunities based on your personality, skills, and the causes you genuinely care about.
              </p>

              <div className="hero-btns flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-10 rounded-full gradient-primary text-white text-base font-semibold shadow-xl shadow-violet-500/35 hover:shadow-violet-500/55 hover:-translate-y-1.5 active:scale-95 transition-all duration-300">
                    Start Volunteering <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/internships">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-white/70 backdrop-blur-md border-violet-200 text-violet-800 hover:bg-white hover:border-violet-400 hover:-translate-y-0.5 active:scale-95 text-base font-semibold transition-all duration-300 shadow-sm">
                    Browse Opportunities
                  </Button>
                </Link>
              </div>

              <div className="hero-social flex items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ zIndex: 4 - i }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">12,000+</span>
                  <span className="text-muted-foreground ml-1">volunteers active</span>
                </div>
              </div>
            </div>

            {/* Right Visual — Floating Cards */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none hidden lg:block">
              <div className="relative h-[520px]">
                {/* Main large card */}
                <div className="hero-card absolute top-8 left-8 right-8 card-glass rounded-3xl p-6 shadow-2xl shadow-violet-300/40 border border-violet-100/80 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-400/30 animate-glow-pulse">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Senior React Developer</p>
                      <p className="text-sm text-muted-foreground">Tech for Good Initiative</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">Frontend</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">Remote</span>
                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">Volunteer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">12 spots available</span>
                    </div>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">95% Match ✨</span>
                  </div>
                </div>

                {/* Floating stat pill */}
                <div className="absolute bottom-28 -left-6 card-glass rounded-2xl px-5 py-3 shadow-xl shadow-violet-200/30 border border-violet-100 animate-float-delayed">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hours Donated</p>
                      <p className="font-bold text-foreground text-lg">2.5M+</p>
                    </div>
                  </div>
                </div>

                {/* Floating match card */}
                <div className="absolute bottom-10 right-4 card-glass rounded-2xl px-5 py-3 shadow-xl shadow-violet-200/30 border border-violet-100 animate-float">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Personality Match</p>
                      <p className="font-bold gradient-primary-text text-lg">Enabled ✓</p>
                    </div>
                  </div>
                </div>

                {/* Extra floating badge */}
                <div className="absolute top-16 -right-6 card-glass rounded-2xl px-4 py-2.5 shadow-lg shadow-violet-200/20 border border-violet-100 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-foreground">Admin Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / MISSION ─────────────────────────── */}
      <section id="about-us" className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 scroll-reveal-left">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">About Us</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                A platform where skills meet service.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe every person has skills with the power to uplift a community. This platform is built for people who want their time and talents to count for something more — connecting passionate volunteers with organizations that need them most.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Mission-driven', 'Skill-matched', 'Human-first'].map(tag => (
                  <span key={tag} className="text-sm bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 px-4 py-1.5 rounded-full font-semibold border border-violet-200 dark:border-violet-800 hover:bg-violet-100 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {ABOUT_VALUES.map((v, i) => (
                <div key={v.title} className={`scroll-reveal p-6 rounded-2xl border border-border bg-white dark:bg-card shadow-sm hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1.5 transition-all duration-300 group`} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <v.icon className={`h-5 w-5 ${v.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" className="py-24" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3 scroll-reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              From signup to impact in three steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-0.5 step-line" />

            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="scroll-reveal bg-white dark:bg-card rounded-3xl p-8 shadow-sm border border-violet-100 dark:border-violet-900/30 hover:shadow-xl hover:shadow-violet-200/30 hover:-translate-y-2 transition-all duration-300 text-center group" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-violet-50 border-2 border-violet-200 text-violet-600 font-extrabold text-xl flex items-center justify-center mx-auto mb-6 group-hover:gradient-primary group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-violet-400/30 transition-all duration-300">
                  {item.step}
                </div>
                <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-violet-300 to-transparent mx-auto mb-6" />
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-100 transition-colors">
                  <item.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3 scroll-reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">Opportunity Categories</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find your tech niche.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Contribute to impactful projects across the full tech spectrum.</p>
          </div>

          {/* 3 Category Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Frontend Development */}
            <Link to="/internships?category=Frontend+Development" className="scroll-reveal" style={{ transitionDelay: '0ms' }}>
              <div className="group bg-white dark:bg-card border border-violet-100 dark:border-violet-900/30 rounded-3xl p-7 hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-200/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-300/40 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Frontend Development</h3>
                <p className="text-sm text-muted-foreground mb-5">Build stunning interfaces that users love. Work on the web's visual layer.</p>
                <div className="flex flex-wrap gap-2">
                  {['HTML', 'CSS', 'JavaScript', 'React'].map(t => (
                    <span key={t} className="text-xs font-semibold px-3 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-700 rounded-full border border-violet-200 dark:border-violet-800">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-violet-600 group-hover:gap-3 transition-all">
                  Browse roles <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Backend Development */}
            <Link to="/internships?category=Backend+Development" className="scroll-reveal" style={{ transitionDelay: '120ms' }}>
              <div className="group bg-white dark:bg-card border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-7 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-200/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-300/40 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Backend Development</h3>
                <p className="text-sm text-muted-foreground mb-5">Power applications with robust APIs and server-side logic that scales.</p>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'PHP', 'Laravel'].map(t => (
                    <span key={t} className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                  Browse roles <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Database Development */}
            <Link to="/internships?category=Database+Development" className="scroll-reveal" style={{ transitionDelay: '240ms' }}>
              <div className="group bg-white dark:bg-card border border-fuchsia-100 dark:border-fuchsia-900/30 rounded-3xl p-7 hover:border-fuchsia-400 hover:shadow-2xl hover:shadow-fuchsia-200/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mb-5 shadow-lg shadow-fuchsia-300/40 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🗄️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Database Development</h3>
                <p className="text-sm text-muted-foreground mb-5">Design and optimize data systems that are fast, reliable, and secure.</p>
                <div className="flex flex-wrap gap-2">
                  {['MongoDB', 'MySQL', 'PostgreSQL'].map(t => (
                    <span key={t} className="text-xs font-semibold px-3 py-1 bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-700 rounded-full border border-fuchsia-200 dark:border-fuchsia-800">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-fuchsia-600 group-hover:gap-3 transition-all">
                  Browse roles <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-10">
            <Link to="/internships">
              <Button variant="outline" className="rounded-full border-violet-200 text-violet-700 hover:bg-violet-50 h-12 px-8">
                Browse All Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* ─── IMPACT STATS ────────────────────────────── */}
      <section id="impact" className="py-24" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3 scroll-reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">Our Impact</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Small commits. Real change.</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Every line of code, every volunteer hour — tracked, measured, and celebrated.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCounter value={12000} suffix="+" label="Active Volunteers" />
            <StatCounter value={850} suffix="+" label="Opportunities Posted" />
            <StatCounter value={300} suffix="+" label="Partner Organizations" />
            <StatCounter value={2500000} suffix="+" label="Community Impact" />
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────── */}
      <section id="success-stories" className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3 scroll-reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">Success Stories</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Volunteers who made it count.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="scroll-reveal relative bg-white dark:bg-card border border-border/60 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-violet-200/25 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group" style={{ transitionDelay: `${i * 100}ms` }}>
                {/* giant decorative quote */}
                <span className="quote-giant absolute -top-2 -left-1 select-none">&ldquo;</span>
                <div className="relative z-10">
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-foreground font-medium leading-relaxed flex-grow italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                    <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-md`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ORGANIZATION CTA ────────────────────────── */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 60%, #FAF5FF 100%)' }}>
        <div className="absolute inset-0 hero-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-violet-300/20 blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="scroll-reveal card-glass rounded-3xl p-10 md:p-14 text-center space-y-7 border border-violet-100 shadow-2xl shadow-violet-200/30">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-600">For Organizations</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Find volunteers who truly align with your mission.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our personality-matching engine helps you build stronger, more committed teams. Post opportunities, review candidates, and see compatibility at a glance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/signup">
                <Button size="lg" className="h-14 px-10 rounded-full gradient-primary text-white text-base font-semibold shadow-xl shadow-violet-500/35 hover:shadow-violet-500/55 hover:-translate-y-1.5 active:scale-95 transition-all duration-300">
                  List Your Organization <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/internships">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-violet-200 text-violet-800 hover:bg-white hover:border-violet-400 hover:-translate-y-0.5 active:scale-95 text-base font-semibold transition-all duration-300 shadow-sm">
                  Browse as a Volunteer
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              {['Free to list', 'Admin verified', 'Personality-matched applicants'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <Footer />
    </div>
  );
}
