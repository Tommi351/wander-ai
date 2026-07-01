import TripList from "@/components/trips/TripList";
import { getTrips } from "@/lib/queries/trip.queries";

const TripDashboard = async () => {
  const trips = await getTrips();
  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-black text-3xl font-bold">Your trips</h1>
      </div>

      <TripList trips={trips} />
    </div>
  );
};

export default TripDashboard;
