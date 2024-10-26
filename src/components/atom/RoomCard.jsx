import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const RoomCardWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  border: "1px solid rgba(0, 0, 0, 0.4)",
  borderRadius: "8px",
  cursor: "pointer",
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
  gap: "8px"
}));
const RoomTenantName = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const RoomRentAmount = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));
const RoomNumber = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "32px"
  }
}));

const RoomStatus = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px"
  }
}));

export const RoomCard = (props) => {
  const navigate = useNavigate();
  const handleRoomCardClick = () => {
    navigate(`/room/${props.id}`);
  };
  return (
    <RoomCardWrapper onClick={handleRoomCardClick}>
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
