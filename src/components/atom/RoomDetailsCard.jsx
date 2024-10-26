import { useParams } from "react-router-dom";
import { useRoomDetailsQuery } from "../../hooks/query/useRoomDetails";
import styled from "@emotion/styled";

const RoomDetailCardWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 0px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
}));
const RoomDetailCardLeftCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const RoomNumber = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomTenantName = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomRentAmount = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomStatus = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomDetailCardRightCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));

export const RoomDetailCard = (props) => {
  const { roomId } = useParams();
  const roomDeatilsQuery = useRoomDetailsQuery(roomId);
  if (roomDeatilsQuery.isLoading) {
    return <div>Loading..</div>;
  }
  if (roomDeatilsQuery.isError) {
    return <div>Error {JSON.stringify(roomDeatilsQuery.error)}</div>;
  }
  return (
    <RoomDetailCardWrapper>
      <RoomDetailCardLeftCol>
        <RoomTenantName>{roomDeatilsQuery.data.tenant.name}</RoomTenantName>
        <RoomRentAmount>{roomDeatilsQuery.data.tenant.roomRent}</RoomRentAmount>
      </RoomDetailCardLeftCol>
      <RoomDetailCardRightCol>
        <RoomStatus>{"Paid"}</RoomStatus>
        <RoomNumber>{roomDeatilsQuery.data.roomNo}</RoomNumber>
      </RoomDetailCardRightCol>
    </RoomDetailCardWrapper>
  );
};
