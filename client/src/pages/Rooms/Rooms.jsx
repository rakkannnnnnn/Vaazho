import { useEffect, useState } from "react";

import RoomGrid from "@/components/rooms/RoomGrid";
import { api } from "@/lib/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getRooms();
        setRooms(response.data || []);
      } catch (err) {
        setError("Unable to load rooms. Please try again.");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            VAZHO ROOMS
          </p>

          <h1 className="mt-2 text-4xl font-bold text-neutral-900 dark:text-white">
            Explore rooms
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Choose from thoughtfully designed rooms across the most loved stays in India.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">Loading rooms...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/60 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && <RoomGrid rooms={rooms} />}
      </div>
    </main>
  );
}

export default Rooms;