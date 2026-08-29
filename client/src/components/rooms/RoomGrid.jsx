import RoomCard from "./RoomCard";

function RoomGrid({ rooms = [] }) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          No rooms available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room._id || room.slug} room={room} />
      ))}
    </div>
  );
}

export default RoomGrid;
