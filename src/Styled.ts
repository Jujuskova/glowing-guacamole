import { Box, Typography as Typo, Stack, styled } from "@mui/material";

export const HeaderContainer = styled(Stack)`
  height: 64px;
  width: 100%;
  background: #000;
  color: ${({ theme }) => theme.palette.common.white};
  padding: 24px;
  box-sizing: border-box;
`;

export const HeaderTitle = styled(Typo)(({ theme }) => ({
  cursor: "default",
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: `${theme.typography.h2.fontSize}px`,
}));

export const Content = styled(Box)`
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
`;
