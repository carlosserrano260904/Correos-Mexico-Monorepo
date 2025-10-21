import React from "react";
import {
  View,
  Text,
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
  children: React.ReactNode;
  type?: "default" | "secondary" | "borderless";
  style?: StyleProp<ViewStyle>;
};

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

export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.content, style]}>{children}</View>;
}

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
