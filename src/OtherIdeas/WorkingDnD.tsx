import { useState } from "react";
import "./App.css"; // Import your CSS file

const CONFIG_GRID = {
  COLUMNS: 10,
  ROWS: 15,
};

const DraggableGrid = () => {
  const [items, setItems] = useState([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 8, col: 1, width: 10, height: 4, isLocked: true },
  ]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    const gridRect = document.getElementById("grid")?.getBoundingClientRect();
    const mouseX = e.clientX - gridRect.left;
    const mouseY = e.clientY - gridRect.top;
    const draggedItem = items.find((item) => item.id === itemId);

    if (draggedItem) {
      // Calculate the new position based on the mouse position
      const newCol =
        Math.floor((mouseX / gridRect.width) * CONFIG_GRID.COLUMNS) + 1;
      const newRow =
        Math.floor((mouseY / gridRect.height) * CONFIG_GRID.ROWS) + 1;

      // Adjust the new position based on the dimensions of the dragged item
      const adjustedNewCol = Math.min(
        CONFIG_GRID.COLUMNS - draggedItem.width + 1,
        Math.max(1, newCol)
      );
      const adjustedNewRow = Math.min(
        CONFIG_GRID.ROWS - draggedItem.height + 1,
        Math.max(1, newRow)
      );

      // Check for collisions with other items
      const noCollisions = items.every(
        (item) =>
          item.id === itemId ||
          adjustedNewCol >= item.col + item.width ||
          adjustedNewCol + draggedItem.width <= item.col ||
          adjustedNewRow >= item.row + item.height ||
          adjustedNewRow + draggedItem.height <= item.row
      );

      // Update the item's position in the state if there are no collisions
      if (noCollisions) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, row: adjustedNewRow, col: adjustedNewCol }
              : item
          )
        );
      }
    }
  };

  // const handleResize = (_, itemId, direction) => {
  //   setItems((prevItems) =>
  //     prevItems.map((item) => {
  //       if (item.id === itemId) {
  //         const width = direction === "right" ? item.width + 1 : item.width;
  //         const height = direction === "bottom" ? item.height + 1 : item.height;

  //         // TODO: Constrain the position based on dimensions
  //         // const { constrainedRow, constrainedCol } = constrainPosition(
  //         //   item.row,
  //         //   item.col,
  //         //   width,
  //         //   height
  //         // );

  //         return {
  //           ...item,
  //           width,
  //           height,
  //         };
  //       }
  //       return item;
  //     })
  //   );
  // };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      id="grid"
      className="grid"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="item"
          draggable={!item.isLocked}
          onDragStart={
            item.isLocked ? undefined : (e) => handleDragStart(e, item.id)
          }
          style={{
            gridRowStart: item.row,
            gridRowEnd: item.row + item.height,
            gridColumnStart: item.col,
            gridColumnEnd: item.col + item.width,
            cursor: item.isLocked ? "default" : "grab",
          }}
        >
          <p>
            <span>{item.id}</span>
            {item.isLocked && <span> LOCKED !!</span>}
          </p>
          {/* <div
            className="resize-handle right"
            onMouseDown={(e) => handleResize(e, item.id, "right")}
          ></div>
          <div
            className="resize-handle bottom"
            onMouseDown={(e) => handleResize(e, item.id, "bottom")}
          ></div> */}
        </div>
      ))}
    </div>
  );
};

const WorkingDnD = () => {
  return (
    <div className="App">
      <DraggableGrid />
    </div>
  );
};

export default WorkingDnD;
