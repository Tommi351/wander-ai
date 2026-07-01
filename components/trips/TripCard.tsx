import { type TripCard } from "@/types/global";
import { CalendarDays, MapPin, Wallet } from "lucide-react";
import { MoreOptionsMenu } from "./MoreOptionsMenu";

const TripCard = ({ trip }: TripCard) => {
  const start = trip.startDate ? new Date(trip.startDate) : null;
  const end = trip.endDate ? new Date(trip.endDate) : null;
  const totalDays =
    start && end
      ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : null;

  return (
    <div className="group block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">{trip.title}</h2>

        <MoreOptionsMenu tripId={trip.id} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {trip.destination}
        </div>

        {start && end && (
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
            {totalDays && (
              <span className="ml-auto font-medium">
                {totalDays} day{totalDays > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {trip.budget && (
          <div className="flex items-center gap-2">
            <Wallet size={16} />${trip.budget.toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium
          ${
            trip.status === "DRAFT"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {trip.status}
        </span>

        <span className="text-xs text-gray-500">
          Updated {trip.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default TripCard;
