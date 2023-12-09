import { CONFIG_GRID } from "./constants";

function getCellSize(isSmallScreens: boolean, isDesktop: boolean) {
  let result = isDesktop
    ? CONFIG_GRID.CELL_SIZE.BIG
    : CONFIG_GRID.CELL_SIZE.MEDIUM;

  if (isSmallScreens) result = CONFIG_GRID.CELL_SIZE.SMALL;

  return result;
}

const inputsAndIcon = ["input", "select", "button", "textarea", "i"];

function isActiveElementAnInput(tagName?: Element["tagName"]): boolean {
  const activeElementType = tagName || document.activeElement?.tagName;
  console.log("%c activeElementType", "color: pink", activeElementType);
  if (!activeElementType) return false;

  return inputsAndIcon.indexOf(activeElementType.toLowerCase()) !== -1;
}

export { isActiveElementAnInput, getCellSize };
