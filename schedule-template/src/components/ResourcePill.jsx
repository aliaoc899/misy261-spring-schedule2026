import React from "react";

const VARIANT_STYLES = {
  lecture: "pill pill-lecture",
  recording: "pill pill-recording",
  assignment: "pill pill-assignment",
};

export default function ResourcePill({ label, href, variant, download }) {
  const className = VARIANT_STYLES[variant] || "pill";

  if (href) {
    return (
      <a
        className={className}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        download={download}
      >
        {label}
      </a>
    );
  }

  return <span className={className}>{label}</span>;
}
