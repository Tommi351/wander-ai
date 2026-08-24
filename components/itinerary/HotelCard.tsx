"use client";

import { HotelItem } from "@/lib/validations";
import { Hotel } from "lucide-react";

type Props = {
  item: HotelItem;
};

const HotelCard = ({ item }: Props) => {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
      {/* Top Banner Row */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Hotel className="mt-1 h-5 w-5 text-emerald-600" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Accommodation Anchor
            </span>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              Check-In Flow: {item.time}
            </p>
          </div>
        </div>

        <span className="text-[9px] bg-emerald-50 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-md text-emerald-700 uppercase tracking-wide">
          Suggested Stay
        </span>
      </div>

      {/* Main Content Body */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug truncate">
            {item.title}
          </h4>

          {/* Nested Location Rendering Vector */}
          <div className="flex items-start space-x-1 pt-0.5">
            <span className="text-xs shrink-0 mt-0.5">📍</span>
            <p className="text-xs text-slate-500 font-medium leading-relaxed wrap-break-word">
              {item.location?.address || "Address provisioning pending..."}
            </p>
          </div>

          <div className="flex gap-1.5 pt-2">
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
              {item.nights} Night(s)
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
              Checkout: {item.checkOut || "11:00 AM"}
            </span>
          </div>
        </div>

        {/* Financial Column Block */}
        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Estimated Cost:
          </span>
          <span className="text-lg font-black text-slate-800 tracking-tight block mt-0.5">
            ${item.cost === 0 ? "FREE" : `$${item.cost}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
