export function formatServiceDisplay(service: string): string {
  if (!service) return "";
  return service
    .replace(/dlouhýchvlasů/gi, "dlouhých vlasů")
    .replace(/(\d)\s*Kč/g, "$1 Kč")
    .replace(/\s*–\s*/g, " – ")
    .trim();
}
