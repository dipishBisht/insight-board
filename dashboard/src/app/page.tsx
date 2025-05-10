import About from "@/components/home/about";
import Benefits from "@/components/home/benefits";
import CallToAction from "@/components/home/call-to-action/page";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Preview from "@/components/home/preview/page";
import Usage from "@/components/home/usage";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About />
      <HowItWorks />
      <Benefits />
      <Features />
      <Usage />
      <Preview />
      <CallToAction />
    </div>
  );
}
