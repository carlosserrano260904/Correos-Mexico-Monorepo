import { type TextStyle, type TextProps, Text as RNText } from "react-native";
import { COLORS, SIZES } from "../../utils/theme";

type ThemedTextProps = TextProps & {
  /**
   * Color variant of the text.
   * - `"default"`: standard text color
   * - `"title"`: emphasized title color
   * - `"muted"`: lower contrast, for secondary text
   * @default "default"
   */
  color?: "default" | "title" | "muted";
  /**
   * Size of the text.
   * - `"small"`: small text (e.g., captions)
   * - `"default"`: regular text
   * - `"large"`: larger text for emphasis
   * - `"xl"`: extra large, typically for titles
   * @default "default"
   */
  size?: "default" | "small" | "large" | "xl";
  /**
   * Text alignment (e.g., `"left"`, `"center"`, `"right"`)
   */
  align?: TextStyle["textAlign"];
  /**
   * Font weight of the text (e.g., `"bold"`, `"600"`, `"normal"`)
   */
  fontWeight?: TextStyle["fontWeight"];
};

const textColors: Record<string, string> = {
  default: COLORS.foreground,
  muted: COLORS.foregroundMuted,
  title: COLORS.foregroundTitle,
};

const textSizes: Record<string, number> = {
  default: SIZES.fontSize.default,
  small: SIZES.fontSize.small,
  large: SIZES.fontSize.large,
  xl: SIZES.fontSize.xl,
};

/**
 * Text component
 *
 * A themed text component that supports different sizes, colors, alignment, and font weights
 * to maintain consistent typography across the app.
 *
 * All native `Text` props are supported.
 *
 * ### Example Usage
 * ```tsx
 * import { Text } from "./Text";
 *
 * // Default text
 * <Text>
 *   Hello World
 * </Text>
 *
 * // Large bold title
 * <Text size="xl" fontWeight="bold" color="title">
 *   Welcome!
 * </Text>
 *
 * // Centered muted caption
 * <Text size="small" color="muted" align="center">
 *   This is a caption
 * </Text>
 * ```
 */
export function Text({
  color = "default",
  size = "default",
  align,
  fontWeight,
  style,
  ...props
}: ThemedTextProps) {
  const textColor = textColors[color];
  const textSize = textSizes[size];

  return (
    <RNText
      style={[
        {
          color: textColor,
          fontSize: textSize,
        },
        align && { textAlign: align },
        fontWeight && { fontWeight },
        style,
      ]}
      {...props}
    />
  );
}
