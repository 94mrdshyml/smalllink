"use client";

import { useActionState } from "react";
import { createLink, type LinkFormState } from "@/app/actions";
import { Field, inputCls, primaryBtn } from "./ui";

export function LinkForm({ host }: { host: string }) {
  const [state, action, pending] = useActionState<LinkFormState, FormData>(createLink, {});
  const slugPreview = state.values?.slug || "your-slug";

  return (
    <form action={action} className="space-y-4">
      <Field label="Where should it go?" error={state.error?.url}>
        <input
          name="url"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          placeholder="mysite.in/blog/a-very-long-post-title"
          defaultValue={state.values?.url}
          className={inputCls}
        />
      </Field>

      <Field
        label="Slug (optional)"
        error={state.error?.slug}
        hint={`Becomes ${host}/${slugPreview}. Leave empty and we pick one.`}
      >
        <input
          name="slug"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={32}
          placeholder="summer-sale"
          defaultValue={state.values?.slug}
          className={`${inputCls} font-mono`}
        />
      </Field>

      {state.error?.form && (
        <p role="alert" className="text-[13px] text-negative">
          {state.error.form}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
        {pending ? "Creating…" : "Create link"}
      </button>
    </form>
  );
}
