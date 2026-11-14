export interface EthiopianDate {
  year: number;
  month: number; // 1..13
  day: number; // 1..30 (or 1..5/6 for Pagume)
}

export interface GregorianDate {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
}

export const ETHIOPIAN_MONTHS: { num: number; en: string; am: string }[] = [
  { num: 1, en: "Meskerem", am: "መስከረም" },
  { num: 2, en: "Tikimt", am: "ጥቅምት" },
  { num: 3, en: "Hidar", am: "ኅዳር" },
  { num: 4, en: "Tahsas", am: "ታኅሣሥ" },
  { num: 5, en: "Tir", am: "ጥር" },
  { num: 6, en: "Yekatit", am: "የካቲት" },
  { num: 7, en: "Megabit", am: "መጋቢት" },
  { num: 8, en: "Miyazya", am: "ሚያዝያ" },
  { num: 9, en: "Ginbot", am: "ግንቦት" },
  { num: 10, en: "Sene", am: "ሰኔ" },
  { num: 11, en: "Hamle", am: "ሐምሌ" },
  { num: 12, en: "Nehase", am: "ነሐሴ" },
  { num: 13, en: "Pagume", am: "ጳጉሜን" },
];

export const GREGORIAN_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function isEthiopianLeapYear(year: number): boolean {
  return ((year % 4) + 4) % 4 === 3;
}

export function daysInEthiopianMonth(year: number, month: number): number {
  if (month >= 1 && month <= 12) return 30;
  if (month === 13) return isEthiopianLeapYear(year) ? 6 : 5;
  return 30;
}

export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInGregorianMonth(year: number, month: number): number {
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month >= 1 && month <= 12) return 31;
  return 31;
}

/**
 * Compute dynamic year bounds for people roughly aged 14 to 100 from today's date.
 */
export function getAllowedYearBounds(calendar: "eth" | "greg", now: Date = new Date()): { min: number; max: number } {
  const currentGregYear = now.getFullYear();
  if (calendar === "greg") {
    return { min: currentGregYear - 100, max: currentGregYear - 14 };
  }
  const currentEth = gregorianToEthiopian({
    year: currentGregYear,
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  return { min: currentEth.year - 100, max: currentEth.year - 14 };
}

export function isValidEthiopianDate(
  year: number,
  month: number,
  day: number,
  now: Date = new Date()
): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  const bounds = getAllowedYearBounds("eth", now);
  if (year < bounds.min || year > bounds.max) return false;
  if (month < 1 || month > 13) return false;
  const maxDay = daysInEthiopianMonth(year, month);
  return day >= 1 && day <= maxDay;
}

export function isValidGregorianDate(
  year: number,
  month: number,
  day: number,
  now: Date = new Date()
): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  const bounds = getAllowedYearBounds("greg", now);
  if (year < bounds.min || year > bounds.max) return false;
  if (month < 1 || month > 12) return false;
  const maxDay = daysInGregorianMonth(year, month);
  return day >= 1 && day <= maxDay;
}

/**
 * Ethiopian date -> Julian Day Number
 * JDN = 1724220 + 365*(year-1) + floor(year/4) + 30*(month-1) + day
 */
export function ethiopianToJdn(year: number, month: number, day: number): number {
  return 1724220 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day;
}

/**
 * Julian Day Number -> Gregorian date (standard Fliegel-Van Flandern algorithm)
 */
export function jdnToGregorian(jdn: number): GregorianDate {
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  return { year, month, day };
}

export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToEthiopian(jdn: number): EthiopianDate {
  const offset = jdn - 1724221;
  const cycles = Math.floor(offset / 1461);
  const rem = ((offset % 1461) + 1461) % 1461;

  let yearInCycle = 0;
  let dayOfYear = 0;
  if (rem < 365) {
    yearInCycle = 0;
    dayOfYear = rem;
  } else if (rem < 730) {
    yearInCycle = 1;
    dayOfYear = rem - 365;
  } else if (rem < 1096) {
    yearInCycle = 2; // Leap year (year % 4 === 3)
    dayOfYear = rem - 730;
  } else {
    yearInCycle = 3;
    dayOfYear = rem - 1096;
  }

  const year = cycles * 4 + yearInCycle + 1;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  return { year, month, day };
}

export function ethiopianToGregorian(eth: EthiopianDate): GregorianDate {
  return jdnToGregorian(ethiopianToJdn(eth.year, eth.month, eth.day));
}

export function gregorianToEthiopian(greg: GregorianDate): EthiopianDate {
  return jdnToEthiopian(gregorianToJdn(greg.year, greg.month, greg.day));
}

export function formatGregorianDate(greg: GregorianDate): string {
  const monthName = GREGORIAN_MONTHS_EN[greg.month - 1] ?? "";
  return `${greg.day} ${monthName} ${greg.year}`;
}

export function formatGregorianIso(greg: GregorianDate): string {
  const mm = String(greg.month).padStart(2, "0");
  const dd = String(greg.day).padStart(2, "0");
  return `${greg.year}-${mm}-${dd}`;
}

export function formatEthiopianDate(eth: EthiopianDate, lang: "en" | "am" = "en"): string {
  const m = ETHIOPIAN_MONTHS[eth.month - 1];
  const monthName = lang === "am" ? m?.am ?? "" : m?.en ?? "";
  return `${eth.day} ${monthName} ${eth.year}`;
}
