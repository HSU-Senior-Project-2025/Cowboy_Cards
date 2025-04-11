

const InfoRow = (props) => {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{props.label}:</span>
      <span>{props.value}</span>
    </div>
  );
};

export default InfoRow;
