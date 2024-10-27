import styled from "@emotion/styled";
import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { Grid2, IconButton } from "@mui/material";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

const PaidItemWrapper = styled(Grid2)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  border: "1px solid #EAEAEA",
  borderRadius: "8px",
  cursor: "pointer",
  [theme.breakpoints.up("md")]: {
    padding: "16px"
  }
}));
const PaidItemLeftCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));
const PaidAmount = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidDate = styled("div")(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidItemRightCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const PaidCurrentBalance = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidPreviousBalance = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
export const PaidItem = (props) => {
  return (
    <PaidItemWrapper
      size={{ xs: 12 }}
      container
      justifyContent={"space-between"}
    >
      <Grid2>
        <PaidAmount>{props.amount}</PaidAmount>
        <PaidDate>Paid on {formatTimestampToDate(props.createdAt)}</PaidDate>
      </Grid2>
      <Grid2 container spacing={1} alignItems={"center"}>
        <Grid2>
          <IconButton size={"small"} variant="contained">
            <SystemUpdateAltOutlinedIcon />
          </IconButton>
        </Grid2>
        <Grid2>
          <IconButton size={"small"} variant="contained" color="error">
            <DeleteIcon />
          </IconButton>
        </Grid2>
      </Grid2>
    </PaidItemWrapper>
  );
};
