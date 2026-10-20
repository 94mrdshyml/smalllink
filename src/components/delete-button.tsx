"use client";

import { useState, useTransition } from "react";
import { deleteLink } from "@/app/actions";
import { secondaryBtn } from "./ui";

export function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button type="button" className={`${secondaryBtn} w-full text-negative`} onClick={() => setConfirming(true)}>
        Delete link
      </button>
    );
  }

  return (
    <div>
      <p className="mb-3 text-[14px]">
        This deletes the link and all of its click history. The short address stops working.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={secondaryBtn} onClick={() => setConfirming(false)} disabled={pending}>
          Keep it
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-md bg-negative px-4 text-[15px] font-medium text-white active:opacity-80 disabled:opacity-50"
          disabled={pending}
          onClick={() => startTransition(() => deleteLink(id))}
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
