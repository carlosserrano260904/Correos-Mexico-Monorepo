import { DimensionValue, View } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../utils/theme";
import { Image } from "react-native";
import { Text, ThemedTextProps } from "./Text";
import { Pressable, PressableProps, ImageProps } from "react-native";
import { ViewProps } from "react-native";

type ProductImage = PressableProps & {
  /**
   * Image source URL.
   *
   * Example:
   * ```tsx
   * <ProductImage src="https://example.com/image.png" />
   * ```
   */
  src: string;

  /**
   * Width of the image.
   * Accepts any valid `DimensionValue` (number or string).
   * @default 100%
   *
   * Example:
   * ```tsx
   * <ProductImage src="..." width={120} />
   * ```
   */
  width?: DimensionValue;

  /**
   * Height of the image.
   * Accepts any valid `DimensionValue` (number or string).
   * @default 100%"
   *
   * Example:
   * ```tsx
   * <ProductImage src="..." height={120} />
   * ```
   */
  height?: DimensionValue;

  /**
   * Optional additional props for the underlying `Image` component.
   * Useful for customizing behavior or styles.
   */
  imageProps?: ImageProps;
};

/**
 * `ProductImage` component
 *
 * Displays a product image inside a pressable container.
 * It automatically centers the image, respects aspect ratio,
 * and allows optional press interactions (e.g. open product details).
 *
 * ```tsx
 * <ProductImage
 *   width={120}
 *   height={120}
 *   src="https://example.com/product.jpg"
 *   onPress={() => console.log("Image pressed")}
 * />
 * ```
 */
export function ProductImage({
  src,
  width = "100%",
  height = "100%",
  imageProps,
  ...props
}: ProductImage) {
  return (
    <Pressable style={styles.productImageContainer} {...props}>
      <Image
        source={{ uri: src }}
        style={[styles.productImage, { width, height }, imageProps?.style]}
        {...imageProps}
      />
    </Pressable>
  );
}

/**
 * `Product` container
 *
 * Acts as a flexible wrapper for product-related components
 * (e.g. image, title, price, floating button).
 *
 * ```tsx
 * <Product>
 *   <ProductImage src="..." />
 *   <ProductDetails>
 *     <ProductTitle>Product Name</ProductTitle>
 *     <ProductPrice>$199</ProductPrice>
 *   </ProductDetails>
 * </Product>
 * ```
 */
export function Product({ style, ...props }: ViewProps) {
  return <View style={[styles.productContainer, style]} {...props}></View>;
}

/**
 * `ProductDetails` component
 *
 * A simple vertical stack wrapper for product text details like
 * title and price. It adds spacing and margins automatically.
 *
 * ```tsx
 * <ProductDetails>
 *   <ProductTitle>Example Product</ProductTitle>
 *   <ProductPrice>$120</ProductPrice>
 * </ProductDetails>
 * ```
 */
export function ProductDetails({ style, ...props }: ViewProps) {
  return <View style={[styles.productDetails, style]} {...props}></View>;
}

/**
 * `ProductTitle` component
 *
 * A styled text element for product titles.
 * Accepts all `ThemedTextProps`.
 *
 * ```tsx
 * <ProductTitle>iPhone 15 Pro Max</ProductTitle>
 * ```
 */
export function ProductTitle({ size = "small", ...props }: ThemedTextProps) {
  return <Text size={size} {...props} />;
}

/**
 * `ProductPrice` component
 *
 * A styled text element for displaying product prices.
 * Accepts all `ThemedTextProps`.
 *
 * ```tsx
 * <ProductPrice>$29,900</ProductPrice>
 * <ProductPrice color="muted" size="small" style={{ textDecorationLine: "line-through" }}>
 *   $39,900
 * </ProductPrice>
 * ```
 */
export function ProductPrice({
  color = "title",
  fontWeight = "500",
  ...props
}: ThemedTextProps) {
  return <Text color={color} fontWeight={fontWeight} {...props} />;
}

/**
 * `FloatingButton` component
 *
 * A circular pressable button typically placed on the top-right corner of a product card.
 * Useful for favorite, cart, or quick actions.
 *
 * ```tsx
 * <FloatingButton onPress={() => console.log("clicked")}>
 *   <HeartIcon size={20} />
 * </FloatingButton>
 * ```
 */
export function FloatingButton({ style, ...props }: PressableProps) {
  return (
    <Pressable
      style={(state) => [
        styles.floatingButton,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
  productImageContainer: {
    backgroundColor: `${COLORS.border}70`,
    width: "100%",
    aspectRatio: 1,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    resizeMode: "contain",
  },
  productDetails: {
    marginTop: 8,
    marginHorizontal: 4,
    gap: 4,
  },
  floatingButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
