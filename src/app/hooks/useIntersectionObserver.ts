import { useEffect, useRef, useState } from "react";

/**
 * A React hook that observes when an element enters or exits the viewport (or a root element).
 * Cleans up and re-observes when root or options change.
 *
 * @returns An object with:
 * - `targetRef`: A callback ref for the element to observe
 * - `isIntersecting`: Whether the element is currently intersecting
 */
export function useIntersectionObserver<T extends Element>(props: {
  threshold?: number | number[];
  onIntersecting(): void;
  minHeightToTrack?: number;
  minWidthToTrack?: number;
}) {
  const { threshold = 0, minHeightToTrack = 0, minWidthToTrack = 0 } = props;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const elementRef = useRef<T | null>(null);

  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    if (!isIntersecting) {
      return;
    }

    propsRef.current.onIntersecting();
  }, [isIntersecting]);

  const targetRef = (node: T | null) => {
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = node;

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(
            Boolean(
              entry.isIntersecting &&
                entry.boundingClientRect.width >= minWidthToTrack &&
                entry.boundingClientRect.height >= minHeightToTrack
            )
          );
        },
        { threshold }
      );

      observerRef.current.observe(node);
    }
  };

  // Cleanup on unmount or when root/threshold changes
  useEffect(() => {
    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
        observerRef.current.disconnect();
      }
    };
  }, [threshold]);

  return { targetRef };
}
