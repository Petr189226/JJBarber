import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n";

interface BookButtonProps {
  href: string;
  label: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "textLink";
  action?: "external" | "scroll";
  scrollTarget?: string;
}

export function BookButton({
  href,
  label,
  size = "md",
  showIcon = true,
  className = "",
  variant = "primary",
  action = "external",
  scrollTarget,
}: BookButtonProps) {
  const { t } = useLanguage();
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (action === "scroll") {
      const targetSelector = scrollTarget ?? href;
      const el = typeof document !== "undefined" ? document.querySelector(targetSelector) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (clicked) return;
    setClicked(true);
    setTimeout(() => {
      window.open(href, "_blank");
      setClicked(false);
    }, 300);
  };

  const sizeClasses = {
    sm: "px-5 py-2.5 text-[0.82rem]",
    md: "px-6 py-3 text-[0.85rem]",
    lg: "px-10 py-5 text-[1rem]",
  };

  const sizeClass = variant === "textLink" ? "" : sizeClasses[size];

  const baseByVariant: Record<NonNullable<BookButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-b from-[#D4B85A] to-[#C9A84C] hover:from-[#DDC268] hover:to-[#D4B85A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(201,168,76,0.2)] focus-visible:ring-[#C9A84C]/50",
    secondary:
      "border border-[#3A3A3A] text-[#B5AEA4] bg-transparent hover:border-white/20 hover:text-[#C4BEB4] hover:bg-white/[0.03] focus-visible:ring-white/20",
    ghost:
      "border border-[#2A2A2A] text-[#8A8580] bg-transparent hover:border-white/15 hover:text-[#C4BEB4] focus-visible:ring-white/20",
    textLink:
      "bg-transparent text-[#8A8580] hover:text-[#B5AEA4] px-0 py-0 border-none focus-visible:ring-white/20",
  };

  const baseClasses = baseByVariant[variant];

  const interactiveStateClasses =
    action === "external"
      ? clicked
        ? "scale-[0.98] opacity-90 pointer-events-none"
        : "active:scale-[0.98]"
      : "";

  const iconSize = size === "lg" ? 18 : size === "md" ? 14 : 12;

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-disabled={clicked}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:outline-none ${baseClasses} ${interactiveStateClasses} ${sizeClass} ${className}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {clicked ? t("cta.redirecting") : label}
      {showIcon && <ExternalLink size={iconSize} />}
    </a>
  );
}
