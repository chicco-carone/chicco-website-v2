import { Navbar } from "@/components/main/navbar";
import { PhotographySection } from "@/components/photography-section";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <PhotographySection />
      </main>
    </>
  );
}
