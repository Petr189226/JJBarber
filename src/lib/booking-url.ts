const RESERVIO_HOME = "https://j-j-barbershop.reservio.com/";
const BRANCH_URLS: Record<string, string> = {
  Vršovice: "https://j-j-barbershop.reservio.com/j-j-barber-shop",
  Strašnice: "https://j-j-barbershop.reservio.com/j-j-barber-shop-strasnice",
};

export function getBookingLink() {
  return { href: RESERVIO_HOME, target: "_blank" as const, rel: "noopener noreferrer" };
}

export function getBookingLinkForBranch(branch: { name: string }) {
  const href = BRANCH_URLS[branch.name] ?? RESERVIO_HOME;
  return { href, target: "_blank" as const, rel: "noopener noreferrer" };
}
