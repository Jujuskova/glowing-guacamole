import { useState, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { Item } from "../types";
import { CONFIG_GRID } from "../constants";
import { getCellSize } from "../helpers";
import { useResizeWindow } from "../hooks/useResizeWindow";

function DraggableGrid() {
  const [items, setItems] = useState<Item[]>([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 6, col: 1, width: 10, height: 4, isLocked: true },
  ]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { windowHeight, windowWidth } = useResizeWindow();

  const isSmallScreens = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("xs", "md")
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("xl"));

  const cellSize = useMemo(
    () => getCellSize(isSmallScreens, isDesktop),
    [isSmallScreens, isDesktop]
  );

  const handleDocumentMouseDown = (e) => {
    const selectedItemElement = document.querySelector(".item.selected");
// todo: and focused item not a button
    if (
      selectedItemElement &&
      !selectedItemElement.contains(e.target) &&
      !e.target.classList.contains("item")
    ) {
      // Clicked outside the selected item, unselect it
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    // Attach the mousedown event listener to the document
    document.addEventListener("mousedown", handleDocumentMouseDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

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

    setItems(updatedItems);
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

    setItems(updatedItems);
  };

  const findFirstAvailablePosition = (
    items,
    customWidth = 1,
    customHeight = 1
  ) => {
    for (let row = 1; row <= CONFIG_GRID.ROWS - 1; row++) {
      for (let col = 1; col <= CONFIG_GRID.COLUMNS - 1; col++) {
        const isOccupied = items.find(
          (item) =>
            col < item.col + item.width &&
            col + customWidth > item.col &&
            row < item.row + item.height &&
            row + customHeight > item.row
        );

        if (!isOccupied) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const handleAddItemClick = ({
    width = 1,
    height = 1,
  }:
    | {
        width: number;
        height: number;
      }
    | undefined) => {
    const firstAvailablePosition = findFirstAvailablePosition(
      items,
      width,
      height
    );

    if (!firstAvailablePosition) {
      console.error("NO more available spaces !");
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: `item${prev.length + 1}`,
        row: firstAvailablePosition.row,
        col: firstAvailablePosition.col,
        width,
        height,
      },
    ]);
  };

  const onRemoveItem = (itemId: Item["id"]) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setSelectedItem(null);
  };

  const onSelectItem = (selectedItem: Item) => {
    if (selectedItem.isLocked) return;
    setSelectedItem(selectedItem);
  };

  return (
    <>
      <div className="actions">
        <button onClick={() => handleAddItemClick({ width: 2, height: 2 })}>
          Add new item
        </button>
        {selectedItem && (
          <button onClick={() => onRemoveItem(selectedItem.id)}>
            {`remove ${selectedItem.id}`}
          </button>
        )}
      </div>
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
              className={`item ${
                selectedItem?.id === item.id ? "selected" : ""
              }`}
            >
              <p>
                <span>{item.id}</span>
                {item.isLocked && <span> LOCKED !!</span>}
              </p>
            </div>
          </Rnd>
        ))}
      </div>
    </>
  );
}

export default DraggableGrid;
