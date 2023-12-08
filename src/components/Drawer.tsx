import { Button, Drawer as MuiDrawer } from "@mui/material";

function Drawer() {
  return (
    <MuiDrawer
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
      <Button variant="contained">Add item</Button>
    </MuiDrawer>
  );
}

export default Drawer;
