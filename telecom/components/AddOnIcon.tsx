import {
  Cloud,
  Gauge,
  Globe,
  Lock,
  Music,
  PlaneTakeoff,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Star,
  Tv,
  Watch,
  Wifi,
} from "lucide-react";

type IconCmp = React.ComponentType<{ className?: string }>;

const MAP: Record<string, IconCmp> = {
  Cloud,
  Gauge,
  Globe,
  Lock,
  Music,
  PlaneTakeoff,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Tv,
  Watch,
  Wifi,
};

/** Render a lucide icon by name (from an add-on's `icon` field). */
export function AddOnIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Star;
  return <Icon className={className} />;
}
