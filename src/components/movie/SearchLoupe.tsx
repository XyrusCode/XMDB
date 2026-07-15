import { Search } from 'lucide-react';

interface SearchLoupeProps {
  value: string;
  onChange: (value: string) => void;
}

/** The loupe is what you reach for over a contact sheet. */
export const SearchLoupe = ({ value, onChange }: SearchLoupeProps) => (
  <div className="relative">
    <label htmlFor="search" className="sr-only">
      Search films
    </label>
    <Search
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-pencil"
    />
    <input
      id="search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder="Search films"
      className="w-full border-0 border-b border-sprocket bg-transparent py-3 pr-3 pl-7 text-base text-foreground placeholder:text-pencil focus:border-grease focus:outline-none"
    />
  </div>
);
