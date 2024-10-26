import styled from "@emotion/styled";

const PaidItemWrapper = styled("div")(({ theme }) => ({
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
const PaidItemLeftCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const PaidAmount = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidDate = styled("div")(({ theme }) => ({
  fontSize: "16px",
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
    <PaidItemWrapper>
      <PaidItemLeftCol>
        <PaidAmount>{props.price}</PaidAmount>
        <PaidDate>{props.date}</PaidDate>
      </PaidItemLeftCol>
      <PaidItemRightCol>
        <PaidCurrentBalance>{props.currentBalance}</PaidCurrentBalance>
        <PaidPreviousBalance>{props.previousBalance}</PaidPreviousBalance>
      </PaidItemRightCol>
    </PaidItemWrapper>
  );
};
