import React from "react";
import {
    Chip,
    Grid2,
    IconButton,
    TextField,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
  } from "@mui/material";
  
  import { ModalLayout } from "./ModalLayout";
  import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
  import WhatsAppIcon from "@mui/icons-material/WhatsApp";

  import {
    calculateRentTaxStatus,
    getRentStatusColorAndText,getTaxStatusColorAndText
  } from "../../utils/calculateRentTaxStatus";
  import { ClickDetails } from "./ClickDetailsLayout";

  // import EditIcon from "@mui/icons-material/Edit";
  import { useRoomListQuery } from "../../hooks/query/useRoomList";


export const LayoutsShopDetailCard= ({
     // Modal States
     isOpen,
     isOpenTax,
     isOpenRoom,
     toggleOpen,
     toggleOpenTax,
     toggleOpenRoom,
     toggleUpdateModal,
     toggleUpdateModalTax,
     toggleUpdateModalRoom,
 
     // Handlers
     handleUpdateShop,
     handleInputChange,
 
     // Shop Data
     shopField,
     shopDeatilsQuery,
     shopId,
 
     // UI Components
     ShopDetailCardWrapper,
     LabeledField,
     ShopName,
     RoomCount,
     ShopRentAmount,
     ShopStatus,
     ShopOwnerName,
     ShopAddress,

  })=>{
    
    const { data: roomConsumerData } = useRoomListQuery(shopId);
    return(
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
      <Grid2 size="auto">
       
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
              calculateRentTaxStatus(
                shopDeatilsQuery.data.startDate,
                shopDeatilsQuery.data.shopRent,
                shopDeatilsQuery.data.currentBalance,
                shopDeatilsQuery.data.taxRate,
                shopDeatilsQuery.data.taxBalance,
              )
            )}
            size="small"
          />
        </Grid2>
        {/* <Grid2>
          <IconButton size={"small"} variant="contained" onClick={toggleOpen}>
            <EditIcon />
          </IconButton>
        </Grid2> */}
      </Grid2>
    </Grid2>
    <Grid2 container size={{ xs: 12 }} rowGap={2}>
      <Grid2 size={{ xs: 6 }}>
        <LabeledField label={"Shop Name"}>
          <ShopName>{shopDeatilsQuery.data.shopName}</ShopName>
        </LabeledField>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabeledField label={"Room count"} >
          <RoomCount onClick={toggleOpenRoom} style={{ cursor: "pointer", color: "blue" }}
          >{shopDeatilsQuery.data.noOfRooms}</RoomCount>
        </LabeledField>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabeledField label={"Rent"}>
          <ShopRentAmount >{shopDeatilsQuery.data.shopRent}</ShopRentAmount>      {/*{ //in firebase shopRent.I want to change to shopRent. for changing here}*/} 
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
      <LabeledField label={"Tax Rate"}  >
       <ShopAddress onClick={toggleOpenTax} style={{ cursor: "pointer", color: "blue" }}
       >
            {shopDeatilsQuery.data.taxRate}
      </ShopAddress>
      </LabeledField>

      </Grid2>
      <Grid2>
  <IconButton 
    size="small" 
    variant="contained" 
    onClick={() => {
      const url = `https://wa.me/${shopDeatilsQuery.data.phoneNumber}`;
      console.log("Redirecting to WhatsApp:", url); // For debugging
      window.open(url, '_blank'); // Opens the link in a new tab
    }}
  >
    <WhatsAppIcon />
  </IconButton>
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
        name="noOfRooms"
        placeholder="Enter No of rooms"
        fullWidth
        value={shopField.noOfRooms}
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
        value={shopField.shopRent}  //in firebase shopRent.I want to change to shopRent. for changing here
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


    <ClickDetails
    isOpen={isOpenTax}
    onClose={toggleUpdateModalTax}
    >
    <Grid2 container spacing={2}>
    {/* <Grid2 size={{ xs: 12 }}>

      </Grid2> */}
      <Grid2 size="auto">
          <Chip
            {...getTaxStatusColorAndText(
              calculateRentTaxStatus(
                shopDeatilsQuery.data.startDate,
                shopDeatilsQuery.data.shopRent,
                shopDeatilsQuery.data.currentBalance,
                shopDeatilsQuery.data.taxRate,
                shopDeatilsQuery.data.taxBalance,
              )
            )}
            size="small"
          />
        </Grid2>
        <Grid2 size="auto">
        <LabeledField label={"Paid Amount"}>
          <ShopAddress>
            {calculateRentTaxStatus.totalPaidTax}
          </ShopAddress>
        </LabeledField>
        </Grid2>
      </Grid2>
    </ClickDetails>  
                                                              {/* second clickdetails */}
                                                              <ClickDetails isOpen={isOpenRoom} onClose={toggleUpdateModalRoom}>
  <TableContainer component="div">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Room Number</TableCell>
          <TableCell>Consumer Number</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roomConsumerData?.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.roomNo}</TableCell>
            <TableCell>{room.consumerNo}</TableCell>
            <TableCell>{room.roomRent}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</ClickDetails>

  </ShopDetailCardWrapper>
  );
}