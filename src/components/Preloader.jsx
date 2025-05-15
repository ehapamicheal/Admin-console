
const Preloader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex justify-center items-center flex-col z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-red-2 rounded-full animate-spin"></div>
      <p className="mt-4 text-xl text-red-1">Loading...</p>
    </div>
  );
};

export default Preloader;