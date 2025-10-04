import { RiCloseLine } from "react-icons/ri";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white shadow-md rounded-md py-6 space-y-4 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-base md:text-lg font-bold text-black-4">Order Details</h2>
          <RiCloseLine className="cursor-pointer text-red-2 text-2xl" onClick={onClose} />
        </div>

        <div className="flex flex-col gap-y-5 pb-3 overflow-y-auto max-h-[80vh]">

          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-base font-bold text-black-1">OrderId</h3>
            <p className="text-sm md:text-base font-medium text-grey-1">{order.id}</p>
          </div>

          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-base font-bold text-black-1">Date</h3>
            <p className="text-sm md:text-base font-medium text-grey-1">{formatDate(order.createdAt)}</p>
          </div>

          {order.cart && order.cart.items && (
            <div className="flex flex-col md:justify-between md:flex-row border-b border-b-gray-2 pb-2 px-4">
              <h3 className="text-sm md:text-base font-bold text-black-1 mb-2">Products</h3>
              <div className="space-y-3">
                {order.cart.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    {item.selectedOptions?.imageUrl && (
                      <div className="w-12 h-12 p-1 overflow-hidden rounded-lg group bg-gray-6">
                        <img 
                          src={item.selectedOptions.imageUrl} 
                          alt={item.selectedOptions.productName} 
                          className="w-full h-full object-cover transition-all ease-in-out duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm md:text-base font-medium text-grey-1">{item.selectedOptions?.productName || 'Unknown Product'}</h3>
                      <p className="text-xs md:text-sm text-gray-500">Quantity: {item.quantity} × ₦{item.price} = ₦{item.quantity * item.price}</p>
                         
                      {item.selectedOptions?.size && (
                        <p className="text-xs md:text-sm text-gray-500">Size: {item.selectedOptions.size}</p>                      
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        
          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-xs md:text-base font-bold text-black-1">Delivery Address</h3>
            <p className="text-xs md:text-base font-medium text-grey-1">{order.deliveryAddress || 'Not provided'}</p>
          </div>

          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-xs md:text-base font-bold text-black-1">Delivery Note</h3>
            <p className="text-xs md:text-base font-medium text-grey-1">{order.deliveryNote || 'None'}</p>
          </div>

          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-xs md:text-base font-bold text-black-1">Payment Method</h3>
            <p className="text-xs md:text-base font-medium text-grey-1">{order.paymentMethod}</p>
          </div>

          <div className="flex justify-between border-b border-b-gray-2 pb-2 px-4">
            <h3 className="text-xs md:text-base font-bold text-black-1">Amount</h3>
            <p className="text-xs md:text-base font-medium text-grey-1">₦{order.amount}</p>
          </div>

          <div className="flex justify-between px-4">
            <h3 className="text-xs md:text-base font-bold text-black-1">Status</h3>
            <p className={`text-xs md:text-base font-medium
              ${order.status === 'payment_success' ? 'text-green-600' : ''}
              ${order.status === 'payment_initialize' ? 'text-blue-500' : ''}
              ${order.status === 'payment_failed' ? 'text-red-500' : ''}
              ${order.status === 'shipped' ? 'text-yellow-600' : ''}
              ${order.status === 'delivered' ? 'text-green-600' : ''}`}>
              {order.status.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;