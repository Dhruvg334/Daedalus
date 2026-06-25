import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import PathsPreview from "@/components/PathsPreview";
import AIExposureSection from "@/components/AIExposureSection";
import SprintPreview from "@/components/SprintPreview";
import PersonasSection from "@/components/PersonasSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <PathsPreview />
      <AIExposureSection />
      <SprintPreview />
      <PersonasSection />
      <CTASection />
      <Footer />
    </main>
  );
}
