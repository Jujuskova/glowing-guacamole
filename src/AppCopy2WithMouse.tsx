import { useState } from "react";
import { Resizable } from "react-resizable";
import "./App.css";

const CONFIG_GRID = {
  COLUMNS: 10,
  ROWS: 15,
};

const cellWidth = 55;
const cellHeight = 55;

const DraggableGrid = () => {
  const [items, setItems] = useState([
    { id: "item1", row: 1, col: 8, width: 1, height: 1 },
    { id: "item2", row: 3, col: 4, width: 2, height: 1 },
    { id: "item3", row: 8, col: 1, width: 4, height: 2, isLocked: true },
  ]);

  const handleMouseDown = (e, id) => {
    const initialX = e.clientX;
    const initialY = e.clientY;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;

      const draggedItem = items.find((item) => item.id === id);

      if (draggedItem) {
        const newCol = Math.max(
          1,
          Math.min(
            CONFIG_GRID.COLUMNS - draggedItem.width + 1,
            draggedItem.col + Math.round(deltaX / cellWidth)
          )
        );

        const newRow = Math.max(
          1,
          Math.min(
            CONFIG_GRID.ROWS - draggedItem.height + 1,
            draggedItem.row + Math.round(deltaY / cellHeight)
          )
        );

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, col: newCol, row: newRow } : item
          )
        );
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResize = (e, { size }, id) => {
    const newWidth = Math.round(size.width / cellWidth);
    const newHeight = Math.round(size.height / cellHeight);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, width: newWidth, height: newHeight } : item
      )
    );
  };

  return (
    <div className="grid">
      {items.map((item) => (
        <Resizable
          key={item.id}
          width={item.width * cellWidth}
          height={item.height * cellHeight}
          onResize={(e, data) => handleResize(e, data, item.id)}
        >
          <div
            className="item"
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            style={{
              gridRowStart: item.row,
              gridRowEnd: item.row + item.height,
              gridColumnStart: item.col,
              gridColumnEnd: item.col + item.width,
              cursor: item.isLocked ? "default" : "grab",
              position: "relative",
            }}
          >
            <div className="resize-handle right"></div>
            <div className="resize-handle bottom"></div>
            <p>
              <span>{item.id}</span>
              {item.isLocked && <span> LOCKED !!</span>}
            </p>
          </div>
        </Resizable>
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

// CSS

// p {
//   margin: 0;
// }

// .App {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// }

// .grid {
//   display: grid;
//   grid-template-columns: repeat(10, 55px);
//   grid-template-rows: repeat(15, 55px);
//   border: 2px solid #3498db;
//   padding: 10px;
// }

// .item {
//   background-color: teal;
//   color: white;
//   padding: 8px;
//   box-sizing: border-box;
//   border-radius: 4px;
//   position: relative;
//   overflow: auto;
// }

// .resize-handle {
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background-color: #4285f4;
//   bottom: 0;
//   right: 0;
//   cursor: nwse-resize;
// }
