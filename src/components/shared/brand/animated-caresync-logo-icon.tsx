import { useId, useState } from "react";
import {
  motion as m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

type LogoState = "idle" | "hover" | "synced";
type LogoVariant = "icon" | "badge" | "lockup" | "scene";
type LogoTone = "brand" | "light" | "dark";
type LogoMotion = "none" | "subtle" | "dynamic" | "spinning";

type CareSyncLogoProps = {
  className?: string;
  size?: number;
  interactive?: boolean;
  synced?: boolean;
  variant?: LogoVariant;
  tone?: LogoTone;
  motion?: LogoMotion;
  tagline?: string;
};

type CareSyncLogoIconProps = Omit<CareSyncLogoProps, "variant" | "tagline">;

type LogoPalette = {
  primary: string;
  primaryDeep: string;
  accent: string;
  accentSoft: string;
  surface: string;
  surfaceStroke: string;
  shadow: string;
  text: string;
  mutedText: string;
};

const palettes: Record<LogoTone, LogoPalette> = {
  brand: {
    primary: "var(--primary)",
    primaryDeep: "#0F766E",
    accent: "#00C0E8",
    accentSoft: "#A7F3FF",
    surface: "#FFFFFF",
    surfaceStroke: "rgba(15, 118, 110, 0.16)",
    shadow: "rgba(0, 192, 232, 0.42)",
    text: "currentColor",
    mutedText: "currentColor",
  },
  light: {
    primary: "#FFFFFF",
    primaryDeep: "#CCFBF1",
    accent: "#67E8F9",
    accentSoft: "#ECFEFF",
    surface: "rgba(255,255,255,0.14)",
    surfaceStroke: "rgba(255,255,255,0.24)",
    shadow: "rgba(103, 232, 249, 0.52)",
    text: "#FFFFFF",
    mutedText: "rgba(255,255,255,0.72)",
  },
  dark: {
    primary: "#2DD4BF",
    primaryDeep: "#0F766E",
    accent: "#22D3EE",
    accentSoft: "#A5F3FC",
    surface: "#0F172A",
    surfaceStroke: "rgba(45, 212, 191, 0.2)",
    shadow: "rgba(34, 211, 238, 0.36)",
    text: "#F8FAFC",
    mutedText: "rgba(248,250,252,0.7)",
  },
};

const TOP_LOOP_PATH = "M64 116 C78 84 101 66 128 66 C155 66 178 84 192 116";
const BOTTOM_LOOP_PATH =
  "M64 140 C78 172 101 190 128 190 C155 190 178 172 192 140";
const CORE_LOOP_PATH =
  "M64 128 C78 98 101 82 128 82 C155 82 178 98 192 128 C178 158 155 174 128 174 C101 174 78 158 64 128Z";
const ORBIT_PATH =
  "M58 128 C75 86 100 60 128 60 C156 60 181 86 198 128 C181 170 156 196 128 196 C100 196 75 170 58 128Z";

const nodePositions = {
  idle: {
    top: { cx: 128, cy: 40, r: 8 },
    center: { cx: 128, cy: 128, r: 10 },
    bottom: { cx: 128, cy: 216, r: 8 },
  },
  hover: {
    top: { cx: 216, cy: 128, r: 8 },
    center: { cx: 128, cy: 128, r: 10 },
    bottom: { cx: 40, cy: 128, r: 8 },
  },
  synced: {
    top: { cx: 164, cy: 128, r: 8 },
    center: { cx: 128, cy: 128, r: 10 },
    bottom: { cx: 92, cy: 128, r: 8 },
  },
} satisfies Record<
  LogoState,
  Record<"top" | "center" | "bottom", { cx: number; cy: number; r: number }>
>;

const loopOffsets = {
  idle: { topY: 0, bottomY: 0, rotate: 0 },
  hover: { topY: -8, bottomY: 8, rotate: 0 },
  synced: { topY: 8, bottomY: -8, rotate: 0 },
} satisfies Record<
  LogoState,
  { topY: number; bottomY: number; rotate: number }
>;

const spring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.9,
} as const;

