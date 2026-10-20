"use client";

import { useState } from "react";
import { primaryBtn } from "./ui";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={`${primaryBtn} w-full`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard blocked: leave the label as is, the link is selectable above
        }
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
