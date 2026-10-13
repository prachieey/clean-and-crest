import React from "react";

interface JsonLdProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;

  const resolvedSchema = Array.isArray(schema)
    ? {
        "@context": "https://schema.org",
        "@graph": schema.map((item) => {
          if (item && typeof item === "object" && "@context" in item) {
            const copy = { ...item } as Record<string, unknown>;
            delete copy["@context"];
            return copy;
          }
          return item;
        }),
      }
    : schema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(resolvedSchema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
