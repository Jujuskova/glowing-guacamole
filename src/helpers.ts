import { CONFIG_GRID } from "./constants";

export function getCellSize(isSmallScreens: boolean, isDesktop: boolean) {
  let result = isDesktop
    ? CONFIG_GRID.CELL_SIZE.BIG
    : CONFIG_GRID.CELL_SIZE.MEDIUM;

  if (isSmallScreens) result = CONFIG_GRID.CELL_SIZE.SMALL;

  return result;
}
