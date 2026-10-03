import React from 'react';
import { AppTopBar } from '../layout/AppTopBar';
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
        backgroundColor: 'var(--bg-primary)',
        color: '#FFFFFF',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Unified Top Bar */}
      <AppTopBar
        mode="landing"
        ownerProfile={ownerProfile}
        onOpenConsole={onOpenConsole}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onLogout={onLogout}
        onOpenDevices={onOpenDevices}
        onOpenSecurityPrivacy={onOpenSecurityPrivacy}
      />

      {/* Hero Section: Chapter 01 */}
      <Hero onOpenConsole={onOpenConsole} onExploreDemo={scrollToInteractiveDemo} />

      {/* Section 02: Sovereign Defense Plane */}
      <ProductShowcase />

      {/* Section 03: Architecture & Capabilities */}
      <FeatureSection />

      {/* Section 04: Interactive Threat Forensics */}
      <InteractiveAnalyzer onOpenConsole={onOpenConsole} />

      {/* Section 05: Telemetry & Threat Radar */}
      <AnalyticsSection onOpenConsole={onOpenConsole} />

      {/* Section 06: Capital Isolation & Defense */}
      <PortfolioSection onOpenConsole={onOpenConsole} />

      {/* Section 07: Sovereign Access & Pricing */}
      <PricingSection onOpenRegister={onOpenRegister} onOpenConsole={onOpenConsole} />

      {/* Section 08: Community & Institutional Trust */}
      <TestimonialsSection />

      {/* Section 09: Final Call to Action */}
      <FinalCTA onOpenRegister={onOpenRegister} onOpenConsole={onOpenConsole} />

      {/* Institutional Editorial Footer */}
      <Footer />
    </div>
  );
};
