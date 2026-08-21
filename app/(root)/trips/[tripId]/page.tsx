import { getTripById } from "@/lib/queries/trip.queries";
import { notFound } from "next/navigation";
import { TimelineDayList } from "@/components/itinerary/TimelineDayList"; // Upcoming Phase 5 layout component
import { ItineraryMapView } from "@/components/maps/ItineraryMapView"; // Upcoming Phase 6 layout component
import { StickyDashboardHeader } from "@/components/itinerary/StickyDashboardHeader";

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};

const TripDetails = async ({ params }: Props) => {
  const { tripId } = await params;

  // 1. Fetch the completely synchronized, Zod-validated Trip DTO from your query layer
  const trip = await getTripById(tripId);

  if (!trip) {
    return notFound();
  }

  // Fallback guard: If they try to access a dashboard for a trip that hasn't generated yet, bounce them back
  if (trip.status !== "COMPLETED" || !trip.itineraryJson) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500 italic">
        This itinerary is still compiling on Track A. Please complete the
        conversation.
      </div>
    );
  }

  const { itineraryJson } = trip;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* LEFT LANE: Chronological Itinerary Timeline Panel (Phase 5 Workspace) */}
      <div className="w-full md:w-[45%] h-full overflow-y-auto border-r border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <StickyDashboardHeader
            itinerary={itineraryJson}
            tripTitle={trip.title}
          />
        </div>

        {/* Chronological Loop Engine */}
        <TimelineDayList timeline={itineraryJson.timeline} />
      </div>

      {/* RIGHT LANE: Interactive Geo-Anchored Map Frame Panel (Phase 6 Workspace) */}
      <div className="hidden md:block md:w-[55%] h-full bg-slate-100">
        <ItineraryMapView timeline={itineraryJson.timeline} />
      </div>
    </div>
  );
};

export default TripDetails;
