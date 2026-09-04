import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import AIMatching from "@/components/landing/AIMatching";
import Safety from "@/components/landing/Safety";
import Stats from "@/components/landing/Stats";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Hero />

      <HowItWorks />

      <Features />

      <AIMatching />

      <Safety />

      <Stats />

      <CTA />

      <Footer />
    </main>
  );
}