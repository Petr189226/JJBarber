"use client";

import { useEffect } from "react";

const RESERVIO_ORIGIN = "https://j-j-barbershop.reservio.com";

export function PreconnectReservio() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = RESERVIO_ORIGIN;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return null;
}