function CareSyncLogoMark({
  className,
  size = 64,
  interactive = true,
  synced = false,
  tone = "brand",
  motion = "subtle",
}: CareSyncLogoIconProps) {
  const prefersReducedMotion = useReducedMotion();
  const gradientId = useId();
  const glowId = useId();
  const trailRightId = useId();
  const trailLeftId = useId();
  const orbitId = useId();
  const [localState, setLocalState] = useState<LogoState>("idle");

  const palette = palettes[tone];
  const isSpinning = motion === "spinning" && !prefersReducedMotion;
  const shouldAnimate =
    motion !== "none" && motion !== "spinning" && !prefersReducedMotion;
  const isDynamic = motion === "dynamic" && shouldAnimate;
  const state: LogoState = synced
    ? "synced"
    : shouldAnimate
      ? localState
      : "idle";
  const nodes = nodePositions[state];
  const loop = loopOffsets[state];
  const showTrails = state !== "idle" || isDynamic;
  const spinAngle = useMotionValue(-Math.PI / 2);
  const topOrbitCx = useTransform(
    spinAngle,
    (angle) => 128 + 88 * Math.cos(angle),
  );
  const topOrbitCy = useTransform(
    spinAngle,
    (angle) => 128 + 88 * Math.sin(angle),
  );
  const bottomOrbitCx = useTransform(
    spinAngle,
    (angle) => 128 + 88 * Math.cos(angle + Math.PI),
  );
  const bottomOrbitCy = useTransform(
    spinAngle,
    (angle) => 128 + 88 * Math.sin(angle + Math.PI),
  );

  useAnimationFrame((time) => {
    if (!isSpinning) return;

    spinAngle.set(-Math.PI / 2 + (time / 2200) * Math.PI * 2);
  });

  function handleMouseEnter() {
    if (!interactive || synced || !shouldAnimate) return;
    setLocalState("hover");
  }

  function handleMouseLeave() {
    if (!interactive || synced || !shouldAnimate) return;
    setLocalState("idle");
  }

  function handleClick() {
    if (!interactive || synced || !shouldAnimate) return;
    setLocalState((current) => (current === "synced" ? "idle" : "synced"));
  }

  const dynamicPulse = isDynamic
    ? {
        scale: [1, 1.035, 1],
        opacity: [0.72, 1, 0.72],
      }
    : { scale: 1, opacity: 0.88 };

  return (
    <m.svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={cn(
        "block overflow-visible",
        interactive && !isSpinning && "cursor-pointer",
        className,
      )}
      role="img"
      aria-label="CareSync logo"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={interactive && shouldAnimate ? { scale: 0.96 } : undefined}
    >
      <defs>
        <filter
          id={glowId}
          x="-36%"
          y="-36%"
          width="172%"
          height="172%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="12"
            floodColor={palette.shadow}
            floodOpacity="0.78"
          />
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor={palette.accent}
            floodOpacity="0.35"
          />
        </filter>

        <linearGradient
          id={gradientId}
          x1="54"
          y1="68"
          x2="202"
          y2="188"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={palette.accentSoft} />
          <stop offset="42%" stopColor={palette.accent} />
          <stop offset="100%" stopColor={palette.primaryDeep} />
        </linearGradient>

        <linearGradient
          id={orbitId}
          x1="58"
          y1="60"
          x2="198"
          y2="196"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0.1" />
          <stop offset="45%" stopColor={palette.accentSoft} stopOpacity="0.7" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.12" />
        </linearGradient>

        <linearGradient id={trailRightId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0" />
          <stop offset="56%" stopColor={palette.accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor={palette.accentSoft} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={trailLeftId} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0" />
          <stop offset="56%" stopColor={palette.accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor={palette.accentSoft} stopOpacity="0" />
        </linearGradient>
      </defs>

      <m.g
        initial={{ scale: 1, opacity: 0.88 }}
        animate={dynamicPulse}
        transition={
          isDynamic
            ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            : spring
        }
        style={{ transformOrigin: "128px 128px" }}
      >
        <path
          d={ORBIT_PATH}
          fill="none"
          stroke={`url(#${orbitId})`}
          strokeWidth="2"
          strokeDasharray="18 12"
          opacity="0.9"
        />
      </m.g>

      <path
        d={CORE_LOOP_PATH}
        fill={palette.surface}
        opacity={tone === "brand" ? 0.96 : 0.12}
        stroke={palette.surfaceStroke}
        strokeWidth="2"
      />

      <m.g
        animate={{ y: loop.topY, rotate: loop.rotate }}
        transition={spring}
        style={{ transformOrigin: "128px 128px" }}
      >
        <path
          d={TOP_LOOP_PATH}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
      </m.g>

      <m.g
        animate={{ y: loop.bottomY, rotate: -loop.rotate }}
        transition={spring}
        style={{ transformOrigin: "128px 128px" }}
      >
        <path
          d={BOTTOM_LOOP_PATH}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
      </m.g>

      {isSpinning ? (
        <>
          <m.line
            x1="128"
            y1="128"
            x2={topOrbitCx}
            y2={topOrbitCy}
            stroke={`url(#${trailRightId})`}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.72"
          />
          <m.line
            x1="128"
            y1="128"
            x2={bottomOrbitCx}
            y2={bottomOrbitCy}
            stroke={`url(#${trailLeftId})`}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.72"
          />
          <m.circle
            cx={topOrbitCx}
            cy={topOrbitCy}
            r="8"
            fill={palette.primary}
            stroke={palette.accentSoft}
            strokeWidth="2"
          />
          <m.circle
            cx={bottomOrbitCx}
            cy={bottomOrbitCy}
            r="8"
            fill={palette.primary}
            stroke={palette.accentSoft}
            strokeWidth="2"
          />
          <m.circle
            cx={128}
            cy={128}
            r={10}
            animate={{ scale: [1, 1.14, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            fill={palette.accentSoft}
            stroke={palette.accent}
            strokeWidth="2.5"
            filter={`url(#${glowId})`}
            style={{ transformOrigin: "128px 128px" }}
          />
        </>
      ) : (
        <>
          <m.line
            x1="128"
            y1="128"
            animate={{
              x2: nodes.top.cx,
              y2: nodes.top.cy,
              opacity: showTrails ? 1 : 0,
            }}
            initial={false}
            stroke={`url(#${trailRightId})`}
            strokeWidth="9"
            strokeLinecap="round"
            transition={{ duration: 0.24 }}
          />

          <m.line
            x1="128"
            y1="128"
            animate={{
              x2: nodes.bottom.cx,
              y2: nodes.bottom.cy,
              opacity: showTrails ? 1 : 0,
            }}
            initial={false}
            stroke={`url(#${trailLeftId})`}
            strokeWidth="9"
            strokeLinecap="round"
            transition={{ duration: 0.24 }}
          />

          {(["top", "center", "bottom"] as const).map((nodeName) => {
            const node = nodes[nodeName];
            const isCenter = nodeName === "center";

            return (
              <m.circle
                key={nodeName}
                animate={{
                  cx: node.cx,
                  cy: node.cy,
                  r: node.r,
                  scale:
                    isDynamic && isCenter
                      ? [1, 1.18, 1]
                      : state === "synced" && isCenter
                        ? [1, 1.16, 1]
                        : 1,
                }}
                initial={false}
                fill={isCenter ? palette.accentSoft : palette.primary}
                stroke={isCenter ? palette.accent : palette.accentSoft}
                strokeWidth={isCenter ? 2.5 : 2}
                filter={isCenter ? `url(#${glowId})` : undefined}
                transition={
                  isDynamic && isCenter
                    ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    : state === "synced" && isCenter
                      ? { duration: 0.35, ease: "easeOut" }
                      : spring
                }
                style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              />
            );
          })}
        </>
      )}
    </m.svg>
  );
}

export function CareSyncLogoIcon(props: CareSyncLogoIconProps) {
  return <CareSyncLogoMark {...props} />;
}

export function CareSyncLogoBadge({
  className,
  size = 56,
  tone = "brand",
  motion = "subtle",
  ...props
}: CareSyncLogoIconProps) {
  const palette = palettes[tone];

  return (
    <div
      className={cn(
        "grid place-items-center rounded-2xl shadow-lg ring-1 backdrop-blur",
        tone === "brand"
          ? "bg-white shadow-cyan-950/10 ring-black/5"
          : "bg-white/12 shadow-cyan-950/10 ring-white/20",
        className,
      )}
      style={{ width: size, height: size, color: palette.text }}
    >
      <CareSyncLogoMark
        size={Math.round(size * 0.76)}
        tone={tone}
        motion={motion}
        {...props}
      />
    </div>
  );
}

export function CareSyncLogoLockup({
  className,
  size = 52,
  tone = "brand",
  motion = "subtle",
  tagline = "Centralized Support Platform",
  ...props
}: CareSyncLogoProps) {
  const palette = palettes[tone];

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      style={{ color: palette.text }}
    >
      <CareSyncLogoBadge size={size} tone={tone} motion={motion} {...props} />
      <div className="min-w-0">
        <p className="text-lg font-semibold text-white leading-none tracking-tight">
          CareSync
        </p>
        {tagline ? (
          <p
            className="mt-1 text-xs leading-none"
            style={{ color: palette.mutedText }}
          >
            {tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function CareSyncLogoScene({
  className,
  size = 220,
  tone = "light",
  motion = "dynamic",
  ...props
}: CareSyncLogoProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("relative grid place-items-center", className)}>
      <m.div
        className="absolute rounded-full bg-cyan-300/20 blur-3xl"
        style={{ width: size * 0.95, height: size * 0.95 }}
        animate={
          prefersReducedMotion
            ? { scale: 1, opacity: 0.44 }
            : { scale: [0.92, 1.08, 0.92], opacity: [0.36, 0.72, 0.36] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <CareSyncLogoBadge size={size} tone={tone} motion={motion} {...props} />
    </div>
  );
}

export function CareSyncLogo({
  variant = "icon",
  ...props
}: CareSyncLogoProps) {
  if (variant === "badge") return <CareSyncLogoBadge {...props} />;
  if (variant === "lockup") return <CareSyncLogoLockup {...props} />;
  if (variant === "scene") return <CareSyncLogoScene {...props} />;
  return <CareSyncLogoIcon {...props} />;
}

export function AnimatedCareSyncLogoIcon(props: CareSyncLogoIconProps) {
  return <CareSyncLogoIcon {...props} />;
}
