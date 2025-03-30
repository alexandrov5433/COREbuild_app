import { useEffect, useRef } from "react";

type ExtendedEventMap = DocumentEventMap & WindowEventMap & HTMLElementEventMap;

export default function useEventListerner<K extends keyof ExtendedEventMap>(
    targetElement: HTMLElement | Window | Document,
    eventType: K,
    eventListener: (e: ExtendedEventMap[K]) => void
) {
    const eventListenerRef = useRef(eventListener);

    useEffect(() => {
        eventListenerRef.current = eventListener;
    }, [eventListener]);

    useEffect(() => {
        if (!targetElement || !eventType) {
            return;
        }
        const __eventListener = (e: Event) => eventListenerRef.current(e as ExtendedEventMap[K]);

        targetElement.addEventListener(eventType, __eventListener);

        return () => {
            targetElement.removeEventListener(eventType, __eventListener);
        }
    }, [targetElement, eventType]);
}