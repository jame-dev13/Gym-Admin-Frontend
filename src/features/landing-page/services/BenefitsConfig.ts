import {
  ClipboardList,
  Dumbbell,
  HeartPulse,
  Salad,
  Users,
  Waves,
} from "lucide-react";
import type { Benefit } from "@/features/landing-page/types/LandingTypes";

export const getBenefitsConfig = (): Benefit[] => benefitsConfig;

const benefitsConfig: Benefit[] = [
  {
    Icon: Dumbbell,
    title: "Modern equipment",
    text: "Free weights, state-of-the-art machines, and a functional zone equipped for every level.",
  },
  {
    Icon: Users,
    title: "Certified trainers",
    text: "Professional guidance that adapts every routine to your goals, your body, and your pace.",
  },
  {
    Icon: HeartPulse,
    title: "Group classes",
    text: "Spinning, HIIT, yoga, and strength: collective energy every day of the week.",
  },
  {
    Icon: ClipboardList,
    title: "Personalized routines",
    text: "Initial assessment and a training plan designed for you, with monthly follow-ups.",
  },
  {
    Icon: Salad,
    title: "Nutrition guidance",
    text: "Base meal plans and counseling so your training pays off twice as much.",
  },
  {
    Icon: Waves,
    title: "Recovery zone",
    text: "Stretching, mobility, and active rest: train hard and recover better.",
  },
];
