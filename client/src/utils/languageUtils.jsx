export function getUkrainianDaysLabel(n) {
  if (n === 1) return 'день';
  if (n >= 2 && n <= 4) return 'дні';
  return 'днів';
}

export function getEnglishDaysLabel(n) {
  return n === 1 ? 'day' : 'days';
}
