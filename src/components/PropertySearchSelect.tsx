import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown } from 'lucide-react';
import { PROPERTY_TYPES, PropertyType } from '../constants/property';
import { cn } from '../lib/utils';

interface PropertySearchSelectProps {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}

export const PropertySearchSelect: React.FC<PropertySearchSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = PROPERTY_TYPES.filter(type => 
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={cn(
          "w-full glass rounded-2xl flex items-center border border-black/5 p-4 transition-all cursor-text",
          isOpen ? "border-primary bg-white/60 shadow-lg" : "bg-white/40 hover:bg-white/60 hover:border-black/10"
        )}
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5 text-primary/40 mr-3 shrink-0" />
        <input 
          type="text"
          value={isOpen ? searchQuery : value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery(''); // Reset search on focus to show all options
          }}
          placeholder="Ex: Appartement, Maison..."
          className="w-full bg-transparent border-none outline-none font-bold text-primary placeholder:text-primary/40 placeholder:font-medium"
        />
        <ChevronDown className={cn("w-5 h-5 text-primary/40 ml-3 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 w-full glass rounded-2xl border border-white/20 shadow-xl overflow-hidden z-50 origin-top max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              <ul className="py-2">
                {filteredOptions.map((option) => (
                  <li 
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={cn(
                      "px-5 py-3 cursor-pointer transition-colors font-medium text-sm flex items-center justify-between",
                      value === option ? "bg-primary/5 text-primary font-bold" : "hover:bg-black/5 text-neutral-dark/80 hover:text-primary"
                    )}
                  >
                    <span>{option}</span>
                    {value === option && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5 text-center text-sm font-medium text-primary/40">
                Aucun type de bien trouvé pour "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
