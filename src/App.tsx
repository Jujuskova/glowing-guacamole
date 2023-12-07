import { useState } from "react";
import { Rnd } from "react-rnd";
import "./index.css";

const CONFIG_GRID = {
  COLUMNS: 10,
  ROWS: 14,
  CELL_SIZE: 50,
};

const DraggableGrid = () => {
  const [items, setItems] = useState([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 6, col: 1, width: 10, height: 4, isLocked: true },
  ]);

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

  return (
    <>
      <button onClick={() => handleAddItemClick({ width: 2, height: 2 })}>
        Add Item
      </button>
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
          >
            <div className={`item ${item.isLocked ? "locked" : ""}`}>
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
