import React from 'react';

const ChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
            <div 
              className={`rounded-2xl p-3 animate-pulse ${
                index % 2 === 0 
                  ? 'bg-white dark:bg-secondary-800 rounded-bl-none' 
                  : 'bg-primary-300 dark:bg-primary-700 rounded-br-none'
              }`}
            >
              <div className="h-4 w-32 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
              {index % 3 === 0 && (
                <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-600 rounded mt-2"></div>
              )}
            </div>
            <div className={`flex items-center mt-1 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className="h-3 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            </div>
          </div>
          
          {index % 2 === 0 && (
            <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 animate-pulse ml-2 order-1"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;