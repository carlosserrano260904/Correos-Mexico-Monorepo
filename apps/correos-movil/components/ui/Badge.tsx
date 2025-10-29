import { Text, View, StyleSheet } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  buttonBackgroundColors,
  buttonBorderColors,
  buttonTextColors,
  SIZES,
} from "../../utils/theme";

type BadgeProps = {
  /**
   * Variant of the badge
   * - `"default"`: solid brand color
   * - `"secondary"`: neutral background
   * - `"outline"`: transparent background with border
   * - `"brandLight"`: brand background with opacity and brand-colored text
   * @default "default"
   */
  type?: "default" | "secondary" | "outline" | "subtle";

  /**
   * Text or elements to render inside the badge
   */
  children: React.ReactNode;

  /**
   * Optional custom text style
   */
  textStyles?: StyleProp<TextStyle>;

  /**
   * Optional custom badge style
   */
  style?: StyleProp<ViewStyle>;
};

/**
 * Badge component
 *
 * A small visual indicator used for statuses, categories, or counts.
 *
 * ### Example Usage
 * ```tsx
 * <Badge>New</Badge>
 * <Badge type="secondary">Draft</Badge>
 * <Badge type="outline">99+</Badge>
 * <Badge type="brandLight">Premium</Badge>
 * ```
 */
export function Badge({
  type = "default",
  children,
  style,
  textStyles,
}: BadgeProps) {
  const bgColor = buttonBackgroundColors[type];
  const txtColor = buttonTextColors[type];
  const borderColor = buttonBorderColors[type];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: type === "outline" ? 1 : 0,
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: txtColor }, textStyles]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    borderCurve: "continuous",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: SIZES.fontSize.default,
  },
});
