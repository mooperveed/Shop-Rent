import { styled } from "@mui/material";
import React from "react";

const RoomCardWrapper = styled("div")((theme) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(4),
  border: "1px solid rgba(0, 0, 0, 0.4)",
  borderRadius: "8px",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6)
  }
}));
const RightColWrapper = styled("div")((theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.gap(1)
}));
const LeftColWrapper = styled("div")((theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.gap(1)
}));
const RoomTenantName = styled("div")((theme) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const RoomRentAmount = styled("div")((theme) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const RoomNumber = styled("div")((theme) => ({
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "32px"
  }
}));

const RoomStatus = styled("div")((theme) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));

export const RoomCard = (props) => {
  return (
    <RoomCardWrapper>
      <LeftColWrapper>
        <RoomTenantName>{props.name}</RoomTenantName>
        <RoomRentAmount>{props.price}</RoomRentAmount>
      </LeftColWrapper>
      <RightColWrapper>
        <RoomStatus>{props.status}</RoomStatus>
        <RoomNumber>{props.number}</RoomNumber>
      </RightColWrapper>
    </RoomCardWrapper>
  );
};
const RoomListWrapper = styled("div")((theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.gap(2),
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.gap(4)
  }
}));
export const RoomList = (props) => {
  return (
    <RoomListWrapper>
      {props.map((room) => (
        <RoomCard {...room} />
      ))}
    </RoomListWrapper>
  );
};
const RoomPageWrapper = styled("div")((theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.gap(2)
}));
export default function RoomListPage(props) {
  return (
    <RoomPageWrapper>
      <RoomList {...props.rooms} />
    </RoomPageWrapper>
  );
}
