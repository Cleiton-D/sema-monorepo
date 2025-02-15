import { useEffect } from 'react';

type ClickOutsideHandler = (event?: MouseEvent | TouchEvent) => void;
export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: ClickOutsideHandler
) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      if (typeof document === 'undefined') return;

      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
