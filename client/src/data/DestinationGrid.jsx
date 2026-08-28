import DestinationCard from "./DestinationCard";

function DestinationGrid({ destinations }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  );
}

export default DestinationGrid;