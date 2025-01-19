import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {LayoutsShopDetailCard} from "./LayoutsShopDetailCard";

import {
  useShopDetailsQuery
} from "../../hooks/query/useShopDetails";
import styled from "@emotion/styled";
import {
  Grid2
} from "@mui/material";
import { useShopPaymentsQuery } from "../../hooks/query/useShopPayments";
import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { useUpdateShopMutation } from "../../hooks/mutation/useUpdateShop";

import dayjs from "dayjs";


const ShopDetailCardWrapper = styled(Grid2)(({ theme }) => ({
  padding: "16px 0px",
  borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)"
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


const LabeledField = (props) => {
  return (
    <LabeledFieldWrapper>
      <FieldLabel>{props.label}</FieldLabel>
      {props.children}
    </LabeledFieldWrapper>
  );
};
export const ShopDetailCard = () => {
  const { shopId } = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenTax, setIsOpenTax] = React.useState(false);
  const [isOpenRoom, setIsOpenRoom] = React.useState(false);
  const [shopField, setShopField] = useState({
    id: "",
    shopName: "",
    ownerName: "",
    roomNo: 0,
    shopRent: 0,
    ownerAddress: "",
    startingBalance: 0,
    startDate: dayjs(new Date())
  });
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const toggleOpenTax = () => setIsOpenTax((prev) => !prev);
  const toggleOpenRoom = () => setIsOpenRoom((prev) => !prev);
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
  const toggleUpdateModalTax = () => {
    setIsOpenTax((prev) => !prev);
  };
  const toggleUpdateModalRoom = () => {       
    setIsOpenRoom((prev) => !prev);
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
        shopRent: shopDeatilsQuery.data.shopRent,
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
    <LayoutsShopDetailCard
      // Modal States
      isOpen={isOpen}
      isOpenTax={isOpenTax}
      isOpenRoom={isOpenRoom}
      toggleOpen={toggleOpen}
      toggleOpenTax={toggleOpenTax}
      toggleOpenRoom={toggleOpenRoom}
      toggleUpdateModal={toggleUpdateModal}
      toggleUpdateModalTax={toggleUpdateModalTax}
      toggleUpdateModalRoom={toggleUpdateModalRoom}
  
      // Handlers
      handleUpdateShop={handleUpdateShop}
      handleInputChange={handleInputChange}
  
      // Shop Data
      shopField={shopField}
      shopDeatilsQuery={shopDeatilsQuery}
      shopId={shopId}
  
      // UI Components
      ShopDetailCardWrapper={ShopDetailCardWrapper}
      LabeledField={LabeledField}
      ShopName={ShopName}
      RoomCount={RoomCount}
      ShopRentAmount={ShopRentAmount}
      ShopStatus={ShopStatus}
      ShopOwnerName={ShopOwnerName}
      ShopAddress={ShopAddress}
    />
  );
  
};
