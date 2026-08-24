import { ItineraryDay } from "@/lib/validations";
import TimelineDayCard from "@/components/itinerary/TimelineDayCard";

type Props = {
  timeline: ItineraryDay[];
};

const TimelineDayList = ({ timeline }: Props) => {
  return (
    <div className="space-y-8">
      {timeline.map((day) => (
        <TimelineDayCard key={day.dayNumber} day={day} />
      ))}
    </div>
  );
};

export default TimelineDayList;
