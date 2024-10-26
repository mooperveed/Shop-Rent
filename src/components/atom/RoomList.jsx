import styled from "@emotion/styled";
import { RoomCard } from "./RoomCard";

const RoomListWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: "16px"
  }
}));
export const RoomList = (props) => {
  return (
    <RoomListWrapper>
      {props.rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </RoomListWrapper>
  );
};
