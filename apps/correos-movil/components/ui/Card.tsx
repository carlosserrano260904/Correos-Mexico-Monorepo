import React from "react";
import {
  View,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
  type ViewProps,
} from "react-native";
import { COLORS, SIZES } from "../../utils/theme";

const backgroundColors: Record<string, string> = {
  default: COLORS.white,
  secondary: COLORS.surface,
  borderless: COLORS.surface,
};
const borderColors: Record<string, string> = {
  default: COLORS.border,
  secondary: COLORS.border,
  borderless: "transparent",
};

type CardProps = ViewProps & {
  /**
   * Content to render inside the card.
   */
  children: React.ReactNode;

  /**
   * Variant of the card
   * - `"default"`: white background with border
   * - `"secondary"`: neutral surface background with border
   * - `"borderless"`: neutral surface background without border
   * @default "default"
   */
  type?: "default" | "secondary" | "borderless";
};

/**
 * Card component
 *
 * A flexible container used to group related content and actions.
 * It supports multiple visual variants and structured subcomponents
 * for headers, content areas, and footers.
 *
 * @example
 * ```tsx
 * import { Card, CardHeader, CardContent, CardFooter } from "./Card";
 * import { Text, View } from "react-native";
 *
 * export function Example() {
 *   return (
 *     <Card style={{ marginBottom: 24 }} type="borderless">
 *       <CardHeader>
 *         <Text color="title" size="large">Overview</Text>
 *         <Text size="small" color="muted">
 *           Summary of your current progress
 *         </Text>
 *       </CardHeader>
 *     </Card>
 *   );
 * }
 * ```
 */
export function Card({
  children,
  type = "default",
  style,
  ...props
}: CardProps) {
  const backgroundColor = backgroundColors[type];
  const borderColor = borderColors[type];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * CardHeader
 *
 * Used to display the header content inside a card, such as
 * a title and an optional subtitle.
 */
export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.header, style]}>{children}</View>;
}

/**
 * CardContent
 *
 * Container for the main content of the card, such as forms,
 * text, images, or other components.
 */
export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.content, style]}>{children}</View>;
}

/**
 * CardFooter
 *
 * Used for footer elements inside a card, like secondary text,
 * actions, or buttons.
 */
export function CardFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.borderRadius.default,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    alignItems: "flex-start",
  },
  content: {
    marginTop: 16,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
});
