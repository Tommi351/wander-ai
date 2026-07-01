import TripForm from "@/components/trips/TripForm";
import { CreateTripFormInput } from "@/lib/validations";

const CreateNewTrip = () => {
  const initialFormValues: Partial<CreateTripFormInput> = {
    title: "My Awesome Trip", // Example server-fetched or hardcoded default
    // description: "",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10">
      <div>
        <TripForm defaultValues={initialFormValues} />
      </div>
      <div>
        Maps and Itinerary to Display. 🗺️ Your itinerary will appear here.
        Generate it with AI in Phase 3-4.
      </div>
    </div>
  );
};

export default CreateNewTrip;
