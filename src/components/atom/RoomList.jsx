import styled from "@emotion/styled";
import { RoomCard } from "./RoomCard";
import CircularLoader from "./CircularLoader";
import { Grid2, Typography } from "@mui/material";

const RoomListWrapper = styled(Grid2)(({ theme }) => ({}));
export const RoomList = (props) => {
  if (props.isLoading) {
    return <CircularLoader />;
  }
  return (
    <RoomListWrapper container gap={2}>
      {props.rooms.length === 0 && (
        <Typography variant="subtitle1">No shops found</Typography>
      )}
      {props.rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </RoomListWrapper>
  );
};
