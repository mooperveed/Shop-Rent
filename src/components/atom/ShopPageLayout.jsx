import styled from "@emotion/styled";

const PageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  width: "100%",
  height: "100vh",
  overflowX: "hidden",
  background: "#FAF9F6",
  paddingBottom: "0px",
  [theme.breakpoints.up("md")]: {
    padding: "24px"
  }
}));
export const ShopPageLayout = (props) => {
  return <PageWrapper>{props.children}</PageWrapper>;
};
