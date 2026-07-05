export type GrowthChannel =
  | "paid_ads"
  | "influencer"
  | "product_hunt"
  | "content"
  | "community"
  | "partnership";

export interface GrowthAction {
  id: string;
  label: string;
  description: string;
  channel: GrowthChannel;
  cost: number;
  trafficPotential: { min: number; max: number };
  risk: "low" | "medium" | "high";
}

export type CampaignOutcome = "success" | "neutral" | "failure" | "backfire";

export interface CampaignResult {
  outcome: CampaignOutcome;
  acquiredUsers: number;
  payingUsers: number;
  cac: number;
  readiness: number;
  factors: string[];
}

export const GROWTH_ACTIONS: GrowthAction[] = [
  {
    id: "paid_ads_small",
    label: "Small Ad Campaign",
    description: "Targeted ads on social media platforms.",
    channel: "paid_ads",
    cost: 500,
    trafficPotential: { min: 100, max: 800 },
    risk: "low",
  },
  {
    id: "paid_ads_large",
    label: "Large Ad Campaign",
    description: "Major paid acquisition push across multiple channels.",
    channel: "paid_ads",
    cost: 2000,
    trafficPotential: { min: 500, max: 3000 },
    risk: "medium",
  },
  {
    id: "influencer_deal",
    label: "Influencer Partnership",
    description: "Partner with a tech influencer for exposure.",
    channel: "influencer",
    cost: 1500,
    trafficPotential: { min: 300, max: 2500 },
    risk: "medium",
  },
  {
    id: "content_marketing",
    label: "Content Marketing",
    description: "Create blog posts, tutorials, and guides.",
    channel: "content",
    cost: 300,
    trafficPotential: { min: 50, max: 500 },
    risk: "low",
  },
  {
    id: "community_engagement",
    label: "Community Engagement",
    description: "Active participation in developer communities.",
    channel: "community",
    cost: 100,
    trafficPotential: { min: 20, max: 300 },
    risk: "low",
  },
  {
    id: "partnership_deal",
    label: "Strategic Partnership",
    description: "Partner with complementary product for cross-promotion.",
    channel: "partnership",
    cost: 1000,
    trafficPotential: { min: 200, max: 2000 },
    risk: "medium",
  },
];
