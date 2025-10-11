import { useState, useEffect, useRef } from "react";
import { BiSearch } from "react-icons/bi";
// import AddUserModal from "../../components/ui/AddUserModal";
import { BiChevronDown } from "react-icons/bi";
import { toast } from "react-toastify";
import PaginationButton from "../../components/PaginationButton";
import { getAllUsers } from "../../api/usersApi";
import UserDetailsModal from "../../components/ui/UserDetailsModal";
import { SlOptions } from "react-icons/sl";
import AssignRoleModal from "../../components/ui/AssignRoleModal";
import FulfilmentAgentModal from "../../components/ui/FulfilmentAgentModal";


const UserManagementTable = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [assignUser, setAssignUser] = useState(null);
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const [userAgent, setUserAgent] = useState(null);


  const [selectedRole, setSelectedRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  // DATE FORMATE
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest?.(".options-dropdown")) {
            setOpenOptionsId(null);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);


    const fetchUsers = async (page = currentPage, search = debouncedSearchTerm, role = selectedRole) => {
        try {
            setLoading(true);
            const data = await getAllUsers({
            page,
            limit: 10,
            search,
            role: role !== "all" ? role : undefined,
            });
            setUsers(data.users || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // FETCH USERS CURRENT PAGE
    useEffect(() => {
       fetchUsers(currentPage, debouncedSearchTerm, selectedRole);
    }, [currentPage, debouncedSearchTerm, selectedRole]);



    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        }
    };

    const handleExportCSV = async () => {
        if (exporting) return;
        
        try {
            setExporting(true);

            // Fetch first page to learn totalPages
            const firstPage = await getAllUsers({ page: 1, limit: 10 });
            const totalPages = firstPage.pagination?.totalPages || 1;
            let allUsers = firstPage.users || [];

            // Fetch remaining pages (2..totalPages)
            for (let p = 2; p <= totalPages; p++) {
            const res = await getAllUsers({ page: p, limit: 10 });
            allUsers = allUsers.concat(res.users || []);
            }

            if (!allUsers.length) {
            toast.info("No users to export");
            return;
            }

            // CSV headers (added Total Spent and Total Orders)
            const headers = [
            "Created Date",
            "First Name",
            "Last Name",
            "Email",
            "Phone Number",
            "Address",
            "State",
            "City",
            "University Name",
            "Roles",
            "Total Spent",
            "Total Orders",
            ];

            // Build rows
            const rows = allUsers.map((u) => {
            const created = u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "";
            const rolesStr = (u.roles || []).map((r) => r.replace(/_/g, " ")).join(", ");
            const totalSpent =
                u.totalSpent === null || u.totalSpent === undefined
                ? ""
                : Number(u.totalSpent).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const totalOrders = u.totalOrders === null || u.totalOrders === undefined ? "" : String(u.totalOrders);

            return [
                created,
                u.firstName || "",
                u.lastName || "",
                u.email || "",
                u.phoneNumber || "",
                u.address || "",
                u.state || "",
                u.city || "",
                u.universityName || "",
                rolesStr,
                totalSpent,
                totalOrders,
            ];
            });

            // Properly escape quotes and add UTF-8 BOM for Excel compatibility
            const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
            ),
            ].join("\n");

            const csvWithBom = "\uFEFF" + csvContent;
            const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success(`Exported ${allUsers.length} users`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to export users");
        } finally {
            setExporting(false);
        }
    };


  return (
    <>
        {/* Search + Add button */}
        <div className="flex gap-3 md:justify-between flex-col md:flex-row">
            {/*========== SEARCH BOX INPUT ==========*/}
            <div className="flex items-center gap-2 bg-white shadow p-2 rounded-md w-full md:w-[80%]">
                <BiSearch className="search_icon cursor-pointer text-black-2 text-xl" />
                <input
                    className="text-black-1 font-dm-sans placeholder:text-gray-3 text-base px-1 outline-none w-full"
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/*========== ADDE USER BUTTON ==========*/}
            {/* <div className="text-right mt-4 md:mt-0">
                <button
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                    className="font-bold w-fit text-[15px] text-white bg-red-1 cursor-pointer p-2 rounded-md transition-all duration-150 ease-in-out hover:-translate-y-0.5 active:translate-y-0"
                >
                    Add User
                </button>
            </div> */}
        </div>

        {/*========== FILTER ROLE DROPDOWN ==========*/}
        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative w-45" ref={dropDownRef}>
                <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center bg-white shadow p-2 rounded-md cursor-pointer"
                >
                    <span className="text-black-1 text-sm font-medium">
                        {selectedRole ? selectedRole.replace("_", " ") : "Filter by Role"}
                    </span>
                    <BiChevronDown
                        className={`text-xl transform transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>

                {isDropdownOpen && (
                    <div className="absolute mt-2 w-full bg-white shadow-md space-y-2 rounded-md z-20 py-3 px-2">
                        {["", "admin", "sponsor", "fulfilment_agent"].map((role) => (
                        <div
                            key={role || "all"}
                            onClick={() => {
                            setSelectedRole(role);
                            setIsDropdownOpen(false);
                            setCurrentPage(1);
                            }}
                            className={`p-2 cursor-pointer text-center hover:bg-red-1/15 transition duration-300 rounded-2xl ${
                            selectedRole === role ? "bg-red-1/90" : ""
                            }`}
                        >
                        <p  className={`text-sm hover:text-black-1 transition duration-300 ${
                            selectedRole === role ? " text-white font-medium" : "text-black-1"
                            }`}>{role === "" ? "All Roles" : role.replace("_", " ")}</p>
                        </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="text-red-1 text-sm w-fit cursor-pointer transition delay-75 hover:bg-red-1 hover:text-white border border-red-1 rounded-3xl py-2 px-3 disabled:opacity-60"
                type="button"
                >
               {exporting ? "Preparing..." : "Export as CSV"}
            </button>

        </div>

        {/*========== USERS TABLE ==========*/}
        <div className="mt-8 bg-white rounded-lg shadow-md w-full overflow-hidden">
            <div className="overflow-x-auto relative">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-2 bg-gray-100">
                            <th className="text-left pl-4 table_th whitespace-nowrap">No</th>
                            <th className="table_th text-center whitespace-nowrap">Name</th>
                            <th className="table_th text-center whitespace-nowrap">Email</th>
                            <th className="table_th text-center whitespace-nowrap">Phone</th>
                            <th className="table_th text-center whitespace-nowrap">Spent</th>
                            <th className="table_th text-center whitespace-nowrap">Role</th>
                            <th className="table_th text-center whitespace-nowrap">Date</th>
                            <th className="table_th">Action</th>
                        </tr>
                    </thead>
                
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                            <tr key={user.id} className="border-b border-gray-2">
                                <td className="pl-4 py-2 whitespace-nowrap tbody_tr_td">
                                    {(currentPage - 1) * 10 + index + 1}
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td user-td3">
                                  {user.firstName} {user.lastName}
                                </td>

                                <td className="py-2 text-center whitespace-nowrap relative group">
                                <div className="max-w-[120px] mx-auto">
                                    <p className="truncate tbody_tr_td">{user.email}</p>
                                </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td user-td4">
                                  {user.phoneNumber ? `0${user.phoneNumber}` : ""}
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td user-td4">
                                    {user.totalSpent === 0
                                        ? ""
                                        : `₦${Number(user.totalSpent).toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                    })}`}
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td user-td2">
                                    <div className="flex flex-col gap-y-1">
                                        {user.roles.map((r, i) => (
                                            <p key={i}>
                                                {r.replace("_", " ").charAt(0).toUpperCase() + r.replace("_", " ").slice(1)}
                                            </p>
                                        ))}
                                    </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td user-td3">
                                {formatDate(user.createdAt)}
                                </td>

                                <td className="relative py-2 text-center user-td1">
                                    <div className="relative inline-block text-left options-dropdown">
                                        <button
                                        type="button"
                                        aria-label="Options"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenOptionsId((prev) => (prev === user.id ? null : user.id));
                                        }}
                                        className="p-1 rounded-md cursor-pointer hover:bg-gray-100 transition duration-300"
                                        >
                                        <SlOptions className="text-gray-700" />
                                        </button>

                                        {openOptionsId === user.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                                            <button
                                            onClick={() => {
                                                setUserDetails(user.id); 
                                                setOpenOptionsId(null); 
                                            }}
                                            className="block w-full text-center px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 transition duration-300"
                                            >
                                            View Details
                                            </button>

                                            <div className="text-center">
                                                {currentUser?.roles?.includes("admin") && (
                                                    <>

                                                        <button
                                                            onClick={() => {
                                                            setAssignUser(user); 
                                                            setOpenOptionsId(null); 
                                                            }}
                                                            className="block w-full cursor-pointer text-center text-black-1 px-4 py-2 text-sm hover:bg-gray-100 transition duration-300"
                                                        >
                                                            Assign Roles
                                                        </button>
                                                            
                                                        <button onClick={() => 
                                                            {setUserAgent(user);
                                                            setOpenOptionsId(null)}} 
                                                        className="block w-full cursor-pointer text-center text-black-1 px-4 py-2 text-sm hover:bg-gray-100 transition duration-300" type="button">Create Agent</button>
                                                    </>
                                                    
                                                )}
                                    
                                            </div>

                                        </div>
                                        )}
                                    </div>
                                </td>


                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-6">
                                    <p className="text-gray-500 font-normal text-base md:text-lg">
                                    {debouncedSearchTerm ? "No users match your search." : "No users available."}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/*========== PAGINATION BUTTONS ==========*/}
            <PaginationButton
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            />
        </div>

        {/*========== ADD USERS MODAL ==========*/}
        {/* <AddUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            handleAddUser={() => {
            fetchUsers(1, "");
            }}
        /> */}

        {/*========== USERS DETAILS MODAL ==========*/}
        <UserDetailsModal
            isOpen={!!userDetails}
            onClose={() => setUserDetails(null)}
            userId={userDetails}
        />

        {/*========== ASSIGN ROLES MODAL ==========*/}
        <AssignRoleModal
            isOpen={!!assignUser}
            onClose={() => setAssignUser(null)}
            user={assignUser}
            onSuccess={() => fetchUsers(currentPage, debouncedSearchTerm, selectedRole)}
        />

        {/*========== FULFILMENT AGENT MODAL ==========*/}
        <FulfilmentAgentModal
            isOpen={!!userAgent}
            onClose={() => setUserAgent(null)}
            onSuccess={() => fetchUsers(currentPage, debouncedSearchTerm, selectedRole)}
            user={userAgent}
        />

    </>
  );
};


export default UserManagementTable;