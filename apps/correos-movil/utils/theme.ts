export const COLORS = {
  brand: "#DE1484",

  background: "#FFFFFF",
  surface: "#F9FAFB",

  border: "#E5E7EB",

  foreground: "#374151",
  foregroundMuted: "#9CA3AF",
  foregroundTitle: "#030712",

  white: "#FFFFFF",
  black: "#000000",
} as const;

export const SIZES = {
  button: {
    small: 36,
    default: 48,
    large: 60,
  },
  fontSize: {
    small: 14,
    default: 16,
    large: 18,
    xl: 24,
  },
  borderRadius: {
    none: 0,
    small: 4,
    default: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
} as const;
