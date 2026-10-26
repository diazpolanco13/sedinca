import type { SVGProps } from "react";

/** Iconos de trazo lineal (24×24); heredan el color con currentColor. */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Icon({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
  </Icon>
);

export const EyeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const ClipboardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1" />
    <path d="M9 10h6M9 14h6M9 18h4" />
  </Icon>
);

export const ClipboardCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 10l1.5 1.5L13 9M9 15h6" />
  </Icon>
);

export const MedalIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="9" r="5" />
    <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
  </Icon>
);

export const GuardIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="7" r="3.5" />
    <path d="M5 21v-2a5 5 0 015-5h4a5 5 0 015 5v2" />
  </Icon>
);

export const IdCardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6.5 16c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2M14 10h4M14 13h3" />
  </Icon>
);

export const IdCardSimpleIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M14 10h4M14 13h3" />
  </Icon>
);

export const MonitorIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const TargetIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </Icon>
);

export const FactoryIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 21V11l5 3v-3l5 3v-3l5 3V5h3v16H3z" />
  </Icon>
);

export const BuildingIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="3" width="10" height="18" />
    <path d="M15 9h4v12h-4M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1" />
  </Icon>
);

export const BriefcaseIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5h6v2M3 13h18" />
  </Icon>
);

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-5h4v5" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7.5L16 5l1.2 5.5L5.2 13z" />
    <path d="M17 7.5l3-1v4l-3-.5" />
    <path d="M9 12.5V17H5" />
    <path d="M5 15v4" />
  </Icon>
);

export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Icon>
);

export const CoilIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="4" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="18" cy="12" r="4" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </Icon>
);

export const TeamIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1M15.5 14H17a4 4 0 014 4v2" />
  </Icon>
);

export const ChatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1121 11.5z" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const HeadsetIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 14v-2a8 8 0 0116 0v2" />
    <rect x="3" y="14" width="4" height="6" rx="1.5" />
    <rect x="17" y="14" width="4" height="6" rx="1.5" />
    <path d="M19 20a3 3 0 01-3 2h-3" />
  </Icon>
);
