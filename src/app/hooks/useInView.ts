import { useEffect, useRef, useState } from "react";

const defaultOptions: IntersectionObserverInit = {
  rootMargin: "0px",
  threshold: 0,
};

export function useInView(
  ref: React.RefObject<Element | null>,
  options: { once?: boolean; margin?: string } = {}
): boolean {
  const [inView, setInView] = useState(false);
  const { once = false, margin = "0px" } = options;
  const observed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && observed.current)) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (once) observed.current = true;
        setInView(true);
      },
      { ...defaultOptions, rootMargin: margin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, once, margin]);

  return inView;
}
