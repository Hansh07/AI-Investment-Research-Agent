// ============================================================
// Landing Page
// ============================================================
// The main marketing page with:
// - Hero section with animated gradient blobs
// - Feature cards grid
// - Interactive dashboard preview
// - How-it-works timeline
// - Footer
// ============================================================

import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import DashboardPreview from '../components/DashboardPreview';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeatureCards />
      <DashboardPreview />
      <HowItWorks />
      <Footer />
    </main>
  );
}
