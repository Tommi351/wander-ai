import { OriginForm } from "./OriginForm";
import { DestinationForm } from "./DestinationForm";
import GroupSizeInput from "./GroupSizeInput";
import BudgetPicker from "./BudgetPicker";
import DurationPicker from "./DurationPicker";
import InterestsChips from "./InterestsChips";
import TravelPreferencesDashboard from "./TravelPreferencesDashBoard";
import FinalSummaryTicket from "./FinalSummaryTicket";
import {
  PlannerSubmission,
  PlannerUIEvent,
  PlannerUIRendererProps,
} from "@/types/global";

type PlannerComponentProps = {
  data: PlannerSubmission;
  onSubmit: (event: PlannerUIEvent) => void;
};

const components: Record<
  PlannerUIRendererProps["type"],
  React.ComponentType<PlannerComponentProps>
> = {
  origin: OriginForm,
  destination: DestinationForm,
  groupSize: GroupSizeInput,
  budget: BudgetPicker,
  duration: DurationPicker,
  interests: InterestsChips,
  travelPreferences: TravelPreferencesDashboard,
  final: FinalSummaryTicket,
};

export default function PlannerUIRenderer({
  type,
  data,
  onSubmit,
}: PlannerUIRendererProps) {
  const Component = components[type];

  if (!Component) return null;

  // 3. Relax the strict cross-intersection type check for the dynamic rendering boundary
  const RenderableComponent =
    Component as React.ComponentType<PlannerComponentProps>;

  // 4. Spread both properties cleanly into the underlying element
  return <RenderableComponent data={data} onSubmit={onSubmit} />;
}
