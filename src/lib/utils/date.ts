export const formatPersianDate = (date: string) => {
  const formatted = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(new Date(date));

  const day = formatted.find((part) => part.type === "day")?.value;
  const month = formatted.find((part) => part.type === "month")?.value;
  const year = formatted.find((part) => part.type === "year")?.value;

  const persianMonths: Record<string, string> = {
    Farvardin: "فروردین",
    Ordibehesht: "اردیبهشت",
    Khordad: "خرداد",
    Tir: "تیر",
    Mordad: "مرداد",
    Shahrivar: "شهریور",
    Mehr: "مهر",
    Aban: "آبان",
    Azar: "آذر",
    Dey: "دی",
    Bahman: "بهمن",
    Esfand: "اسفند",
  };

  return {
    day,
    month: persianMonths[month ?? ""],
    year,
  };
};