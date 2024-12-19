import { styled } from "@mui/material";
import { ShopDetailCard } from "../atom/ShopDetailsCard";
import { PaymentList } from "../atom/PaymentList";
import { ShopPageLayout } from "../atom/ShopPageLayout";


const ShopDetailPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "24px"
}));
export const ShopDetailPage = (props) => {
  return (
    <ShopPageLayout>
      <ShopDetailPageWrapper>
        <ShopDetailCard />
        <PaymentList />
      </ShopDetailPageWrapper>
    </ShopPageLayout>
  );
};
