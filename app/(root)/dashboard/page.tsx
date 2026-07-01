import { requireUser } from "@/auth";
import Link from "next/link";

type Trip = {
  id: string;
  title: string;
  destination: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  updatedAt: string;
};

const mockTrips: Trip[] = [
  {
    id: "1",
    title: "Paris Adventure",
    destination: "Paris, France",
    status: "DRAFT",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Tokyo Explorer",
    destination: "Tokyo, Japan",
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
];

const Dashboard = async () => {
  const user = await requireUser();
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* HEADER SECTION */}
      <section>
        <h1 className="text-3xl font-bold text-black">
          Welcome back, {user?.fullName || "Traveler"} 👋
        </h1>
        <p className="text-gray-500 mt-1">Ready for your next adventure?</p>
      </section>

      {/* PRIMARY CTA */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Trips</h2>
          <p className="text-sm text-gray-500">Continue where you left off</p>
        </div>

        <Link
          href="/trips/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Create New Trip
        </Link>
      </section>

      {/* TRIP GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTrips.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 border rounded-lg p-10">
            No trips yet. Create your first journey ✈️
          </div>
        ) : (
          mockTrips.map((trip) => (
            <div
              key={trip.id}
              className="border rounded-xl p-4 hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{trip.title}</h3>
                  <p className="text-sm text-gray-500">{trip.destination}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    trip.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : trip.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Updated: {new Date(trip.updatedAt).toLocaleDateString()}
              </p>

              <Link
                href={`/trips/${trip.id}`}
                className="inline-block mt-3 text-sm text-blue-600 hover:underline"
              >
                Open Trip →
              </Link>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
