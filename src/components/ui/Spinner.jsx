
const Spinner = ({title}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-md shadow-lg z-10 flex flex-col items-center">
        <div className="relative w-16 h-16">

          <div className="absolute inset-0 border-4 border-gray-200 border-t-red-500 border-r-red-400 rounded-full animate-spin"></div>
          

          <div className="absolute inset-2 border-4 border-gray-200 border-b-red-500 rounded-full animate-spin-slow"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
        {/* <p className="mt-4 text-xl text-red-500 font-medium">Loading order details...</p> */}
         <p className="mt-4 text-xl text-red-500 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default Spinner;
