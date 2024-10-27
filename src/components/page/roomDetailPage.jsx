import { styled } from "@mui/material";
import { RoomDetailCard } from "../atom/RoomDetailsCard";
import { PaymentList } from "../atom/PaymentList";
import { RoomPageLayout } from "../atom/RoomPageLayout";
import { TenantDetails } from "../atom/TenantDetails";

const RoomDetailPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "24px"
}));
export const RoomDetailPage = (props) => {
  return (
    <RoomPageLayout>
      <RoomDetailPageWrapper>
        <RoomDetailCard />
        {/* <TenantDetails /> */}
        <PaymentList />
      </RoomDetailPageWrapper>
    </RoomPageLayout>
  );
};
