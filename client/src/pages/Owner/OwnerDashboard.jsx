import { useEffect, useMemo, useState } from "react";
import { Building2, BedDouble, CalendarRange, DollarSign, Plus, Trash2, PencilLine } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  createOwnerProperty,
  createOwnerRoom,
  deleteOwnerProperty,
  deleteOwnerRoom,
  getOwnerDashboard,
  updateOwnerProperty,
  updateOwnerRoom,
} from "@/services/ownerService";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const propertyFormDefaults = {
  name: "",
  description: "",
  location: "",
  address: "",
  destination: "",
};

const roomFormDefaults = {
  name: "",
  description: "",
  pricePerNight: "",
  capacity: "",
  bedType: "Queen",
  roomSize: "",
  totalRooms: "",
  availableRooms: "",
};

function OwnerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    stats: {
      totalProperties: 0,
      totalRooms: 0,
      totalBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
    },
    properties: [],
    rooms: [],
    bookings: [],
  });
  const [propertyForm, setPropertyForm] = useState(propertyFormDefaults);
  const [roomForm, setRoomForm] = useState(roomFormDefaults);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getOwnerDashboard();
      setDashboard(response || { stats: {}, properties: [], rooms: [], bookings: [] });
      if (response?.properties?.length) {
        setSelectedPropertyId((current) => current || response.properties[0]._id);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load owner dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const propertyRooms = useMemo(() => {
    return dashboard.rooms.filter((room) => room.property?._id === selectedPropertyId);
  }, [dashboard.rooms, selectedPropertyId]);

  const handlePropertyChange = (event) => {
    const { name, value } = event.target;
    setPropertyForm((current) => ({ ...current, [name]: value }));
  };

  const handleRoomChange = (event) => {
    const { name, value } = event.target;
    setRoomForm((current) => ({ ...current, [name]: value }));
  };

  const handlePropertySubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");
      await createOwnerProperty(propertyForm);
      setPropertyForm(propertyFormDefaults);
      await fetchDashboard();
      setSuccess("Property added successfully.");
    } catch (err) {
      setError(err.message || "Unable to create property.");
    }
  };

  const handleRoomSubmit = async (event) => {
    event.preventDefault();

    if (!selectedPropertyId) {
      setError("Select a property before adding a room.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await createOwnerRoom(selectedPropertyId, {
        ...roomForm,
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        roomSize: Number(roomForm.roomSize),
        totalRooms: Number(roomForm.totalRooms),
        availableRooms: roomForm.availableRooms ? Number(roomForm.availableRooms) : Number(roomForm.totalRooms),
      });
      setRoomForm(roomFormDefaults);
      await fetchDashboard();
      setSuccess("Room added successfully.");
    } catch (err) {
      setError(err.message || "Unable to create room.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Delete this property and its rooms?")) return;
    try {
      await deleteOwnerProperty(propertyId);
      await fetchDashboard();
      setSuccess("Property deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete property.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteOwnerRoom(roomId);
      await fetchDashboard();
      setSuccess("Room deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete room.");
    }
  };

  const handleUpdateProperty = async (propertyId) => {
    const property = dashboard.properties.find((item) => item._id === propertyId);
    if (!property) return;
    try {
      await updateOwnerProperty(propertyId, {
        name: property.name,
        description: property.description,
        location: property.location,
        address: property.address || "",
        featured: property.featured,
      });
      await fetchDashboard();
      setSuccess("Property updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update property.");
    }
  };

  const handleUpdateRoom = async (roomId) => {
    const room = dashboard.rooms.find((item) => item._id === roomId);
    if (!room) return;
    try {
      await updateOwnerRoom(roomId, {
        name: room.name,
        description: room.description,
        pricePerNight: Number(room.pricePerNight),
        capacity: Number(room.capacity),
        bedType: room.bedType,
        roomSize: Number(room.roomSize),
        totalRooms: Number(room.totalRooms),
        availableRooms: Number(room.availableRooms),
      });
      await fetchDashboard();
      setSuccess("Room updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update room.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Owner access</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Owner Dashboard</h1>
            <p className="mt-2 text-sm text-neutral-600">Welcome back, {user?.name || "Owner"}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Building2 className="h-5 w-5" />} label="Properties" value={dashboard.stats.totalProperties || dashboard.properties.length} accent="text-sky-600" />
          <StatCard icon={<BedDouble className="h-5 w-5" />} label="Rooms" value={dashboard.stats.totalRooms || dashboard.rooms.length} accent="text-violet-600" />
          <StatCard icon={<CalendarRange className="h-5 w-5" />} label="Bookings" value={dashboard.stats.totalBookings || dashboard.bookings.length} accent="text-amber-600" />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Revenue" value={currency.format(dashboard.stats.totalRevenue || 0)} accent="text-emerald-600" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Add Property</h2>
            <form onSubmit={handlePropertySubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Name</label>
                <input name="name" value={propertyForm.name} onChange={handlePropertyChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Destination ID</label>
                <input name="destination" value={propertyForm.destination} onChange={handlePropertyChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" placeholder="Mongo destination ObjectId" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Location</label>
                <input name="location" value={propertyForm.location} onChange={handlePropertyChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Address</label>
                <input name="address" value={propertyForm.address} onChange={handlePropertyChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Description</label>
                <textarea name="description" value={propertyForm.description} onChange={handlePropertyChange} rows="3" className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
                <Plus className="h-4 w-4" /> Add Property
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Add Room</h2>
            <form onSubmit={handleRoomSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Property</label>
                <select value={selectedPropertyId} onChange={(event) => setSelectedPropertyId(event.target.value)} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none">
                  {dashboard.properties.length === 0 ? <option value="">No property selected</option> : dashboard.properties.map((property) => (
                    <option key={property._id} value={property._id}>{property.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Name</label>
                <input name="name" value={roomForm.name} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Price / Night</label>
                  <input type="number" name="pricePerNight" value={roomForm.pricePerNight} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Capacity</label>
                  <input type="number" name="capacity" value={roomForm.capacity} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Bed Type</label>
                  <input name="bedType" value={roomForm.bedType} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Room Size</label>
                  <input type="number" name="roomSize" value={roomForm.roomSize} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Total Rooms</label>
                  <input type="number" name="totalRooms" value={roomForm.totalRooms} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Available Rooms</label>
                  <input type="number" name="availableRooms" value={roomForm.availableRooms} onChange={handleRoomChange} className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Description</label>
                <textarea name="description" value={roomForm.description} onChange={handleRoomChange} rows="3" className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
                <Plus className="h-4 w-4" /> Add Room
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Properties</h2>
            <div className="mt-5 space-y-3">
              {dashboard.properties.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-500">No properties yet.</div>
              ) : (
                dashboard.properties.map((property) => (
                  <div key={property._id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{property.name}</p>
                        <p className="text-sm text-neutral-500">{property.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleUpdateProperty(property._id)} className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-700">
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDeleteProperty(property._id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Rooms</h2>
            <div className="mt-5 space-y-3">
              {propertyRooms.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-500">No rooms in this property.</div>
              ) : (
                propertyRooms.map((room) => (
                  <div key={room._id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{room.name}</p>
                        <p className="text-sm text-neutral-500">{room.bedType} · {room.capacity} guests</p>
                        <p className="mt-2 text-sm font-medium text-neutral-900">{currency.format(room.pricePerNight)} / night</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleUpdateRoom(room._id)} className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-700">
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDeleteRoom(room._id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Bookings</h2>
            <div className="mt-5 space-y-3">
              {dashboard.bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-500">No bookings for your properties yet.</div>
              ) : (
                dashboard.bookings.map((booking) => (
                  <div key={booking._id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{booking.user?.name || "Guest"}</p>
                        <p className="text-sm text-neutral-500">{booking.property?.name || "Property"} · {booking.room?.name || "Room"}</p>
                        <p className="mt-2 text-xs text-neutral-500">{new Date(booking.checkIn).toLocaleDateString("en-IN")} → {new Date(booking.checkOut).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-neutral-900">{currency.format(booking.totalAmount || 0)}</p>
                        <p className="text-neutral-500">{booking.status}</p>
                        <p className="text-neutral-500">{booking.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Revenue</h2>
            <div className="mt-5 space-y-4">
              <MetricRow label="Total Bookings" value={dashboard.stats.totalBookings || dashboard.bookings.length} />
              <MetricRow label="Confirmed" value={dashboard.stats.confirmedBookings || 0} />
              <MetricRow label="Completed" value={dashboard.stats.completedBookings || 0} />
              <MetricRow label="Total Revenue" value={currency.format(dashboard.stats.totalRevenue || 0)} strong />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-xl bg-neutral-100 p-2 ${accent}`}>{icon}</span>
      </div>
      <p className="mt-4 text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}

function MetricRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className={`font-semibold ${strong ? "text-neutral-900" : "text-neutral-700"}`}>{value}</span>
    </div>
  );
}

export default OwnerDashboard;
