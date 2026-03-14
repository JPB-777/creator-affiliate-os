"use client";

/**
 * Simple word-level diff display.
 * No external lib — splits by words and highlights changes.
 */
function diffWords(
  oldText: string,
  newText: string
): { text: string; type: "same" | "added" | "removed" }[] {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);
  const result: { text: string; type: "same" | "added" | "removed" }[] = [];

  // Simple LCS-based approach with word granularity
  const maxLen = Math.max(oldWords.length, newWords.length);
  let oi = 0;
  let ni = 0;

  while (oi < oldWords.length || ni < newWords.length) {
    if (oi >= oldWords.length) {
      result.push({ text: newWords[ni], type: "added" });
      ni++;
    } else if (ni >= newWords.length) {
      result.push({ text: oldWords[oi], type: "removed" });
      oi++;
    } else if (oldWords[oi] === newWords[ni]) {
      result.push({ text: oldWords[oi], type: "same" });
      oi++;
      ni++;
    } else {
      // Look ahead to find if old word appears later in new
      const newIdx = newWords.indexOf(oldWords[oi], ni);
      const oldIdx = oldWords.indexOf(newWords[ni], oi);

      if (newIdx !== -1 && (oldIdx === -1 || newIdx - ni < oldIdx - oi)) {
        // Words were added before the match
        while (ni < newIdx) {
          result.push({ text: newWords[ni], type: "added" });
          ni++;
        }
      } else if (oldIdx !== -1) {
        // Words were removed
        while (oi < oldIdx) {
          result.push({ text: oldWords[oi], type: "removed" });
          oi++;
        }
      } else {
        result.push({ text: oldWords[oi], type: "removed" });
        result.push({ text: newWords[ni], type: "added" });
        oi++;
        ni++;
      }
    }

    if (result.length > maxLen * 2) break; // Safety guard
  }

  return result;
}

export function DriftDiff({
  previous,
  current,
}: {
  previous: string;
  current: string;
}) {
  const parts = diffWords(previous, current);

  return (
    <div className="rounded-md border bg-muted/30 p-3 text-xs font-mono leading-relaxed overflow-x-auto max-h-40 overflow-y-auto">
      {parts.map((part, i) => {
        if (part.type === "removed") {
          return (
            <span
              key={i}
              className="bg-destructive/20 text-destructive line-through"
            >
              {part.text}
            </span>
          );
        }
        if (part.type === "added") {
          return (
            <span key={i} className="bg-success/20 text-success">
              {part.text}
            </span>
          );
        }
        return <span key={i}>{part.text}</span>;
      })}
    </div>
  );
}
