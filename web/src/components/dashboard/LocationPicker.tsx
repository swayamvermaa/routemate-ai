"use client";

import {
  Loader2,
  LocateFixed,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectedLocation = {
  address: string;
  lat: number;
  lng: number;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type LocationPickerProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (location: SelectedLocation | null) => void;
};

export default function LocationPicker({
  label,
  placeholder = "Search a place...",
  value,
  onChange,
}: LocationPickerProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleQueryChange(nextValue: string) {
    setQuery(nextValue);
    setShowResults(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!nextValue.trim()) {
      setResults([]);
      onChange(null);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(nextValue);
    }, 500);
  }

  async function searchPlaces(searchQuery: string) {
    try {
      setSearching(true);

      const params = new URLSearchParams({
        q: searchQuery.trim(),
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        countrycodes: "in",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to search locations."
        );
      }

      const data =
        (await response.json()) as NominatimResult[];

      setResults(data);
    } catch (error) {
      console.error(
        "Location search error:",
        error
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectLocation(result: NominatimResult) {
    const selectedLocation: SelectedLocation = {
      address: result.display_name,
      lat: Number(result.lat),
      lng: Number(result.lon),
    };

    setQuery(result.display_name);
    setResults([]);
    setShowResults(false);

    onChange(selectedLocation);
  }

  function clearLocation() {
    setQuery("");
    setResults([]);
    setShowResults(false);
    onChange(null);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocating(true);
    setShowResults(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const params = new URLSearchParams({
            lat: String(lat),
            lon: String(lng),
            format: "jsonv2",
            addressdetails: "1",
          });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to detect your current location."
            );
          }

          const data = (await response.json()) as {
            display_name?: string;
          };

          const address =
            data.display_name ||
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          const selectedLocation: SelectedLocation = {
            address,
            lat,
            lng,
          };

          setQuery(address);
          onChange(selectedLocation);
        } catch (error) {
          console.error(
            "Current location error:",
            error
          );

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const fallbackLocation: SelectedLocation = {
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat,
            lng,
          };

          setQuery(fallbackLocation.address);
          onChange(fallbackLocation);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation permission/error:",
          error
        );

        setLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else {
          alert(
            "Unable to detect your current location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative mt-2">
        <MapPin
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            handleQueryChange(event.target.value)
          }
          onFocus={() => {
            if (query.trim()) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-24 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={clearLocation}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear location"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Use current location"
            aria-label="Use current location"
          >
            {locating ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <LocateFixed size={16} />
            )}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {searching && (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-slate-500">
              <Loader2
                size={17}
                className="animate-spin text-blue-600"
              />

              <span>
                Searching locations...
              </span>
            </div>
          )}

          {!searching &&
            query.trim() &&
            results.length === 0 && (
              <div className="px-4 py-5 text-center">
                <Search
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-medium text-slate-700">
                  No locations found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try searching with a different place name.
                </p>
              </div>
            )}

          {!searching && results.length > 0 && (
            <div className="max-h-72 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() =>
                    selectLocation(result)
                  }
                  className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-blue-50"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-5 text-slate-800">
                      {getPrimaryPlaceName(
                        result.display_name
                      )}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-400">
                      {result.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5">
            <p className="text-[10px] text-slate-400">
              Location data © OpenStreetMap contributors
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getPrimaryPlaceName(
  displayName: string
) {
  return displayName.split(",")[0]?.trim() || displayName;
}
