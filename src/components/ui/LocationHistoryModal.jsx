import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { addFulfilmentLocationHistory, getFulfilmentLocationHistory } from "../../api/fulfilmentApi";
import { toast } from "react-toastify";

const LocationHistoryModal = ({ orderId, onClose }) => {
  const [locationHistory, setLocationHistory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getFulfilmentLocationHistory(orderId);
        console.log("Fetched history", history);
      } catch (err) {
        console.error("Error fetching location history", err);
      }
    };
    if (orderId) fetchHistory();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addFulfilmentLocationHistory(orderId, locationHistory, note);
      setLocationHistory("");
      setNote("");
      onClose();
      toast.success("Location added successfully");
    } catch (err) {
      setError("Failed to save location history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="relative bg-white z-50 p-4 md:p-6 rounded-lg w-120 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black-4">Location History</h2>
          <RiCloseLine className="cursor-pointer text-red-2 text-2xl" onClick={onClose} />
        </div>

        <form className="pb-2 pr-2" onSubmit={handleSubmit}>
          <input
            value={locationHistory}
            onChange={(e) => setLocationHistory(e.target.value)}
            placeholder="Location"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notes"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-500"
          />

          {error && <p className="text-red-2 text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              className="cursor-pointer border w-full text-red-2 rounded-3xl py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-red-1 w-full font-bold text-white p-2 rounded-3xl flex items-center justify-center"
            >
              {loading && (
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loading ? "Saving..." : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationHistoryModal;