import { Button } from "@mui/material";
import { PaidItem } from "./PaidItem";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { useTenantPaymentsQuery } from "../../hooks/query/useTenantPayments";
import { useMemo } from "react";

const PaymentListWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }));
  const PaymentListContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }));
  const PaymentListHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }));
  const PaymentListHeaderLabel = styled("div")(({ theme }) => ({
    fontSize: "24px",
    fontWeight: 500,
    color: "#000000"
  }));
  export const PaymentList = () => {
    const { roomId } = useParams();
    const paymentsListQuery = useTenantPaymentsQuery(roomId);
    const payments = useMemo(() => {
      if (!paymentsListQuery.data) return [];
      return paymentsListQuery.data;
    }, [paymentsListQuery.data]);
    if (paymentsListQuery.isLoading) {
      return <div>Loading...</div>;
    }
  
    if (paymentsListQuery.isError) {
      return <div>Error: {paymentsListQuery.error.message}</div>;
    }
    return (
      <PaymentListContainer>
        <PaymentListHeader>
          <PaymentListHeaderLabel>PaymentList</PaymentListHeaderLabel>
          <Button size={"small"}>New + </Button>
        </PaymentListHeader>
        <PaymentListWrapper>
          {payments.map((payment) => (
            <PaidItem {...payment} />
          ))}
        </PaymentListWrapper>
      </PaymentListContainer>
    );
  };