import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "./App.css";

const CONFIG_GRID = {
  COLUMNS: 10,
  ROWS: 15,
  CELL_SIZE: 55,
};

const DraggableGrid = () => {
  const [items, setItems] = useState([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 8, col: 1, width: 10, height: 4, isLocked: true },
  ]);

  const handleResizeStop = (id, event, direction, ref, delta, position) => {
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

  const handleDragStop = (id, event, delta) => {
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

  return (
    <div className="grid">
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

/*
p {
  margin: 0;
}

.App {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 55px);
  grid-template-rows: repeat(15, 55px);
  border: 2px solid #3498db;
}

.item {
  background-color: teal;
  color: white;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  overflow: auto;
  height: 100%;
}

**/
