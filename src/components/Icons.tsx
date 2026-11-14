import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  ariaLabel?: string;
}

function svgProps(size: number, className: string | undefined, ariaLabel?: string) {
  if (ariaLabel) {
    return {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      className,
      role: "img" as const,
      "aria-label": ariaLabel,
    };
  }
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };
}

export function MezgebLogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="9" cy="9" r="6" fill="#E4F2EC" stroke="#1F5C46" strokeWidth="1.2" />
      <rect x="17" y="4" width="11" height="11" rx="3" fill="#EEEBF8" stroke="#6A4FC4" strokeWidth="1.2" />
      <circle cx="10" cy="22" r="6" fill="#111111" />
      <path
        d="M22.5 17C22.5 17 27 21.2 27 24.1C27 26.5853 24.9853 28.6 22.5 28.6C20.0147 28.6 18 26.5853 18 24.1C18 21.2 22.5 17 22.5 17Z"
        fill="#8F6FE0"
      />
    </svg>
  );
}

export function MicIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export function VolumeIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function LockIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ShieldIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function PlayIcon({ size = 24, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" />
    </svg>
  );
}

export function HelpCircleIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function CopyIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ClockIcon({ size = 15, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function PlusIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ size = 15, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function GitBranchIcon({ size = 14, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

export function GripIcon({ size = 14, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function UndoIcon({ size = 15, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

export function RedoIcon({ size = 15, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  );
}

export function DownloadIcon({ size = 15, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

export function MoreHorizontalIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function GlobeIcon({ size = 16, className, ariaLabel }: IconProps) {
  return (
    <svg {...svgProps(size, className, ariaLabel)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function QuestionIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  switch (name) {
    case "globe":
      return (
        <svg {...svgProps(size, className)}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "user":
      return (
        <svg {...svgProps(size, className)}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...svgProps(size, className)}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "phone":
      return (
        <svg {...svgProps(size, className)}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...svgProps(size, className)}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      );
    case "shield-check":
      return <ShieldIcon size={size} className={className} />;
    case "heart-handshake":
      return (
        <svg {...svgProps(size, className)}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...svgProps(size, className)}>
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "building":
      return (
        <svg {...svgProps(size, className)}>
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case "mail":
      return (
        <svg {...svgProps(size, className)}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "graduation-cap":
      return (
        <svg {...svgProps(size, className)}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "hash":
      return (
        <svg {...svgProps(size, className)}>
          <line x1="4" x2="20" y1="9" y2="9" />
          <line x1="4" x2="20" y1="15" y2="15" />
          <line x1="10" x2="8" y1="3" y2="21" />
          <line x1="16" x2="14" y1="3" y2="21" />
        </svg>
      );
    case "toggle-left":
      return (
        <svg {...svgProps(size, className)}>
          <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
          <circle cx="8" cy="12" r="2" />
        </svg>
      );
    case "info":
      return (
        <svg {...svgProps(size, className)}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "check-square":
      return (
        <svg {...svgProps(size, className)}>
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps(size, className)}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
  }
}
