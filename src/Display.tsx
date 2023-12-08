import { Stack } from "@mui/material";
import DraggableGrid from "./components/DraggableGrid";
import Drawer from "./components/Drawer";

import { Content } from "./Styled";
// import { Item } from "./types";

function Display() {
  // const [items, setItems] = useState<Item[]>([
  //   { id: "item1", row: 1, col: 8, width: 1, height: 1 },
  //   { id: "item2", row: 3, col: 4, width: 2, height: 1 },
  //   { id: "item3", row: 6, col: 1, width: 10, height: 4, isLocked: true },
  // ]);
  // const [selectedItem, setFocusedItem] = useState<Item | null>(
  //   null
  // );

  return (
    <Content>
      <Drawer />
      <Stack
        direction="row"
        gap={2}
        justifyContent="center"
        alignItems="center"
        sx={{ width: "calc(100% - 300px)", marginLeft: "300px", height: "100%" }}
      >
        <DraggableGrid />
      </Stack>
    </Content>
  );
}

export default Display;
