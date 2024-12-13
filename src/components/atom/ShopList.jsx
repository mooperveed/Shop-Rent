import styled from "@emotion/styled";
import { ShopCard } from "./ShopCard";
import CircularLoader from "./CircularLoader";
import { Grid2, Typography } from "@mui/material";

const ShopListWrapper = styled(Grid2)(({ theme }) => ({}));
export const ShopList = (props) => {
  if (props.isLoading) {
    return <CircularLoader />;
  }
  return (
    <ShopListWrapper container gap={2}>
      {props.shops.length === 0 && (
        <Typography variant="subtitle1">No shops found</Typography>
      )}
      {props.shops.map((shop) => (
        <ShopCard key={shop.id} {...shop} />
      ))}
    </ShopListWrapper>
  );
};
