import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import type { Item } from "./types";

import "./index.css";

const CONFIG_GRID = {
  COLUMNS: 10,
  ROWS: 14,
  CELL_SIZE: 50,
};

const DraggableGrid = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 6, col: 1, width: 10, height: 4, isLocked: true },
  ]);
  const [currentItemSelected, setCurrentItemSelected] = useState<Item | null>(
    null
  );

  const handleDocumentMouseDown = (e) => {
    const selectedItemElement = document.querySelector(".item.selected");

    if (
      selectedItemElement &&
      !selectedItemElement.contains(e.target) &&
      !e.target.classList.contains("item")
    ) {
      // Clicked outside the selected item, unselect it
      setCurrentItemSelected(null);
    }
  };

  useEffect(() => {
    // Attach the mousedown event listener to the document
    document.addEventListener("mousedown", handleDocumentMouseDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []); // Removed currentItemSelected from the dependency array

  const handleResizeStop = (id, _event, _direction, ref, _delta, position) => {
    const col = Math.max(1, Math.round(position.x / CONFIG_GRID.CELL_SIZE) + 1);
    const row = Math.max(1, Math.round(position.y / CONFIG_GRID.CELL_SIZE) + 1);
    const width = Math.max(
      1,
      Math.round(ref.offsetWidth / CONFIG_GRID.CELL_SIZE)
    );
    const height = Math.max(
      1,
      Math.round(ref.offsetHeight / CONFIG_GRID.CELL_SIZE)
    );

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
    const col = Math.max(1, Math.round(delta.x / CONFIG_GRID.CELL_SIZE) + 1);
    const row = Math.max(1, Math.round(delta.y / CONFIG_GRID.CELL_SIZE) + 1);

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
    setCurrentItemSelected(null);
  };

  const onSelectItem = (selectedItem: Item) => {
    if (selectedItem.isLocked) return;
    setCurrentItemSelected(selectedItem);
  };

  return (
    <>
      <div className="actions">
        <button onClick={() => handleAddItemClick({ width: 2, height: 2 })}>
          Add new item
        </button>
        {currentItemSelected && (
          <button onClick={() => onRemoveItem(currentItemSelected.id)}>
            {`remove ${currentItemSelected.id}`}
          </button>
        )}
      </div>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CONFIG_GRID.COLUMNS}, ${CONFIG_GRID.CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${CONFIG_GRID.ROWS}, ${CONFIG_GRID.CELL_SIZE}px)`,
        }}
      >
        {items.map((item) => (
          <Rnd
            key={item.id}
            size={{
              width: item.width * CONFIG_GRID.CELL_SIZE,
              height: item.height * CONFIG_GRID.CELL_SIZE,
            }}
            position={{
              x: (item.col - 1) * CONFIG_GRID.CELL_SIZE,
              y: (item.row - 1) * CONFIG_GRID.CELL_SIZE,
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
                currentItemSelected?.id === item.id ? "selected" : ""
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
};

const App = () => {
  return (
    <div className="App">
      <DraggableGrid />
    </div>
  );
};

export default App;
