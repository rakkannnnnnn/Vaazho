import { useEffect, useState } from "react";
import { Users, Building2, MapPinned, CalendarRange, DollarSign, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminSummary,
  getAdminUsers,
  getAdminProperties,
  getAdminDestinations,
  getAdminBookings,
  getAdminPayments,
  getAdminReviews,
} from "@/services/adminService";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalDestinations: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalReviews: 0,
  });
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [summaryRes, usersRes, propertiesRes, destinationsRes, bookingsRes, paymentsRes, reviewsRes] = await Promise.all([
        getAdminSummary(),
        getAdminUsers(),
        getAdminProperties(),
        getAdminDestinations(),
        getAdminBookings(),
        getAdminPayments(),
        getAdminReviews(),
      ]);

      setSummary(summaryRes?.summary || {});
      setUsers(usersRes?.users || []);
      setProperties(propertiesRes?.properties || []);
      setDestinations(destinationsRes?.destinations || []);
      setBookings(bookingsRes?.bookings || []);
      setPayments(paymentsRes?.payments || []);
      setReviews(reviewsRes?.reviews || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Dashboard data is loaded once when the protected page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Admin access</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-600">Welcome back, {user?.name || "Administrator"}</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading && <p className="text-sm text-neutral-500">Loading dashboard data...</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={summary.totalUsers || users.length} accent="text-sky-600" />
          <StatCard icon={<Building2 className="h-5 w-5" />} label="Total Properties" value={summary.totalProperties || properties.length} accent="text-violet-600" />
          <StatCard icon={<MapPinned className="h-5 w-5" />} label="Total Destinations" value={summary.totalDestinations || destinations.length} accent="text-amber-600" />
          <StatCard icon={<CalendarRange className="h-5 w-5" />} label="Total Bookings" value={summary.totalBookings || bookings.length} accent="text-emerald-600" />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value={currency.format(summary.totalRevenue || 0)} accent="text-rose-600" />
          <StatCard icon={<Star className="h-5 w-5" />} label="Total Reviews" value={summary.totalReviews || reviews.length} accent="text-indigo-600" />
        </div>

        <div className="space-y-8">
          <Section title="Users">
            <Table rows={users} columns={['Name', 'Email', 'Role', 'Created date']} renderRow={(userRow) => (
              <tr key={userRow._id} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3 font-medium text-neutral-900">{userRow.name}</td>
                <td className="px-4 py-3">{userRow.email}</td>
                <td className="px-4 py-3">{userRow.role}</td>
                <td className="px-4 py-3">{new Date(userRow.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            )} />
          </Section>

          <Section title="Properties">
            <Table rows={properties} columns={['Property', 'Owner', 'Destination', 'Rooms', 'Status']} renderRow={(property) => (
              <tr key={property._id} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3 font-medium text-neutral-900">{property.name}</td>
                <td className="px-4 py-3">{property.owner?.name || "Unknown"}</td>
                <td className="px-4 py-3">{property.destination?.name || "Unknown"}</td>
                <td className="px-4 py-3">{property.roomCount || 0}</td>
                <td className="px-4 py-3">{property.status || "Active"}</td>
              </tr>
            )} />
          </Section>

          <Section title="Destinations">
            <Table rows={destinations} columns={['Name', 'Location', 'Rating', 'Featured']} renderRow={(destination) => (
              <tr key={destination._id} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3 font-medium text-neutral-900">{destination.name}</td>
                <td className="px-4 py-3">{destination.location?.city || destination.location?.country || "Unknown"}</td>
                <td className="px-4 py-3">{destination.rating || 0}</td>
                <td className="px-4 py-3">{destination.featured ? "Yes" : "No"}</td>
              </tr>
            )} />
          </Section>

          <Section title="Bookings">
            <Table rows={bookings} columns={['User', 'Property', 'Room', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status', 'Payment']} renderRow={(booking) => (
              <tr key={booking._id} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3">{booking.user?.name || "Unknown"}</td>
                <td className="px-4 py-3">{booking.property?.name || "Unknown"}</td>
                <td className="px-4 py-3">{booking.room?.name || "Unknown"}</td>
                <td className="px-4 py-3">{new Date(booking.checkIn).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3">{new Date(booking.checkOut).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3">{booking.guests}</td>
                <td className="px-4 py-3">{currency.format(booking.totalAmount || 0)}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">{booking.paymentStatus}</td>
              </tr>
            )} />
          </Section>

          <Section title="Payments">
            <Table rows={payments} columns={['Booking', 'User', 'Property', 'Amount', 'Status', 'Payment Date']} renderRow={(payment) => (
              <tr key={payment.bookingId} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3">{payment.bookingId}</td>
                <td className="px-4 py-3">{payment.user}</td>
                <td className="px-4 py-3">{payment.property}</td>
                <td className="px-4 py-3">{currency.format(payment.amount || 0)}</td>
                <td className="px-4 py-3">{payment.paymentStatus}</td>
                <td className="px-4 py-3">{new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td>
              </tr>
            )} />
          </Section>

          <Section title="Reviews">
            <Table rows={reviews} columns={['User', 'Property', 'Rating', 'Review', 'Created date']} renderRow={(review, index) => (
              <tr key={review._id || index} className="border-t border-neutral-200 text-sm text-neutral-700">
                <td className="px-4 py-3">{review.user?.name || "Unknown User"}</td>
                <td className="px-4 py-3">{review.property?.name || "Unknown Property"}</td>
                <td className="px-4 py-3">{review.rating}</td>
                <td className="px-4 py-3">{review.comment}</td>
                <td className="px-4 py-3">{new Date(review.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            )} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Table({ rows, columns, renderRow }) {
  if (!rows || rows.length === 0) {
    return <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-500">No data available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {columns.map((column) => (
              <th key={column} className="px-4 py-3">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map((row, index) => renderRow(row, index))}</tbody>
      </table>
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

export default AdminDashboard;
