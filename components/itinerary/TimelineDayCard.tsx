import { ItineraryDay } from "@/lib/validations";
import { TimelineItemRenderer } from "./TimelineItemRenderer";

type Props = {
  day: ItineraryDay;
};

const getSection = (time: string) => {
  const hour = Number(time.split(":")[0]);

  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

const TimelineDayCard = ({ day }: Props) => {
  const grouped = {
    Morning: day.items.filter((i) => getSection(i.time) === "Morning"),
    Afternoon: day.items.filter((i) => getSection(i.time) === "Afternoon"),
    Evening: day.items.filter((i) => getSection(i.time) === "Evening"),
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-3">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">
          Day {day.dayNumber}
        </h2>

        <p className="text-sm font-medium text-slate-500">{day.date}</p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([section, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={section}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                {section}
              </h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <TimelineItemRenderer key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineDayCard;
