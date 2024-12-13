import styled from "@emotion/styled";
import { Chip, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ShopCardWrapper = styled(Grid2)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  border: "1px solid #EAEAEA",
  borderRadius: "8px",
  cursor: "pointer",
  gap: "12px",
  [theme.breakpoints.up("md")]: {
    padding: "16px"
  }
}));
const RightColWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const LeftColWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  maxWidth: "70%"
}));
const ShopTenantName = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 500,
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const ShopName = styled("div")(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 400,
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const ShopNumber = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    fontSize: "32px"
  }
}));

const ShopStatus = styled(Chip)(({ theme }) => ({}));

export const ShopCard = (props) => {
  const navigate = useNavigate();
  const handleShopCardClick = () => {
    navigate(`/shop/${props.id}`);
  };
  return (
    <ShopCardWrapper size={{ xs: 12, md: 4 }} onClick={handleShopCardClick}>
      <LeftColWrapper>
        <ShopTenantName>{props.name}</ShopTenantName>
        <ShopName>{props.address}</ShopName>
      </LeftColWrapper>
      <RightColWrapper>
        <ShopStatus size="small" {...props.status} />
        <ShopNumber>{props.number}</ShopNumber>
      </RightColWrapper>
    </ShopCardWrapper>
  );
};
