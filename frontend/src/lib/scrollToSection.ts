/**
 * scrollToSection — Smoothly scrolls to a section by its DOM id.
 * Works both when you're already on the page and after navigation.
 *
 * Usage (same page):  scrollToSection('how-it-works')
 * Usage (different page): navigate('/', { state: { scrollTo: 'how-it-works' } })
 *   then call scrollToSection inside a useEffect that watches location.state
 */
export function scrollToSection(id: string, retries = 8) {
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (retries > 0) {
      // Element not yet in DOM (navigation just happened) — retry
      setTimeout(() => scrollToSection(id, retries - 1), 100);
    }
  };
  attempt();
}
