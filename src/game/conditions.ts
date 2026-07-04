export function checkWin(
  day: number,
  users: number,
  money: number,
  performance: number,
  reputation: number
): boolean {
  return (
    day >= 30 &&
    users >= 1_000_000 &&
    money > 0 &&
    performance > 0 &&
    reputation > 0
  );
}

export function checkLoss(
  money: number,
  performance: number,
  reputation: number
): boolean {
  return money <= 0 || performance <= 0 || reputation <= 0;
}

export function checkDeadlineLoss(day: number, users: number): boolean {
  return day >= 30 && users < 1_000_000;
}
