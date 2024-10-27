import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useRoomDetailsQuery,
  useShopDetailsQuery
} from "../../hooks/query/useShopDetails";
import styled from "@emotion/styled";
import {
  Button,
  Chip,
  Grid,
  Grid2,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { useTenantPaymentsQuery } from "../../hooks/query/useTenantPayments";
import EditIcon from "@mui/icons-material/Edit";
import { Label } from "@mui/icons-material";
import { Timestamp } from "@firebase/firestore";
import { ModalLayout } from "./ModalLayout";
import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { useUpdateShopMutation } from "../../hooks/mutation/useUpdateShop";
import {
  calculateRentStatus,
  getRentStatusColorAndText
} from "../../utils/calculateRentStatus";
import dayjs from "dayjs";

const RoomDetailCardWrapper = styled(Grid2)(({ theme }) => ({
  padding: "16px 0px",
  borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)"
}));
const RoomDetailCardLeftCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const LabeledFieldWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "4px"
}));
const FieldLabel = styled("div")(({ theme }) => ({
  fontSize: "12px"
}));
const RoomNumber = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomConsumerNo = styled("div")(({ theme }) => ({
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
  gap: "4px",
  [theme.breakpoints.up("md")]: {
    gap: "8px"
  }
}));

const LabeledField = (props) => {
  return (
    <LabeledFieldWrapper>
      <FieldLabel>{props.label}</FieldLabel>
      {props.children}
    </LabeledFieldWrapper>
  );
};
export const RoomDetailCard = (props) => {
  const { roomId } = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [shopField, setShopField] = useState({
    id: "",
    shopName: "",
    ownerName: "",
    roomNo: 0,
    roomRent: 0,
    ownerAddress: "",
    startingBalance: 0,
    startDate: dayjs(new Date())
  });
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const roomDeatilsQuery = useShopDetailsQuery(roomId);
  const paymentListQuery = useTenantPaymentsQuery(roomId);
  const updateShopMutation = useUpdateShopMutation();

  const handleUpdateTenantSuccess = () => {
    roomDeatilsQuery.refetch();
    paymentListQuery.refetch();
    toggleUpdateModal();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopField((prev) => ({ ...prev, [name]: value }));
  };
  const toggleUpdateModal = () => {
    setIsOpen((prev) => !prev);
  };
  const handleUpdateShop = () => {
    updateShopMutation.mutate(shopField, {
      onSuccess: handleUpdateTenantSuccess
    });
  };
  useEffect(() => {
    if (roomDeatilsQuery.data) {
      setShopField((prev) => ({
        ...prev,
        id: roomDeatilsQuery.data.id,
        shopName: roomDeatilsQuery.data.shopName,
        ownerName: roomDeatilsQuery.data.ownerName,
        roomNo: roomDeatilsQuery.data.roomNo,
        roomRent: roomDeatilsQuery.data.roomRent,
        ownerAddress: roomDeatilsQuery.data.ownerAddress,
        startingBalance: roomDeatilsQuery.data.startingBalance,
        startDate: dayjs(
          formatTimestampToDate(roomDeatilsQuery.data.startDate),
          "DD-MM-YYYY"
        )
      }));
    }
  }, [roomDeatilsQuery.data]);

  if (roomDeatilsQuery.isLoading) {
    return <div>Loading..</div>;
  }
  if (roomDeatilsQuery.isError) {
    return <div>Error {JSON.stringify(roomDeatilsQuery.error)}</div>;
  }
  return (
    <RoomDetailCardWrapper container>
      <Grid2
        size={{ xs: 12 }}
        container
        justifyContent={"space-between"}
        marginBottom={2}
      >
        <Grid2 size="auto">
          <Typography variant="h6">Shop Details</Typography>
        </Grid2>
        <Grid2
          size="auto"
          container
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid2 size="auto">
            <Chip
              {...getRentStatusColorAndText(
                calculateRentStatus(
                  roomDeatilsQuery.data.startDate,
                  roomDeatilsQuery.data.roomRent,
                  roomDeatilsQuery.data.startingBalance,
                  roomDeatilsQuery.data.currentBalance
                )
              )}
              size="small"
            />
          </Grid2>
          <Grid2>
            <IconButton size={"small"} variant="contained" onClick={toggleOpen}>
              <EditIcon />
            </IconButton>
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 container size={{ xs: 12 }} rowGap={2}>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Shop Name"}>
            <RoomNumber>{roomDeatilsQuery.data.shopName}</RoomNumber>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Room count"}>
            <RoomRentAmount>{roomDeatilsQuery.data.roomNo}</RoomRentAmount>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Rent"}>
            <RoomConsumerNo>{roomDeatilsQuery.data.roomRent}</RoomConsumerNo>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Owner name"}>
            <RoomConsumerNo>{roomDeatilsQuery.data.ownerName}</RoomConsumerNo>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Owner address"}>
            <RoomConsumerNo>
              {roomDeatilsQuery.data.ownerAddress}
            </RoomConsumerNo>
          </LabeledField>
        </Grid2>
      </Grid2>
      <ModalLayout
        isOpen={isOpen}
        onClose={toggleUpdateModal}
        onSubmit={handleUpdateShop}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              label="Shop Name"
              variant="outlined"
              name="shopName"
              placeholder="Enter Shop Name"
              fullWidth
              value={shopField.shopName}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              label="Owner Name"
              variant="outlined"
              name="ownerName"
              placeholder="Enter Owner Name"
              fullWidth
              value={shopField.ownerName}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              label="No Rooms"
              variant="outlined"
              name="roomNo"
              placeholder="Enter No of rooms"
              fullWidth
              value={shopField.roomNo}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              label="Room Rent"
              variant="outlined"
              name="roomRent"
              placeholder="Enter Room Rent"
              fullWidth
              value={shopField.roomRent}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              label="Owner address"
              variant="outlined"
              name="ownerAddress"
              multiline
              rows={3}
              placeholder="Enter Owner Address"
              fullWidth
              value={shopField.ownerAddress}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              label="current balance"
              variant="outlined"
              name="startingBalance"
              placeholder="Enter Current Balance"
              fullWidth
              value={shopField.startingBalance}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              label="Start Date"
              variant="outlined"
              name="startDate"
              placeholder="Enter Start Date"
              fullWidth
              disabled
              value={formatTimestampToDate(shopField.startDate)}
            />
          </Grid2>
        </Grid2>
      </ModalLayout>
    </RoomDetailCardWrapper>
  );
};
