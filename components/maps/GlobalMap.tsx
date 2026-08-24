"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface GlobalMapProps {
  onMapLoad?: (map: mapboxgl.Map) => void;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  spin?: boolean;
}

function GlobalMap({
  onMapLoad,
  defaultCenter = [139.6503, 35.6762],
  defaultZoom = 1.8,
  spin = true,
}: GlobalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapInstanceLoaded] = useState(false);

  const userInteracting = useRef(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rotationRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // 🛡️ Hoist and mirror the dynamic spin controller flag to prevent per-frame re-paints
  const spinEnabledRef = useRef(spin);
  useEffect(() => {
    spinEnabledRef.current = spin;
  }, [spin]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // 🛡️ Fail Visibly: Guard against unconfigured or broken environment assets instantly
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN configuration.");
      return;
    }

    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      accessToken: token,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      projection: "globe",
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: 0,
      bearing: 0,
    });

    mapInstanceRef.current = map;

    // Allow zoom, scroll, and drag

    map.scrollZoom.enable();

    map.dragRotate.enable();

    map.dragPan.enable();

    map.touchZoomRotate.enable();

    const spinStartedRef = { current: false };

    map.on("style.load", () => {
      // 🛡️ Leaking Preventer: Guarantee exactly one requestAnimationFrame thread loops
      if (spinStartedRef.current) return;
      spinStartedRef.current = true;

      function spinGlobe() {
        if (
          spinEnabledRef.current &&
          !userInteracting.current &&
          mapInstanceRef.current
        ) {
          rotationRef.current += 0.05;

          if (rotationRef.current >= 360) rotationRef.current = 0;

          mapInstanceRef.current.easeTo({
            center: [rotationRef.current, 20],

            duration: 100,

            easing: (n) => n,
          });
        }

        animationFrameIdRef.current = requestAnimationFrame(spinGlobe);
      }

      spinGlobe();
    });

    map.on("load", () => {
      setMapInstanceLoaded(true);
      if (onMapLoad) {
        onMapLoad(map); // 🚀 Safely passes the live Mapbox reference to the parent orchestration layer!
      }
    });

    // Detect user interaction and pause spin

    const onInteractionStart = () => {
      userInteracting.current = true;

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };

    const onInteractionEnd = () => {
      spinTimeoutRef.current = setTimeout(() => {
        userInteracting.current = false;
      }, 3000); // Resume spinning after 3s
    };

    map.on("mousedown", onInteractionStart);

    map.on("mouseup", onInteractionEnd);

    map.on("wheel", onInteractionStart);

    map.on("touchstart", onInteractionStart);

    map.on("touchend", onInteractionEnd);

    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-2">
          <div className="h-5 w-5 rounded-full border-2 border-slate-800 border-t-sky-500 animate-spin" />
          <span>Synchronizing travel tracking space...</span>
        </div>
      )}
    </div>
  );
}

export default GlobalMap;
