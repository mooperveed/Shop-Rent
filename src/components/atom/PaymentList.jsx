import { Button, Grid2, Typography } from "@mui/material";
import { PaidItem } from "./PaidItem";
import { useParams } from "react-router-dom";
import { useShopPaymentsQuery } from "../../hooks/query/useShopPayments";
import { useMemo, useState } from "react";
import { NewPaymentModal } from "./NewPaymentModal";
import CircularLoader from "./CircularLoader";
import { useShopDetailsQuery } from "../../hooks/query/useShopDetails";


export const PaymentList = () => {
  const { shopId } = useParams();
  const [open, setOpen] = useState(false);
  const paymentsListQuery = useShopPaymentsQuery(shopId);
  const shopDetailsQuery = useShopDetailsQuery(shopId);
  const payments = useMemo(() => {
    if (!paymentsListQuery.data) return [];
     
    return paymentsListQuery.data;
  }, [paymentsListQuery.data]);
  const toggleCreatePaymentModal = () => {
    setOpen(!open);
  };
  const handlePaymentListRefetch = () => {
    paymentsListQuery.refetch();
    shopDetailsQuery.refetch();
    toggleCreatePaymentModal();
  };
 
  if (paymentsListQuery.isLoading || paymentsListQuery.isFetching) {
    return <CircularLoader />;
  }

  if (paymentsListQuery.isError) {
    return <div>Error: {paymentsListQuery.error.message}</div>;
  }
  return (
    <Grid2 container spacing={2}>
      <Grid2
        container
        size={{ xs: 12 }}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid2>
          <Typography variant="subtitle1" fontWeight={500}>
            PaymentList
          </Typography>
        </Grid2>
        <Grid2>
          <Button
            size={"small"}
            variant="contained"
            onClick={toggleCreatePaymentModal}
          >
            Add +
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2} size={{ xs: 12 }}>
  {(payments.length === 0 || !payments) && (
    <Typography variant="subtitle1">No payments found</Typography>
  )}
  {payments
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => {
      const dateA = new Date(a.createdAt.seconds * 1000); // Convert Firestore timestamp to Date
      const dateB = new Date(b.createdAt.seconds * 1000);
      return dateB - dateA; // Sort in descending order (latest date first)
    })
    .map((payment) => (
      <PaidItem key={payment.id} paymentId={payment.id} paymentsListQuery={paymentsListQuery}   {...payment} />

    ))}
</Grid2>

      <NewPaymentModal
        open={open}
        onClose={toggleCreatePaymentModal}
        onSuccess={handlePaymentListRefetch}
      />
    </Grid2>
  );
};
