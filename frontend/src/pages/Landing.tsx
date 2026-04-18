import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Briefcase, Brain, Award, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Matching', description: 'Upload your CV and let AI extract your skills to find the best internship matches.' },
  { icon: Briefcase, title: 'Browse Internships', description: 'Discover hundreds of internships filtered by skills, salary, duration, and mode.' },
  { icon: Award, title: 'Exam-Based Hiring', description: 'Take skill assessments and stand out with your exam scores.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Companies get real-time analytics on applicants, scores, and hiring metrics.' },
];

const steps = [
  'Create your profile and upload your CV',
  'AI extracts skills and matches you with internships',
  'Apply and take the skill assessment exam',
  'Companies review your profile, score, and skills',
  'Get accepted and start your internship journey!',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find Your Perfect <span className="gradient-primary-text">Internship</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Interno connects students with top companies through AI-powered skill matching,
            exam-based assessments, and real-time analytics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground h-12 px-8 text-lg gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/internships">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                Browse Internships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="gradient-primary-text">Interno</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-xl border border-border/50 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold">{i + 1}</span>
                </div>
                <p className="text-sm sm:text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of students and companies already using Interno.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 h-12 px-8">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Interno. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
