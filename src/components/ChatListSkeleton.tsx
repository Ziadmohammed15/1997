import React from 'react';

const ChatListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="card-glass p-3 flex items-center animate-pulse">
          <div className="w-14 h-14 rounded-full bg-secondary-200 dark:bg-secondary-700"></div>
          
          <div className="mr-3 flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
              <div className="h-3 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            </div>
            <div className="h-3 w-3/4 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListSkeleton;