import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
  Hourglass,
  Users,
  UserCheck,
  Repeat,
  Percent,
  Gauge,
  ShieldCheck,
  Flame,
  GitBranch,
  Bug,
  Server,
  Package,
  BriefcaseBusiness,
  ShieldAlert,
  Info,
  CircleAlert,
  TriangleAlert,
  Siren,
  CircleCheck,
  ScrollText,
} from "lucide-react";

export const metricIcons = {
  cash: Wallet,
  dailyRevenue: TrendingUp,
  dailyExpenses: TrendingDown,
  dailyBalance: Scale,
  runway: Hourglass,
  users: Users,
  payingUsers: UserCheck,
  mrr: Repeat,
  conversionRate: Percent,
  performance: Gauge,
  reputation: ShieldCheck,
  hype: Flame,
  techDebt: GitBranch,
  bugs: Bug,
};

export const eventCategoryIcons = {
  infra: Server,
  product: Package,
  growth: TrendingUp,
  business: BriefcaseBusiness,
  security: ShieldAlert,
};

export const severityIcons = {
  low: Info,
  medium: CircleAlert,
  high: TriangleAlert,
  critical: Siren,
};

export const generalIcons = {
  success: CircleCheck,
  log: ScrollText,
};
