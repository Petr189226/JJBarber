export function formatServiceDisplay(service: string): string {
  if (!service) return "";
  
  const s = service.normalize("NFC");
  const noAccents = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();
  
  const map = [
    { match: ["klasicky"], display: "Klasický střih" },
    { match: ["dlouhy"], display: "Střih dlouhých vlasů" },
    { match: ["uprava"], display: "Úprava vousů" },
    { match: ["holeni"], display: "Holení vousů" },
    { match: ["detsky"], display: "Dětský střih" },
    { match: ["+vousy", "plusvousy", "strihavousy", "strihvousy", "kombinace"], display: "Střih + vousy" },
  ];
  
  let foundName = "";
  for (const item of map) {
    if (item.match.some(m => noAccents.includes(m))) {
      foundName = item.display;
      break;
    }
  }
  
  if (foundName) {
    const priceMatch = s.match(/(\d+)\s*Kč/i);
    if (priceMatch) {
      return `${foundName} – ${priceMatch[1]} Kč`;
    }
    return foundName;
  }

  return s
    .replace(/(\d)\s*Kč/g, "$1 Kč")
    .replace(/\s*–\s*/g, " – ")
    .trim();
}

export function formatServiceForVoucher(service: string): string {
  if (!service) return "";
  let formatted = formatServiceDisplay(service);
  formatted = formatted
    .replace(/dlouhýchvlasů/gi, "dlouhých vlasů")
    .replace(/dlouhých\s+vlasů/gi, "dlouhých\u00A0vlasů");
  formatted = formatted.replace(/\s*–\s*\d+\s*Kč/i, "").trim();
  return formatted;
}
