import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  // useShopDetailsQuery,
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
import { useShopPaymentsQuery } from "../../hooks/query/useShopPayments";
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

const ShopDetailCardWrapper = styled(Grid2)(({ theme }) => ({
  padding: "16px 0px",
  borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)"
}));
const ShopDetailCardLeftCol = styled("div")(({ theme }) => ({
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
const ShopName = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#000000"
}));
// const ShopConsumerNo = styled("div")(({ theme }) => ({
//   fontSize: "16px",
//   fontWeight: 500,
//   color: "#000000"
// }));
const ShopOwnerName = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const ShopAddress = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const RoomCount = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const ShopRentAmount = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const ShopStatus = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const ShopDetailCardRightCol = styled("div")(({ theme }) => ({
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
export const ShopDetailCard = (props) => {
  const { shopId } = useParams();
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
  const shopDeatilsQuery = useShopDetailsQuery(shopId);
  const paymentListQuery = useShopPaymentsQuery(shopId);
  const updateShopMutation = useUpdateShopMutation();

  const handleUpdateShopSuccess = () => {
    shopDeatilsQuery.refetch();
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
      onSuccess: handleUpdateShopSuccess
    });
  };
  useEffect(() => {
    if (shopDeatilsQuery.data) {
      setShopField((prev) => ({
        ...prev,
        id: shopDeatilsQuery.data.id,
        ShopName: shopDeatilsQuery.data.shopName,
        ownerName: shopDeatilsQuery.data.ownerName,
        roomNo: shopDeatilsQuery.data.roomNo,
        shopRent: shopDeatilsQuery.data.roomRent,
        ownerAddress: shopDeatilsQuery.data.ownerAddress,
        startingBalance: shopDeatilsQuery.data.startingBalance,
        startDate: dayjs(
          formatTimestampToDate(shopDeatilsQuery.data.startDate),
          "DD-MM-YYYY"
        )
      }));
    }
  }, [shopDeatilsQuery.data]);

  if (shopDeatilsQuery.isLoading) {
    return <div>Loading..</div>;
  }
  if (shopDeatilsQuery.isError) {
    return <div>Error {JSON.stringify(shopDeatilsQuery.error)}</div>;
  }
  return (
    <ShopDetailCardWrapper container>
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
                  shopDeatilsQuery.data.startDate,
                  shopDeatilsQuery.data.roomRent,
                  shopDeatilsQuery.data.currentBalance,
                  shopDeatilsQuery.data.taxRate,
                  shopDeatilsQuery.data.taxBalance,
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
            <ShopName>{shopDeatilsQuery.data.shopName}</ShopName>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Room count"}>
            <RoomCount>{shopDeatilsQuery.data.roomNo}</RoomCount>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Rent"}>
            <ShopRentAmount>{shopDeatilsQuery.data.roomRent}</ShopRentAmount>      {/*{ //in firebase roomRent.I want to change to shopRent. for changing here}*/} 
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Owner name"}>
            <ShopOwnerName>{shopDeatilsQuery.data.ownerName}</ShopOwnerName>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Owner address"}>
            <ShopAddress>
              {shopDeatilsQuery.data.ownerAddress}
            </ShopAddress>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Credit Amount"}>
            <ShopAddress>
              {shopDeatilsQuery.data.credit}
            </ShopAddress>
          </LabeledField>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <LabeledField label={"Tax Rate"}>
            <ShopAddress>
              {shopDeatilsQuery.data.taxRate}
            </ShopAddress>
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
              name="ShopName"
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
              label="Shop Rent"
              variant="outlined"
              name="shopRent"
              placeholder="Enter Shop Rent"
              fullWidth
              value={shopField.roomRent}  //in firebase roomRent.I want to change to shopRent. for changing here
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
    </ShopDetailCardWrapper>
  );
};
