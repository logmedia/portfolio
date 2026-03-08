import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#e3fdf7",
    100: "#c5f7ec",
    200: "#9feedd",
    300: "#6fe3cc",
    400: "#3fd4b8",
    500: "#22b99d",
    600: "#15937d",
    700: "#0e6e5d",
    800: "#084a3f",
    900: "#03241f",
  },
};

const fonts = {
  heading: "'Space Grotesk', var(--font-geist-sans), system-ui, sans-serif",
  body: "'Space Grotesk', var(--font-geist-sans), system-ui, sans-serif",
};

const components = {
  Button: {
    baseStyle: {
      rounded: "full",
      fontWeight: "semibold",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.400" },
      },
      outline: {
        borderColor: "brand.300",
        color: "brand.200",
        _hover: { bg: "whiteAlpha.100" },
      },
      ghost: {
        color: "gray.300",
        _hover: { bg: "whiteAlpha.100" },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "2xl",
        bg: "whiteAlpha.500",
        backdropFilter: "blur(16px)",
        borderWidth: "1px",
        borderColor: "whiteAlpha.200",
        boxShadow: "xl",
      },
    },
  },
};

const theme = extendTheme({ config, colors, fonts, components });

export default theme;
