import { styled } from "@mui/material";
import { RoomDetailCard } from "../atom/RoomDetailsCard";
import { PaymentList } from "../atom/PaymentList";

const RoomDetailPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "24px"
}));
export const RoomDetailPage = (props) => {
  return (
    <RoomDetailPageWrapper>
      <RoomDetailCard />
      <PaymentList />
    </RoomDetailPageWrapper>
  );
};
