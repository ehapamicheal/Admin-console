import { BiSearch } from "react-icons/bi";

const UsersManagement = () => {
  return (
    <div className="mx-2 md:mx-4 mt-10 pt-12 pb-6">
      {/* <p>user management</p> */}
        <div className="flex gap-3 md:justify-between flex-col md:flex-row">
              <div className="flex items-center gap-2 bg-white shadow p-2 rounded-md w-full md:w-[80%]">
                <BiSearch className="search_icon cursor-pointer text-black-2 text-xl" />
                <input
                  className="text-black-1 font-dm-sans placeholder:text-gray-3 text-base px-1 outline-none w-full"
                  type="text"
                  placeholder="Search"

                />
              </div>
      
              <div className="text-right mt-4 md:mt-0">
                <button

                  className="font-bold w-fit text-[15px] text-white bg-red-1 cursor-pointer p-2 rounded-md transition-all duration-150 ease-in-out hover:-translate-y-0.5 active:translate-y-0"
                >
                  Add User
                </button>
              </div>
            </div>
    </div>
  )
}

export default UsersManagement;