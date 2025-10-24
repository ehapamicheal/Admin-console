import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { getUserById, blockUser, unblockUser } from "../../api/usersApi";
import { toast } from "react-toastify";
import Spinner from "./Spinner";



const UserDetailsModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  useEffect(() => {
    if (!isOpen || !userId) {
      // Reset immediately when modal closes
      setUser(null);
      setLoading(false);
      return;
    }
    
    let mounted = true;

    const fetch = async () => {
      setLoading(true);
      try {
        const result = await getUserById(userId);
        if (!mounted) return;

        const resolved = result.user ?? result.data ?? result;
        setUser(resolved);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    
    return () => {
      mounted = false;
    };
  }, [isOpen, userId]);

    // BLOCK AND UBLOCK USER 
    const handleBlockToggle = async () => {
        if (!user) return;
        setActionLoading(true);

        try {
            if (user.isActive) {
            await blockUser(userId);
            toast.success("User blocked successfully");
            } else {
            await unblockUser(userId);
            toast.success("User unblocked successfully");
            }

            // Refetch user details
            const updated = await getUserById(userId);
            const resolved = updated.user ?? updated.data ?? updated;
            setUser(resolved);

            if (onUserUpdated) onUserUpdated();
        } catch (err) {
            console.error("Block/Unblock error:", err);
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };


  if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        {loading ? (
            <Spinner title="Fetching Users details..." />
            ) : user ? (
                <article className="relative z-50 w-[96%] ms:w-[90%] ms:max-w-3xl md:w-70%] max-h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/*========== TEXT AND CLOSE BUTTON ==========*/}
                    <div className="flex items-center justify-between p-6 border-b border-red-2/20">
                    <h3 className="text-xl md:text-2xl font-bold text-black-1">User Details</h3>

                        <button onClick={onClose} type="button" className="cursor-pointer group" aria-label="close modal">
                            <RiCloseLine
                                className="text-red-2 text-2xl transition group-hover:rotate-90 duration-500"
                            />
                        </button>
                    </div>

                    <div className="py-6 pr-4 pl-6 max-h-[80vh] overflow-y-auto">

                        <div className="pb-7">
                            {/*========== HEADER ==========*/}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-2/60 to-red-1/50 flex items-center justify-center ">
                                <h3 className="text-xl md:text-3xl font-bold text-black-1"> {`${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`}</h3>
                                </div>
                                
                                <div className="text-center space-y-1">
                                    <h4 className="font-semibold text-lg md:text-xl text-black-1">{user.firstName} {user.lastName}</h4>
                                    <p className="text-sm md:text-base text-black-1 font-normal">{user.email}</p>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <h4 className="font-semibold text-base md:text-lg text-black-1">Joined</h4>
                                    <div className="text-sm md:text-base text-black-1 font-normal">{formatDate(user.createdAt)}</div>
                                </div>
                            </div>

                            <div className="grid mt-5 grid-cols-1 md:grid-cols-2 gap-6">
                                {/*========== NAME AND EMAIL ==========*/}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Phone</h3>
                                        <p className="text-sm md:text-[15px] text-black-1 font-normal"> {user.phoneNumber ? `0${user.phoneNumber}` : "-"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Address</h3>
                                        <p className="text-sm md:text-[15px] text-black-1 font-normal">{user.address ?? "-"}</p>
                                    </div>
                                
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1"></h3>
                                        <p className="text-sm md:text-[15px] text-black-1 font-normal"></p>
                                    </div>


                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-base md:text-lg text-black-1">City</h3>
                                            <p className="text-sm md:text-[15px] text-black-1 font-normal">{user.city ?? "-"}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-base md:text-lg text-black-1">State</h3>
                                            <p className="text-sm md:text-[15px] text-black-1 font-normal">{user.state ?? "-"}</p>
                                        </div>
                                    
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">University</h3>
                                        <p className="text-sm md:text-[15px] text-black-1 font-normal">{user.universityName ?? "-"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-base md:text-lg text-black-1">Last Ordered</h4>
                                        <div className="text-sm md:text-base text-black-1 font-normal">{formatDate(user.lastOrderDate) ?? "_"}</div>
                                    </div>
                                </div>

                                {/*========== ROLES, SPENT AND ACTIONS BUTTONS ==========*/}
                                <div className="flex flex-col gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Roles</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(user.roles && user.roles.length > 0)
                                            ? user.roles.map((r) => (
                                                <span key={r} className="text-xs px-2 py-1 rounded-full border border-red-1/40 bg-white font-normal text-black-1">
                                                    {r.replace("_", " ")}
                                                </span>
                                                ))
                                            : <span className="text-xs text-black-1">—</span>}
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded-2xl space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Spent</h3>
                                        <p className="text-sm md:text-base text-black-1 font-normal">
                                            {user.totalSpent && user.totalSpent > 0
                                            ? `₦${user.totalSpent.toLocaleString()}`
                                            : "_"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded-2xl space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Total Orders</h3>
                                        <p className="text-sm md:text-base text-black-1 font-normal">
                                            {user.totalOrders && user.totalOrders > 0
                                            ? user.totalOrders
                                            : "_"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded-lg space-y-1">
                                        <h3 className="font-semibold text-base md:text-lg text-black-1">Status</h3>
                                        <p
                                            className={`text-xs px-3 py-1 w-fit rounded-full font-medium ${
                                                user.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                            >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>

                                    {/*========== CANCEL AND BLOCK BUTTONS ==========*/}
                                    <div className="mt-2 md:mt-3 inline-flex flex-row gap-2">
                                        <button className="border cursor-pointer w-full text-base md:text-lg border-red-1 py-3 px-1 rounded-2xl text-black-1 hover:bg-gray-50 transition-colors duration-300"
                                            onClick={onClose}>
                                            Close
                                        </button>

                                        <button type="button"
                                            className={`cursor-pointer w-full text-base md:text-lg text-white font-semibold py-3 px-1 rounded-2xl ${
                                                user.isActive
                                                ? "bg-red-1 hover:bg-red-700"
                                                : "bg-green-1 hover:bg-green-700"
                                            } flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                            onClick={handleBlockToggle}
                                            disabled={actionLoading}
                                            >
                                            {actionLoading
                                                ? "Processing..."
                                                : user.isActive
                                                ? "Block User"
                                                : "Unblock User"}
                                        </button>


                                
                                    </div>
                                </div>
                            </div>

                        
                        </div>
                
                    </div>
                </article>
            ) : (
                <div className="text-center text-gray-500">No user data</div>
            )
        }

       
    </div>
  );

};

export default UserDetailsModal;