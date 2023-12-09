import { useCallback, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { Item } from "../types";
import { CONFIG_GRID } from "../constants";
import { getCellSize, isActiveElementAnInput } from "../helpers";
import { useResizeWindow } from "../hooks/useResizeWindow";

type Props = {
  items: Item[];
  selectedItem: Item | null;
  handleSelectedItem(newItem: Item | null): void;
  handleItems(updatedItems: Item[]): void;
};

function DraggableGrid({
  items,
  selectedItem,
  handleSelectedItem,
  handleItems,
}: Props) {
  const { windowHeight, windowWidth } = useResizeWindow();

  const isSmallScreens = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("xs", "md")
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("xl"));

  const cellSize = useMemo(
    () => getCellSize(isSmallScreens, isDesktop),
    [isSmallScreens, isDesktop]
  );

  const handleDocumentMouseDown = useCallback((e) => {
    const selectedItemElement = document.querySelector(".item.selected");

    const isAnInput = isActiveElementAnInput(e.target.tagName);
    if (
      selectedItemElement &&
      !selectedItemElement.contains(e.target) &&
      !e.target.classList.contains("item") &&
      !isAnInput
    ) {
      // Clicked outside the selected item, unselect it
      handleSelectedItem(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Attach the mousedown event listener to the document
    document.addEventListener("mousedown", handleDocumentMouseDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [handleDocumentMouseDown]);

  const handleResizeStop = (id, _event, _direction, ref, _delta, position) => {
    const col = Math.max(1, Math.round(position.x / cellSize) + 1);
    const row = Math.max(1, Math.round(position.y / cellSize) + 1);
    const width = Math.max(1, Math.round(ref.offsetWidth / cellSize));
    const height = Math.max(1, Math.round(ref.offsetHeight / cellSize));

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        // Check for collisions with other items
        const noCollisions = items.every(
          (otherItem) =>
            item.id === otherItem.id ||
            col >= otherItem.col + otherItem.width ||
            col + width <= otherItem.col ||
            row >= otherItem.row + otherItem.height ||
            row + height <= otherItem.row
        );

        if (noCollisions) {
          return { ...item, col, row, width, height };
        }
      }
      return item;
    });

    handleItems(updatedItems);
  };

  const handleDragStop = (id, _event, delta) => {
    const col = Math.max(1, Math.round(delta.x / cellSize) + 1);
    const row = Math.max(1, Math.round(delta.y / cellSize) + 1);

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        // Check for collisions with other items
        const noCollisions = items.every(
          (otherItem) =>
            item.id === otherItem.id ||
            col >= otherItem.col + otherItem.width ||
            col + item.width <= otherItem.col ||
            row >= otherItem.row + otherItem.height ||
            row + item.height <= otherItem.row
        );

        if (noCollisions) {
          return { ...item, col, row };
        }
      }
      return item;
    });

    handleItems(updatedItems);
  };

  const onSelectItem = (selectedItem: Item) => {
    if (selectedItem.isLocked) return;
    handleSelectedItem(selectedItem);
  };

  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${CONFIG_GRID.COLUMNS}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${CONFIG_GRID.ROWS}, ${cellSize}px)`,
      }}
    >
      {items.map((item) => (
        // hack to re-render the item on resize of the window because its position is absolute
        <Rnd
          key={`${item.id}-${windowWidth}-${windowHeight}-${cellSize}`}
          size={{
            width: item.width * cellSize,
            height: item.height * cellSize,
          }}
          position={{
            x: (item.col - 1) * cellSize,
            y: (item.row - 1) * cellSize,
          }}
          onResizeStop={(e, direction, ref, delta, position) =>
            handleResizeStop(item.id, e, direction, ref, delta, position)
          }
          onDragStop={(e, d) => handleDragStop(item.id, e, d)}
          disableDragging={item.isLocked}
          enableResizing={!item.isLocked}
          bounds=".grid"
          onClick={() => onSelectItem(item)}
        >
          <div
            className={`item ${selectedItem?.id === item.id ? "selected" : ""}`}
          >
            <p>
              <span>{item.id}</span>
              {item.isLocked && <span> LOCKED !!</span>}
            </p>
          </div>
        </Rnd>
      ))}
    </div>
  );
}

export default DraggableGrid;
