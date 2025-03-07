import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Function to render dots-style pagination
  const renderDots = () => {
    const dots = [];
    
    // Previous button
    dots.push(
      <button
        key="prev"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full transition-colors",
          currentPage === 1 
            ? "text-gray-400 cursor-not-allowed" 
            : "text-white hover:bg-gray-700"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    );
    
    // Dots
    for (let i = 1; i <= totalPages; i++) {
      dots.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "flex items-center justify-center h-3 w-3 mx-1 rounded-full transition-all duration-200",
            currentPage === i
              ? "bg-white scale-125"
              : "bg-gray-500 hover:bg-gray-400"
          )}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? "page" : undefined}
        />
      );
    }
    
    // Next button
    dots.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full transition-colors",
          currentPage === totalPages 
            ? "text-gray-400 cursor-not-allowed" 
            : "text-white hover:bg-gray-700"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    );
    
    return dots;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center">
        {/* Logo or content in the center */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-white flex items-center justify-center text-white">
          Logo
        </div>
        
        {/* Navigation arrows and dots positioned absolutely */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {renderDots()}
        </div>
      </div>
      
      {/* Dots indicator below */}
      <div className="flex items-center justify-center space-x-2 text-white">
        <span className="text-blue-400">◀</span>
        <span>Pagination Dots</span>
        <span className="text-blue-400">▶</span>
      </div>
    </div>
  );
};

export default Pagination;