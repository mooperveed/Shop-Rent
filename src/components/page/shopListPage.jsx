import { styled } from "@mui/system";
import React, { useMemo, useState } from "react";
import { ShopList } from "../atom/ShopList";
import { Grid2, IconButton, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ShopPageLayout } from "../atom/ShopPageLayout";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { ModalLayout } from "../atom/ModalLayout";
// import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { Timestamp } from "@firebase/firestore";
import { useShopListQuery } from "../../hooks/query/useShopList";
import { useCreateShopMutation } from "../../hooks/mutation/useCreateShop";
import {
  calculateRentStatus,
  getRentStatusColorAndText
} from "../../utils/calculateRentStatus";

const ShopPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px"
}));

export default function ShopListPage(props) {
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shopListQuery = useShopListQuery();
  const [shopField, setShopField] = useState({
    shopName: "",
    ownerName: "",
    roomNo: 0,
    roomRent: 0,
    ownerAddress: "",
    startDate: dayjs(new Date())
  });
  const isLoading = shopListQuery.isLoading;
  const shops = useMemo(() => {
    if (!shopListQuery.data) return [];

    return shopListQuery.data
      .filter((shop) =>
        shop.shopName.toString().toLowerCase().includes(keyword.toLowerCase())
      )
      .map((shop) => ({
        id: shop.id,
        name: shop.shopName,
        number: shop.roomCount,
        price: shop.roomRent,
        address: shop.ownerAddress,
        status: getRentStatusColorAndText(
          calculateRentStatus(
            shop.startDate,
            shop.roomRent,
            
            shop.currentBalance,
            shop.taxRate,
            shop.taxBalance,
          )
        )
      })
    );
  }, [shopListQuery.data, keyword]);

  const toggleCreateShopModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCreateShopSuccess = () => {
    shopListQuery.refetch();
    toggleCreateShopModal();
  };

  const handleCreateShop = () => {
    createShopMutation.mutate(
      {
        ...shopField,
        startDate: Timestamp.fromDate(shopField.startDate.toDate())
      },
      {}
    );
  };

  const createShopMutation = useCreateShopMutation(handleCreateShopSuccess);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopField((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ShopPageLayout>
      <ShopPageWrapper>
        <Grid2 container justifyContent={"space-between"} alignItems={"center"}>
          <Grid2 size="auto">
            <Typography variant="h6">Shop List</Typography>
          </Grid2>
          <Grid2 size="auto">
            <IconButton
              size={"small"}
              variant="contained"
              onClick={toggleCreateShopModal}
            >
              <AddBoxOutlinedIcon />
            </IconButton>
          </Grid2>
        </Grid2>
        <TextField
          variant="outlined"
          placeholder="Search shop"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <ShopList shops={shops} isLoading={isLoading} />
      </ShopPageWrapper>
      <ModalLayout
        isOpen={isModalOpen}
        onClose={toggleCreateShopModal}
        onSubmit={handleCreateShop}
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
              label="Shop Rent"
              variant="outlined"
              name="roomRent"
              placeholder="Enter Shop Rent"
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="starting date"
                value={shopField.startDate}
                onChange={(newValue) =>
                  handleInputChange({
                    target: { name: "startDate", value: newValue }
                  })
                }
              />
            </LocalizationProvider>
          </Grid2>
        </Grid2>
      </ModalLayout>
    </ShopPageLayout>
  );
}
