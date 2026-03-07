import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatLocalDateForInput,
  getLocalToday,
  getStartOfDayLocal,
  getEndOfDayLocal,
  getPresetRange,
  detectPresetFromRange,
  isDateRangeValid,
} from "./dateFilter";

describe("dateFilter", () => {
  describe("formatLocalDateForInput", () => {
    it("formátuje datum v lokální timezone bez UTC posunu", () => {
      // 5. března 2025 00:00 local = v ČR (UTC+1) je to 4.3. 23:00 UTC
      // toISOString().slice(0,10) by vrátilo "2025-03-04" – špatně
      const d = new Date(2025, 2, 5, 0, 0, 0, 0);
      expect(formatLocalDateForInput(d)).toBe("2025-03-05");
    });

    it("zvládá přelom roku", () => {
      const d = new Date(2024, 11, 31);
      expect(formatLocalDateForInput(d)).toBe("2024-12-31");
    });
  });

  describe("getStartOfDayLocal", () => {
    it("parsuje YYYY-MM-DD na začátek dne local", () => {
      const ts = getStartOfDayLocal("2025-03-05");
      const d = new Date(ts);
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(5);
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
    });
  });

  describe("getEndOfDayLocal", () => {
    it("parsuje YYYY-MM-DD na konec dne local", () => {
      const ts = getEndOfDayLocal("2025-03-05");
      const d = new Date(ts);
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(5);
      expect(d.getHours()).toBe(23);
      expect(d.getMinutes()).toBe(59);
    });
  });

  describe("getPresetRange", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 5, 12, 0, 0)); // 5.3.2025 12:00
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('preset "dnes" vrací dnešní datum v obou polích', () => {
      const range = getPresetRange("dnes");
      expect(range.from).toBe("2025-03-05");
      expect(range.to).toBe("2025-03-05");
      expect(range.preset).toBe("dnes");
    });

    it('preset "tyden" vrací pondělí až dnes', () => {
      const range = getPresetRange("tyden");
      expect(range.from).toBe("2025-03-03"); // pondělí
      expect(range.to).toBe("2025-03-05");
      expect(range.preset).toBe("tyden");
    });

    it('preset "mesic" vrací 1. dnešního měsíce až dnes', () => {
      const range = getPresetRange("mesic");
      expect(range.from).toBe("2025-03-01");
      expect(range.to).toBe("2025-03-05");
      expect(range.preset).toBe("mesic");
    });

    it('preset "30dni" vrací rozsah 30 dní zpět', () => {
      const range = getPresetRange("30dni");
      expect(range.from).toBe("2025-02-03");
      expect(range.to).toBe("2025-03-05");
      expect(range.preset).toBe("30dni");
    });
  });

  describe("detectPresetFromRange", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 5, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("detekuje preset dnes", () => {
      expect(detectPresetFromRange("2025-03-05", "2025-03-05")).toBe("dnes");
    });

    it("detekuje preset tyden", () => {
      expect(detectPresetFromRange("2025-03-03", "2025-03-05")).toBe("tyden");
    });

    it("vrací custom pro vlastní rozsah", () => {
      expect(detectPresetFromRange("2025-02-15", "2025-03-01")).toBe("custom");
    });

    it("vrací prázdný string když chybí from nebo to", () => {
      expect(detectPresetFromRange("", "2025-03-05")).toBe("");
      expect(detectPresetFromRange("2025-03-05", "")).toBe("");
      expect(detectPresetFromRange("", "")).toBe("");
    });
  });

  describe("isDateRangeValid", () => {
    it("platí když Od <= Do", () => {
      expect(isDateRangeValid("2025-03-01", "2025-03-05")).toBe(true);
      expect(isDateRangeValid("2025-03-05", "2025-03-05")).toBe(true);
    });

    it("neplatí když Od > Do", () => {
      expect(isDateRangeValid("2025-03-10", "2025-03-05")).toBe(false);
    });

    it("platí když je from nebo to prázdné", () => {
      expect(isDateRangeValid("", "2025-03-05")).toBe(true);
      expect(isDateRangeValid("2025-03-05", "")).toBe(true);
      expect(isDateRangeValid("", "")).toBe(true);
    });
  });

  describe("timezone edge case – půlnoc", () => {
    it("dnešní datum není včerejší při UTC posunu", () => {
      // Simulace: uživatel v UTC+2, je 5.3. 01:00 local = 4.3. 23:00 UTC
      // getLocalToday() musí vrátit 5.3., ne 4.3.
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 5, 1, 0, 0)); // 5.3. 01:00
      const range = getPresetRange("dnes");
      expect(range.from).toBe("2025-03-05");
      expect(range.to).toBe("2025-03-05");
      vi.useRealTimers();
    });
  });
});
