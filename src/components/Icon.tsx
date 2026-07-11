import {
  Flame,
  Sparkles,
  HeartPulse,
  Leaf,
  Dumbbell,
  Shield,
  Moon,
  Droplets,
  FlaskConical,
  Crown,
  FileText,
  Pill,
  Ticket,
  Truck,
  Gift,
  Coins,
  Star,
  Package,
  type LucideProps,
} from "lucide-react";

const map = {
  Flame,
  Sparkles,
  HeartPulse,
  Leaf,
  Dumbbell,
  Shield,
  Moon,
  Droplets,
  FlaskConical,
  Crown,
  FileText,
  Pill,
  Ticket,
  Truck,
  Gift,
  Coins,
  Star,
  Package,
} as const;

export type IconName = keyof typeof map;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name as IconName] ?? Pill;
  return <Cmp {...props} />;
}
