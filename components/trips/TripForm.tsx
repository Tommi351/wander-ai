"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTripSchema, CreateTripFormInput } from "@/lib/validations";
import { createTrip } from "@/lib/actions/trip.action";

async function onSubmit(data: CreateTripFormInput) {
  const result = await createTrip(data);

  if (!result.success) {
    // show toast later in Phase 3
    return;
  }

  // redirect later in Phase 3
}

const TripForm = ({
  defaultValues,
}: {
  defaultValues?: Partial<CreateTripFormInput>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTripFormInput>({
    resolver: zodResolver(CreateTripSchema),
    defaultValues, // 👈 Hook form initializes with these
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Trip Title" />
        <input {...register("destination")} placeholder="Trip Destination" />
        <input
          {...register("origin")}
          placeholder="Where are you going from?"
        />
        <input
          type="number"
          {...register("budget")}
          placeholder="What is the date?"
        />

        {errors.title && <p>{errors.title.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
