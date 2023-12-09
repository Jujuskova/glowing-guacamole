import { Button, Drawer as MuiDrawer, Stack } from "@mui/material";
import { Item } from "../types";

function Drawer({
  handleAddItemClick,
  onRemoveItem,
  selectedItem,
}: {
  handleAddItemClick(length?: { width: number; height: number }): void;
  onRemoveItem(itemId: Item["id"]): void;
  selectedItem: Item | null;
}) {
  return (
    <MuiDrawer
      id="drawer-custom-template"
      variant="permanent"
      anchor="left"
      open
      PaperProps={{
        sx: {
          width: "300px",
          top: "64px",
          height: "calc(100% - 64px)",
          p: 2,
          boxSizing: "border-box",
        },
      }}
    >
      <Stack gap={2}>
        <Button
          variant="contained"
          onClick={() => handleAddItemClick({ width: 3, height: 2 })}
        >
          Add item
        </Button>
        {selectedItem && (
          <Button
            variant="contained"
            onClick={() => onRemoveItem(selectedItem.id)}
          >
            Remove item
          </Button>
        )}
      </Stack>
    </MuiDrawer>
  );
}

export default Drawer;
