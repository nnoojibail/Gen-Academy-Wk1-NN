import { useState, useCallback } from 'react';

type VibeStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; text: string }
  | { status: 'error'; message: string };

interface VibeDest {
  name: string;
  country: string;
  travelMonth: string;
}

// Canned fallback rendered when ANTHROPIC_API_KEY is not configured.
// Clearly labels itself so instructors reviewing the repo understand what it is.
function cannedSummary({ name, country, travelMonth }: VibeDest): string {
  return (
    `${name} is a standout bucket-list destination in ${country}, celebrated for its ` +
    `distinct landscapes and cultural character. ${travelMonth} is widely regarded as ` +
    `an ideal time to visit, offering the best conditions for exploration. ` +
    `(Live AI summary requires ANTHROPIC_API_KEY in .env.local.)`
  );
}

export function useVibeSummary() {
  const [vibeState, setVibeState] = useState<VibeStatus>({ status: 'idle' });

  const generate = useCallback(async (dest: VibeDest): Promise<string | null> => {
    setVibeState({ status: 'loading' });
    try {
      const res = await fetch('/api/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dest),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = (await res.json()) as {
        summary: string | null;
        fallback?: boolean;
        error?: string;
      };

      const text = data.fallback || !data.summary ? cannedSummary(dest) : data.summary;
      setVibeState({ status: 'done', text });
      return text;
    } catch (err) {
      // /api/vibe only exists during `npm run dev`. In a prod build (or if the
      // endpoint 404s), fall back to the canned summary gracefully.
      const text = cannedSummary(dest);
      setVibeState({ status: 'done', text });
      return text;
    }
  }, []);

  return { vibeState, generate };
}
