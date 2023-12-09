import { useState } from "react";
import { Stack } from "@mui/material";
import DraggableGrid from "./components/DraggableGrid";
import Drawer from "./components/Drawer";

import { Content } from "./Styled";
import { Item } from "./types";
import { CONFIG_GRID } from "./constants";

function Display() {
  const [items, setItems] = useState<Item[]>([
    { id: "item1", row: 1, col: 7, width: 4, height: 1 },
    { id: "item2", row: 3, col: 4, width: 3, height: 2 },
    { id: "item3", row: 6, col: 1, width: 10, height: 4, isLocked: true },
  ]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSelectedItem = (newItem: Item | null) => setSelectedItem(newItem);
  const handleItems = (updatedItems: Item[]) => setItems(updatedItems);

  const findFirstAvailablePosition = (
    items,
    customWidth = 1,
    customHeight = 1
  ) => {
    for (let row = 1; row <= CONFIG_GRID.ROWS - 1; row++) {
      for (let col = 1; col <= CONFIG_GRID.COLUMNS - 1; col++) {
        const isOccupied = items.find((item) => {
          return (
            (col < item.col + item.width &&
              col + customWidth > item.col &&
              row < item.row + item.height &&
              row + customHeight > item.row) ||
            row + customHeight - 1 > CONFIG_GRID.ROWS ||
            col + customWidth - 1 > CONFIG_GRID.COLUMNS
          );
        });

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
    const id = Math.round(Math.random() * (150 - 4 + 1) + 4);
    handleItems([
      ...items,
      {
        id: `item${id}`,
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

  return (
    <Content>
      <Drawer
        handleAddItemClick={handleAddItemClick}
        selectedItem={selectedItem}
        onRemoveItem={onRemoveItem}
      />
      <Stack
        direction="row"
        gap={2}
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "calc(100% - 300px)",
          marginLeft: "300px",
          height: "100%",
        }}
      >
        <DraggableGrid
          items={items}
          selectedItem={selectedItem}
          handleSelectedItem={handleSelectedItem}
          handleItems={handleItems}
        />
      </Stack>
    </Content>
  );
}

export default Display;
