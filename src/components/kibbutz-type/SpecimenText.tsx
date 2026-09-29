"use client";

import { memo, type KeyboardEvent, type ReactNode } from "react";

type SpecimenTextProps = Readonly<{
  as?: "span" | "p" | "h2";
  id?: string;
  className?: string;
  multiline?: boolean;
  /** Headers and colored-box specimen copy only — not explanatory UI. */
  editable?: boolean;
  children: ReactNode;
}>;

function SpecimenTextBase({
  as: Tag = "span",
  id,
  className,
  multiline = false,
  editable = false,
  children,
}: SpecimenTextProps) {
  if (!editable) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      className={className ? `kt-live ${className}` : "kt-live"}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      onKeyDown={(event: KeyboardEvent) => {
        if (!multiline && event.key === "Enter") event.preventDefault();
      }}
    >
      {children}
    </Tag>
  );
}

// ponytail: skip later renders so typing survives controls and form updates. A refresh remounts the original text.
export const SpecimenText = memo(SpecimenTextBase, () => true);
