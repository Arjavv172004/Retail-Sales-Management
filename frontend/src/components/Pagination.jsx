import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft"
    >
      <motion.button
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      <div className="flex items-center space-x-1">
        {pageNumbers[0] > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(1)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                1 === currentPage
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
              }`}
            >
              1
            </motion.button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-gray-400 font-bold">...</span>
            )}
          </>
        )}

        {pageNumbers.map(pageNum => (
          <motion.button
            key={pageNum}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
              pageNum === currentPage
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-110'
                : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
            }`}
          >
            {pageNum}
          </motion.button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-400 font-bold">...</span>
            )}
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(totalPages)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                totalPages === currentPage
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
              }`}
            >
              {totalPages}
            </motion.button>
          </>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default Pagination;

