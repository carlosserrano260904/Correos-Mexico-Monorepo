import { Pressable, type PressableProps, Text, StyleSheet } from "react-native";
import type { StyleProp, TextStyle } from "react-native";
import {
  buttonBackgroundColors,
  buttonBorderColors,
  buttonTextColors,
  SIZES,
} from "../../utils/theme";

const sizeStyles: Record<string, Record<string, number>> = {
  small: { height: SIZES.button.small, paddingHorizontal: 12 },
  default: { height: SIZES.button.default, paddingHorizontal: 16 },
  large: { height: SIZES.button.large, paddingHorizontal: 20 },
};

const fontSizes: Record<string, number> = {
  small: SIZES.fontSize.small,
  default: SIZES.fontSize.default,
  large: SIZES.fontSize.large,
};

type ButtonProps = PressableProps & {
  /**
   * Variant of the button
   * - `"default"`: solid primary color
   * - `"secondary"`: lighter background
   * - `"outline"`: border button with transparent background
   * @default "default"
   */
  type?: "default" | "secondary" | "outline";

  /**
   * Size of the button
   * - `"small"`: height 36, font size 14
   * - `"default"`: height 48, font size 16
   * - `"large"`: height 60, font size 18
   * @default "default"
   */
  size?: "small" | "default" | "large";

  /**
   * Text or elements to render inside the button
   */
  children: React.ReactNode;

  /**
   * Custom styles for the text inside the button
   */
  textStyles?: StyleProp<TextStyle>;
};

/**
 * Button component
 *
 * A customizable button that supports multiple types and sizes.
 * You can override the button and text styles using `style` and `textStyles` respectively.
 * All native `Pressable` props are supported (e.g., `onPress`, `disabled`).
 *
 * ### Example Usage
 * ```tsx
 * import { Button } from './Button';
 *
 * // Default button
 * <Button type="default" size="large" onPress={() => console.log('Clicked')}>
 *   Submit
 * </Button>
 *
 * // Secondary small button
 * <Button type="secondary" size="small">
 *   Cancel
 * </Button>
 *
 * // Outline button with custom text style
 * <Button type="outline" size="default" textStyles={{ fontWeight: 'bold' }}>
 *   Learn More
 * </Button>
 * ```
 */
export function Button({
  type = "default",
  size = "default",
  children,
  style,
  textStyles,
  ...props
}: ButtonProps) {
  const bgColor = buttonBackgroundColors[type];
  const txtColor = buttonTextColors[type];
  const borderColor = buttonBorderColors[type];
  const btnSize = sizeStyles[size];
  const fontSize = fontSizes[size];

  return (
    <Pressable
      style={(state) => [
        styles.button,
        btnSize,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: type === "outline" ? 1 : 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: txtColor, fontSize }, textStyles]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
