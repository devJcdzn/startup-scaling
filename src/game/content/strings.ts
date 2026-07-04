export const STRINGS = {
  gameTitle: "Battle of Scaling",
  dayLabel: (day: number) => `Day ${day} / 30`,
  nextDayIn: (seconds: number) => `Next day in ${seconds.toFixed(1)}s`,
  status: {
    running: "Running",
    decision: "Decision Active",
    paused: "Paused",
  },
  cards: {
    cashflow: "Cashflow",
    revenue: "Revenue",
    productHealth: "Product Health",
    growth: "Growth",
  },
  metrics: {
    cash: "Cash",
    dailyRevenue: "Revenue/day",
    dailyExpenses: "Expenses/day",
    dailyBalance: "Daily Balance",
    runway: "Runway",
    users: "Users",
    payingUsers: "Paying Users",
    conversion: "Conversion",
    arpu: "ARPU",
    mrr: "MRR",
    performance: "Performance",
    reputation: "Reputation",
    bugs: "Bugs",
    techDebt: "Tech Debt",
    hype: "Hype",
    newToday: "New Today",
    growthRate: "Growth Rate",
  },
  runway: {
    profitable: "Profitable",
    days: (n: number) => `${n} days`,
  },
  alerts: {
    performanceWarning: "Performance is dropping. Users may start losing trust.",
    performanceCritical:
      "Performance is critical. Your reputation and revenue are at risk.",
    reputationWarning: "Reputation is weakening. Conversion may suffer.",
    reputationCritical: "Reputation is collapsing. Users are leaving.",
    techDebtWarning: "Tech debt is slowing you down.",
    techDebtCritical: "Tech debt is now a structural risk.",
    bugsWarning: "Bug reports are increasing.",
    bugsCritical: "Bugs are damaging user trust.",
    runwayWarning:
      "Runway is getting short. You need profitability or funding soon.",
    runwayCritical:
      "Critical runway. The startup may run out of cash soon.",
  },
  defeat: {
    cash: {
      title: "You ran out of cash.",
      message:
        "Growth was not enough to sustain your operating costs.",
    },
    performance: {
      title: "Your product collapsed.",
      message:
        "Performance reached zero. Users could no longer use the product reliably.",
    },
    reputation: {
      title: "Users lost trust.",
      message:
        "Your reputation reached zero. The market moved on.",
    },
    deadline: {
      title: "You survived, but did not scale.",
      message:
        "The startup reached day 30, but failed to hit 1M users.",
    },
  },
  victory: {
    title: "You scaled successfully.",
    message: "Your SaaS survived 30 days and reached 1M users.",
  },
  feedback: {
    positive: "Good call. The system is more stable now.",
    neutral: "Trade-off accepted. This may cost you later.",
    negative: "That decision created new problems.",
    critical: "The incident escalated.",
  },
  event: {
    penaltyIn: (s: number) => `Penalty in ${s.toFixed(1)}s`,
    ifIgnored: "If ignored:",
    expectedImpact: "Expected impact:",
  },
  log: {
    dayEnded: (day: number, balance: number) =>
      balance >= 0
        ? `Day ${day} ended profitable. Cash increased by $${Math.abs(balance).toLocaleString()}.`
        : `Day ${day} burned $${Math.abs(balance).toLocaleString()}.`,
  },
};
