
const SalesCard = ({children,  className = ""}) => {
  return (
    <div className={`rounded shadow-md bg-white p-4 ${className}`}>
        {children}
    </div>
  )
}

export default SalesCard;