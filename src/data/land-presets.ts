/**
 * Regional presets for কাঠা / বিঘা.
 *
 * Only the default preset from the project brief is included. Region-specific values vary
 * (and sometimes differ between villages), so additional presets must be added only after
 * verification from official land-office / survey sources.
 * TODO(human): verify and add regional presets (see PLAN.md → Needs human verification).
 */
import { DEFAULT_LAND_CONFIG, type LandConfig } from "@/lib/land";

export interface LandPreset {
  id: string;
  label: string;
  /** null = custom (user enters own values). */
  config: LandConfig | null;
}

export const LAND_PRESETS: readonly LandPreset[] = [
  { id: "default", label: "প্রচলিত মান (১ কাঠা = ৭২০ বর্গফুট, ১ বিঘা = ২০ কাঠা)", config: DEFAULT_LAND_CONFIG },
  { id: "custom", label: "কাস্টম — নিজের এলাকার মাপ দিন", config: null },
];
