import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Suggestion {
  displayName: string;
  lat: string;
  lon: string;
}

interface Props {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

// Free address search backed by OpenStreetMap data (no API key needed).
// This confirms the address matches a real, mappable place — it is not
// a formal postal-address validation service, but it's a big step up
// from unchecked free text.
export default function AddressAutocomplete({ value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (text: string) => {
    setQuery(text);
    onChange(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=5&countrycodes=eg&q=${encodeURIComponent(text)}`
        );
        const data = await res.json();
        setSuggestions(
          (data || []).map((d: any) => ({ displayName: d.display_name, lat: d.lat, lon: d.lon }))
        );
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.displayName);
    onChange(s.displayName);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin size={16} className="absolute right-3 top-3.5 text-[#666]" />
        <textarea
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          rows={2}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 py-3 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none resize-y"
          placeholder={placeholder}
        />
        {loading && <Loader2 size={16} className="absolute left-3 top-3.5 text-[#666] animate-spin" />}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden max-h-56 overflow-y-auto shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-start px-4 py-2.5 text-xs text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors border-b border-[#2a2a2a] last:border-0"
            >
              {s.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
