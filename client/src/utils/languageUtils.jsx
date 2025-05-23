export function getUkrainianHoursLabel(n) {
  if (n === 1) return 'година';
  if (n >= 2 && n <= 4) return 'години';
  return 'годин';
}

export function getEnglishHoursLabel(n) {
  return n === 1 ? 'hour' : 'hours';
}