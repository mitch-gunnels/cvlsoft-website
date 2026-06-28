import {
  Building2,
  Car,
  Droplets,
  Gem,
  HeartHandshake,
  Home,
  LifeBuoy,
  Lock,
  PawPrint,
  PlugZap,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Umbrella,
  Wallet,
} from "lucide-react";

type IconCmp = React.ComponentType<{ className?: string }>;

const MAP: Record<string, IconCmp> = {
  Building2,
  Car,
  Droplets,
  Gem,
  HeartHandshake,
  Home,
  LifeBuoy,
  Lock,
  PawPrint,
  PlugZap,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Umbrella,
  Wallet,
};

/** Render a lucide icon by name (from a product/rider `icon` field). */
export function ShopIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Shield;
  return <Icon className={className} />;
}
