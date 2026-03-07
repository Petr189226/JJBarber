export function formatLocalDateForInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getLocalToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getStartOfDayLocal(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
}

export function getEndOfDayLocal(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
}

export type DatePresetId = "dnes" | "tyden" | "mesic" | "30dni" | "custom" | "";

export interface DateRange {
  from: string;
  to: string;
  preset: DatePresetId;
}

export function getPresetRange(preset: Exclude<DatePresetId, "custom" | "">): DateRange {
  const today = getLocalToday();
  const fromStr = formatLocalDateForInput(today);
  const toStr = fromStr;

  if (preset === "dnes") {
    return { from: fromStr, to: toStr, preset: "dnes" };
  }

  if (preset === "tyden") {
    const mon = new Date(today);
    mon.setDate(mon.getDate() - ((today.getDay() + 6) % 7));
    return {
      from: formatLocalDateForInput(mon),
      to: formatLocalDateForInput(today),
      preset: "tyden",
    };
  }

  if (preset === "mesic") {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: formatLocalDateForInput(first),
      to: formatLocalDateForInput(today),
      preset: "mesic",
    };
  }

  if (preset === "30dni") {
    const d30 = new Date(today);
    d30.setDate(d30.getDate() - 30);
    return {
      from: formatLocalDateForInput(d30),
      to: formatLocalDateForInput(today),
      preset: "30dni",
    };
  }

  return { from: "", to: "", preset: "" };
}

export function detectPresetFromRange(from: string, to: string): DatePresetId {
  if (!from || !to) return "";
  const range = getPresetRange("dnes");
  if (from === range.from && to === range.to) return "dnes";
  const rangeTyden = getPresetRange("tyden");
  if (from === rangeTyden.from && to === rangeTyden.to) return "tyden";
  const rangeMesic = getPresetRange("mesic");
  if (from === rangeMesic.from && to === rangeMesic.to) return "mesic";
  const range30 = getPresetRange("30dni");
  if (from === range30.from && to === range30.to) return "30dni";
  return "custom";
}

export function isDateRangeValid(from: string, to: string): boolean {
  if (!from || !to) return true;
  return getStartOfDayLocal(from) <= getEndOfDayLocal(to);
}
