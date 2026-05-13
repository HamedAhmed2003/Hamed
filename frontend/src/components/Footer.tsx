import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import { scrollToSection } from '@/lib/scrollToSection';
import logo from '@/assets/logo.png';

/**
 * FooterLink — navigates to a route and optionally scrolls to a section id.
 * If already on '/' it scrolls immediately; otherwise it navigates first then
 * the Landing page's useEffect handles the scroll via location.state.
 */
function FooterScrollLink({
  label,
  sectionId,
}: {
  label: string;
  sectionId: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <a
      href={`/#${sectionId}`}
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
    >
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="inPlace Logo" className="h-9 w-auto group-hover:scale-105 transition-transform" />
              <span className="text-xl font-extrabold gradient-primary-text">inPlace</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Opportunity match beyond the resume. Connecting skilled people with causes that matter.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">Platform</h4>
            <ul className="space-y-3">
              <li><FooterScrollLink label="How It Works" sectionId="how-it-works" /></li>
              <li><FooterScrollLink label="Impact" sectionId="impact" /></li>
              <li>
                <Link to="/internships" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/top-rank-volunteer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Top Rank Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">Community</h4>
            <ul className="space-y-3">
              <li><FooterScrollLink label="Success Stories" sectionId="success-stories" /></li>
              <li>
                <Link to="/mission" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Join as Volunteer
                </Link>
              </li>
              <li>
                <Link to="/signup?role=company" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  List your Org
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">Company</h4>
            <ul className="space-y-3">
              <li><FooterScrollLink label="About Us" sectionId="about-us" /></li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact-support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} inPlace Platform. Built for community impact.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 text-rose-400 inline mx-0.5" /> for people who care.
          </p>
        </div>
      </div>
    </footer>
  );
}
