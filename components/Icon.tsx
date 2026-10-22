import {
  Smile, Sparkles, ShieldCheck, Sun, Layers, Crown, Baby, GraduationCap, Calculator, BookOpen, Target,
  MessageCircle, Landmark, Trophy, Building2, Home, KeyRound, TrendingUp, FileText, type LucideProps,
} from "lucide-react";

const icons = {
  Smile, Sparkles, ShieldCheck, Sun, Layers, Crown, Baby, GraduationCap, Calculator, BookOpen, Target,
  MessageCircle, Landmark, Trophy, Building2, Home, KeyRound, TrendingUp, FileText,
} as const;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = icons[name as keyof typeof icons] ?? Sparkles;
  return <Cmp aria-hidden="true" {...props} />;
}
