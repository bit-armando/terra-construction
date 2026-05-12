import { Hero } from "@/components/sections/Hero";
import { ModelCatalog } from "@/components/sections/ModelCatalog";
import { Developments } from "@/components/sections/Developments";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModelCatalog />
      <Developments />
      <ProcessTimeline />
      <Testimonials />
      <About />
      <FAQ />
    </>
  );
}
