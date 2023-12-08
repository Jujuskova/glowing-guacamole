import CloseIcon from "@mui/icons-material/Close";

import { HeaderContainer, HeaderTitle } from "../Styled";

function Header() {
  return (
    <HeaderContainer
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      <HeaderTitle>Custom template</HeaderTitle>
      <CloseIcon sx={(tm) => ({ fill: tm.palette.common.white })} />
    </HeaderContainer>
  );
}

export default Header;
