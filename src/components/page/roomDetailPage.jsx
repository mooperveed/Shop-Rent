export const PaidItem = (props) => {
  return (
    <div>
      <div>
        <div>{props.price}</div>
        <div>{props.date}</div>
      </div>
      <div>
        <div>{props.currentBalance}</div>
        <div>{props.previousBalance}</div>
      </div>
    </div>
  );
};
export const PaymentList = (props) => {
  return (
    <div>
      <input />
      <div>
        {props.payments.map((payment) => (
          <PaidItem {...payment} />
        ))}
      </div>
    </div>
  );
};
export const RoomDetailCard = (props) => {
    return (
        <div>
            <div>
                <h1>{props.name}</h1>
                <h2>{props.price}</h2>
            </div>
            <div>
                <div>{props.status}</div>
                <div>{props.number}</div>
            </div>
        </div>
    )
};
export const RoomDetailPage = (props) => {
  return (
    <div>
      <RoomDetailCard />
      <PaymentList payments={props.payments}/>
    </div>
  );
};
