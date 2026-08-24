// components/maps/ItineraryMapView.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ItineraryDay } from "@/lib/validations";
import GlobalMap from "./GlobalMap";
import mapboxgl from "mapbox-gl";

interface ItineraryMapViewProps {
  timeline: ItineraryDay[];
}

export function ItineraryMapView({ timeline }: ItineraryMapViewProps) {
  const [shouldSpin, setShouldSpin] = useState(true);
  const [activeMap, setActiveMap] = useState<mapboxgl.Map | null>(null);

  // 🛡️ Memory Guard Ref: Tracks mounted elements to completely stop duplicate pin stack leaks
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const handleMapReady = (mapInstance: mapboxgl.Map) => {
    setActiveMap(mapInstance);

    // 🔬 Target Coordinate Space:
    // Tomorrow, we will map across your 'timeline' array text addresses right here
    // and call Mapbox markers directly using this 'mapInstance' tracker object reference!
  };

  useEffect(() => {
    if (!activeMap || !timeline || timeline.length === 0) return;

    // Hoist token assignment tracking directly to step-out early from missing environment profiles
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) return;

    let cancelled = false;
    const controller = new AbortController();

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 2. EXTRACT TRACK A TEXT STRINGS: Collect all concept addresses across the entire week
    const uniqueAddresses = new Set<string>();
    timeline.forEach((day) => {
      day.items.forEach((item) => {
        if ("location" in item && item.location?.address)
          uniqueAddresses.add(item.location.address);
      });
    });

    // 3. ASYNC GEOLOCATION RESOLVER LOOP
    const resolveAndRenderPins = async () => {
      const addressesArray = Array.from(uniqueAddresses);
      const bounds = new mapboxgl.LngLatBounds();
      let validPinsCount = 0;

      for (const address of addressesArray) {
        if (cancelled) return;

        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodedAddress}.json?access_token=${token}`;
        try {
          // Fire a direct background request to Mapbox's edge forward-geocoding engine
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) continue;
          const data = await response.json();
          if (cancelled) return;

          // Extract the [longitude, latitude] array from the first verified search index
          const feature = data.features?.[0];
          if (!feature?.geometry?.coordinates) continue;

          const [lng, lat] = feature.geometry.coordinates;

          // 4. INJECT MARKER ELEMENT: Build a custom themed tracking pin onto the globe
          const marker = new mapboxgl.Marker({
            color: "#38bdf8", // Premium sky-400 color token tracking your layout styles
          })
            .setLngLat([lng, lat])
            .addTo(activeMap);

          // Track this marker reference inside our layout memory array guard
          markersRef.current.push(marker);
          bounds.extend([lng, lat]);
          validPinsCount++;
        } catch (err) {
          if (controller.signal.aborted) return;
          console.error(
            `Failed client-side geocoding resolution for: ${address}`,
            err,
          );
        }
      }

      // 5. VIEWPORT FOCUS RE-CENTER MATRIX
      // If we mapped multiple pins cleanly, automatically adjust the camera bounding box
      // to center directly over the target destination bounds smoothly!
      if (!cancelled && validPinsCount > 0) {
        // 🚀 THE SYSTEM RECALIBRATION: Turn off the spin loop right before flying the camera!
        setShouldSpin(false);

        activeMap.fitBounds(bounds, {
          padding: 64,
          maxZoom: 12,
          duration: 2000,
        });
      }
    };

    resolveAndRenderPins();

    // 🛡️ Cleanup: Terminate markers instantly on component unmount to maintain strict system hygiene
    return () => {
      cancelled = true;
      controller.abort();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [activeMap, timeline]);
  return (
    <div className="w-full h-full relative">
      <GlobalMap onMapLoad={handleMapReady} spin={shouldSpin} />
    </div>
  );
}
