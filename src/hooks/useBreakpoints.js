import useMediaQuery from "./useMediaQuery";
import { useTheme } from "@mui/material/styles";
/**
 * Get a set of boolean representing which breakpoint is active
 * and which breakpoints are inactive.
 *
 * Inspired by: https://github.com/contra/react-responsive/issues/162#issuecomment-592082035
 */
export default function useBreakpoints() {
  const theme = useTheme();
  //   // console.log(theme);
  const breakpoints = {
    isXs: useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`),
    isSm: useMediaQuery(
      `(min-width: ${theme.breakpoints.values.sm + 1}px) and (max-width: ${
        theme.breakpoints.values.phone
      }px)`
    ),
    isPhone: useMediaQuery(
      `(min-width: ${theme.breakpoints.values.phone + 1}px) and (max-width: ${
        theme.breakpoints.values.md
      }px)`
    ),
    isMd: useMediaQuery(
      `(min-width: ${theme.breakpoints.values.md + 1}px) and (max-width: ${
        theme.breakpoints.values.lg
      }px)`
    ),
    isLg: useMediaQuery(
      `(min-width: ${theme.breakpoints.values.lg + 1}px) and (max-width: ${
        theme.breakpoints.values.xl
      }px)`
    ),
    isXl: useMediaQuery(`(min-width: ${theme.breakpoints.values.xl + 1}px)`),
    active: "xs",
  };
  if (breakpoints.isXs) breakpoints.active = "xs";
  if (breakpoints.isSm) breakpoints.active = "sm";
  if (breakpoints.isPhone) breakpoints.active = "phone";
  if (breakpoints.isMd) breakpoints.active = "md";
  if (breakpoints.isLg) breakpoints.active = "lg";
  if (breakpoints.isXl) breakpoints.active = "xl";
  return breakpoints;
}
