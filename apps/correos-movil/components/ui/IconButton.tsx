import { Pressable, type PressableProps, StyleSheet } from "react-native";
import {
  buttonBackgroundColors,
  buttonBorderColors,
  SIZES,
} from "../../utils/theme";

const sizeStyles: Record<string, number> = {
  small: SIZES.button.small,
  default: SIZES.button.default,
  large: SIZES.button.large,
};

type IconButtonProps = PressableProps & {
  /**
   * Variant of the button
   * - `"default"`: solid primary color
   * - `"secondary"`: lighter background
   * - `"outline"`: border button with transparent background
   * @default "default"
   */
  type?: "default" | "secondary" | "outline";
  /**
   * Size of the button (square dimensions)
   * - `"small"`: 36x36
   * - `"default"`: 48x48
   * - `"large"`: 60x60
   * @default "default"
   */
  size?: "small" | "default" | "large";
  /**
   * Whether the button should be fully rounded (circle)
   * @default false
   */
  round?: boolean;
  /**
   * Icon element to render inside the button
   */
  children: React.ReactNode;
};

/**
 * IconButton component
 *
 * A square button designed to contain an icon.
 * Supports multiple types and sizes with the same styling as the regular Button.
 * All native `Pressable` props are supported (e.g., `onPress`, `disabled`).
 *
 * ### Example Usage
 * ```tsx
 * import { IconButton } from './IconButton';
 * import { Icon } from 'some-icon-library';
 *
 * // Default icon button
 * <IconButton type="default" size="large" onPress={() => console.log('Clicked')}>
 *   <Icon name="heart" size={24} color="#FFFFFF" />
 * </IconButton>
 *
 * // Round (circle) icon button
 * <IconButton type="secondary" size="default" round>
 *   <Icon name="close" size={20} color="#374151" />
 * </IconButton>
 *
 * // Outline circular button
 * <IconButton type="outline" size="small" round>
 *   <Icon name="search" size={16} color="#DE1484" />
 * </IconButton>
 * ```
 */
export function IconButton({
  type = "default",
  size = "default",
  round = false,
  children,
  style,
  ...props
}: IconButtonProps) {
  const bgColor = buttonBackgroundColors[type];
  const borderColor = buttonBorderColors[type];
  const buttonSize = sizeStyles[size];

  return (
    <Pressable
      style={(state) => [
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: bgColor,
          borderColor,
          borderWidth: type === "outline" ? 1 : 0,
          borderRadius: round ? buttonSize / 2 : 8,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
});
