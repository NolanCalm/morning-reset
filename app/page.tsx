"use client";

import { MorningLayout } from "@/components/layouts/MorningLayout";
import { LandingHero } from "@/components/features/LandingHero";

export default function Home() {
  return (
    <MorningLayout>
      <LandingHero />
    </MorningLayout>
  );
}