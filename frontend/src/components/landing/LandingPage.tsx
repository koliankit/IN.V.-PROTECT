import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ProductShowcase } from './ProductShowcase';
import { FeatureSection } from './FeatureSection';
import { InteractiveAnalyzer } from './InteractiveAnalyzer';
import { AnalyticsSection } from './AnalyticsSection';
import { PortfolioSection } from './PortfolioSection';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { OwnerProfile } from '../../types/auth';

interface LandingPageProps {
  ownerProfile: OwnerProfile | null;
  onOpenConsole: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout?: () => void;
  onOpenDevices?: () => void;
  onOpenSecurityPrivacy?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  ownerProfile,
  onOpenConsole,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenDevices,
  onOpenSecurityPrivacy,
}) => {
  const scrollToInteractiveDemo = () => {
    const el = document.getElementById('interactive-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#08080B',
        color: '#FFFFFF',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Top Sticky Minimalist Navbar */}
      <Navbar
        ownerProfile={ownerProfile}
        onOpenConsole={onOpenConsole}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onLogout={onLogout}
        onOpenDevices={onOpenDevices}
        onOpenSecurityPrivacy={onOpenSecurityPrivacy}
      />

      {/* Hero Section */}
      <Hero onOpenConsole={onOpenConsole} onExploreDemo={scrollToInteractiveDemo} />

      {/* Section 02: Large Statement & Product Showcase */}
      <ProductShowcase />

      {/* Feature Section: "Everything, unlike anything." */}
      <FeatureSection />

      {/* Large Interactive Product Section: "Always at your command." */}
      <InteractiveAnalyzer onOpenConsole={onOpenConsole} />

      {/* Analytics & Data Section: "Telemetry rooted in certainty." */}
      <AnalyticsSection onOpenConsole={onOpenConsole} />

      {/* Capital Protection & Connected Depository Linkages */}
      <PortfolioSection onOpenConsole={onOpenConsole} />

      {/* Pricing / Cost Section: "What it costs." */}
      <PricingSection onOpenRegister={onOpenRegister} onOpenConsole={onOpenConsole} />

      {/* Light Testimonial Section with high visual contrast */}
      <TestimonialsSection />

      {/* Final CTA Section: "Shield your capital today." */}
      <FinalCTA onOpenRegister={onOpenRegister} onOpenConsole={onOpenConsole} />

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
};
