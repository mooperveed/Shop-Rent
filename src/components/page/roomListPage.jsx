import { styled } from "@mui/system";
import React, { useMemo } from "react";
import { useRoomListQuery } from "../../hooks/query/useRoomList";
import { RoomList } from "../atom/RoomList";

const RoomPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "24px"
}));
export default function RoomListPage(props) {
  const roomListQuery = useRoomListQuery();
  const rooms = useMemo(() => {
    if (!roomListQuery.data) return [];

    return roomListQuery.data.map((room) => ({
      id: room.id,
      name: room.tenant.name,
      number: room.roomNo,
      price: room.roomRent,
      status: "Fully-Paid"
    }));
  }, [roomListQuery.data]);
  return (
    <RoomPageWrapper>
      <RoomList rooms={rooms} />
    </RoomPageWrapper>
  );
}
