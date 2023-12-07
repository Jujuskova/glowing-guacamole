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
    { id: "item3", row: 8, col: 1, width: 4, height: 2, isLocked: true },
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

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: "item4", row: 1, col: 1, width: 1, height: 1 },
    ]);
  };

  return (
    <>
      <button onClick={addItem}>add item</button>
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
              {item.isLocked && (
                <p>
                  Fromage frais cheese triangles rubber cheese. When the cheese
                  comes out everybody's happy airedale feta airedale cheese
                  triangles cheese on toast bavarian bergkase melted cheese.
                  Roquefort cheese and wine cheese on toast stilton ricotta
                  fondue cheese strings cheese strings. Hard cheese emmental
                  chalk and cheese cheesy grin monterey jack gouda cheese
                  triangles cut the cheese. Dolcelatte danish fontina cheesy
                  feet stinking bishop cheese and wine cheese and biscuits gouda
                  cut the cheese. Cheese and wine bavarian bergkase say cheese
                  gouda cheddar parmesan.
                </p>
              )}
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
