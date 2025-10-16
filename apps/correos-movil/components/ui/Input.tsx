import { View, TextInput, StyleSheet, type TextInputProps } from "react-native";
import { COLORS } from "../../utils/theme";

/**
 * Props for the `Input` component.
 */
type InputProps = TextInputProps & {
  /**
   * Optional icon to display inside the input.
   * Can be any React node, for example an icon from `lucide-react-native`.
   *
   * Example:
   * ```tsx
   * import { SearchIcon } from "lucide-react-native";
   * <Input icon={<SearchIcon size={22} color="#374151" />} />
   * ```
   */
  icon?: React.ReactNode;

  /**
   * Position of the icon inside the input.
   * - `"left"`: icon appears on the left side (default)
   * - `"right"`: icon appears on the right side
   *
   * Example:
   * ```tsx
   * <Input
   *   icon={<SearchIcon size={22} color="#374151" />}
   *   iconPosition="right"
   * />
   * ```
   * @default "left"
   */
  iconPosition?: "left" | "right";
};

/**
 * Input component
 *
 * A customizable text input that supports an optional icon on either side.
 * All props from the native `TextInput` component are supported, so you can
 * use things like `value`, `onChangeText`, `keyboardType`, etc.
 *
 * You can also override styles using the `style` prop.
 *
 * ### Example Usage
 * ```tsx
 * import { Input } from "./Input";
 * import { SearchIcon } from "lucide-react-native";
 *
 * export function Example() {
 *   return (
 *     <Input
 *       placeholder="Search..."
 *       icon={<SearchIcon size={22} color="#374151" />}
 *       iconPosition="right"
 *       value={searchText}
 *       onChangeText={setSearchText}
 *       style={{ backgroundColor: "#FFF0F0", borderColor: "#FF0000" }}
 *     />
 *   );
 * }
 * ```
 */
export function Input({
  style,
  icon,
  placeholderTextColor,
  iconPosition = "left",
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {icon && iconPosition === "left" && (
        <View style={styles.iconContainerLeft}>{icon}</View>
      )}
      <TextInput
        style={[
          styles.input,
          icon && iconPosition === "left"
            ? styles.inputWithLeftIcon
            : undefined,
          icon && iconPosition === "right"
            ? styles.inputWithRightIcon
            : undefined,
          style,
        ]}
        placeholderTextColor={placeholderTextColor || COLORS.foregroundMuted}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <View style={styles.iconContainerRight}>{icon}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  iconContainerLeft: {
    position: "absolute",
    left: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  iconContainerRight: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
    width: "100%",
    borderRadius: 8,
    borderCurve: "continuous",
    color: COLORS.foreground,
    paddingHorizontal: 15,
  },
  inputWithLeftIcon: {
    paddingLeft: 45,
  },
  inputWithRightIcon: {
    paddingRight: 45,
  },
});
