import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api, { ENDPOINTS } from "../../api/axios";

export default function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.equipment.byId(id));
      setEquipment(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/equipment/${id}` } });
      return;
    }
    
    // Navigate to contact page or open contact modal
    navigate("/contact", { state: { equipment } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading equipment...</div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Equipment not found"}
          </h2>
          <button
            onClick={() => navigate("/equipment")}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Back to Equipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-green-600 hover:text-green-700 flex items-center"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={equipment.image || "/placeholder-equipment.jpg"}
                alt={equipment.name}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {equipment.name}
              </h1>

              <div className="mb-6">
                <span className="text-3xl font-bold text-green-600">
                  KSh {equipment.price?.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-2">
                  {equipment.rental ? "per day" : ""}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{equipment.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Type:</span>{" "}
                    {equipment.rental ? "For Rent" : "For Sale"}
                  </li>
                  <li>
                    <span className="font-medium">Condition:</span> {equipment.condition}
                  </li>
                  <li>
                    <span className="font-medium">Availability:</span>{" "}
                    {equipment.available ? "Available" : "Not Available"}
                  </li>
                  {equipment.owner && (
                    <li>
                      <span className="font-medium">Owner:</span> {equipment.owner.name}
                    </li>
                  )}
                </ul>
              </div>

              {equipment.specifications && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                  <ul className="space-y-1 text-gray-700">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium capitalize">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleContact}
                disabled={!equipment.available}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {equipment.available ? "Contact Owner" : "Not Available"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
