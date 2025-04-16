import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, X, Calendar } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface ServiceScheduleProps {
  schedule: TimeSlot[];
  onUpdateSchedule: (schedule: TimeSlot[]) => void;
}

const ServiceSchedule: React.FC<ServiceScheduleProps> = ({
  schedule,
  onUpdateSchedule
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    day: '',
    startTime: '',
    endTime: ''
  });

  const days = [
    'السبت',
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة'
  ];

  const handleAddSlot = () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) return;

    const newSchedule = [
      ...schedule,
      {
        id: Math.random().toString(),
        day: newSlot.day,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime
      }
    ];

    onUpdateSchedule(newSchedule);
    setNewSlot({ day: '', startTime: '', endTime: '' });
    setShowAddForm(false);
  };

  const handleRemoveSlot = (id: string) => {
    const newSchedule = schedule.filter(slot => slot.id !== id);
    onUpdateSchedule(newSchedule);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold dark:text-white">مواعيد العمل</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="btn-primary px-3 py-2 text-sm"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.div layout className="space-y-3">
        {schedule.map((slot) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-primary-500 ml-2" />
              <span className="dark:text-white">{slot.day}</span>
              <span className="mx-2 text-secondary-400">|</span>
              <Clock className="w-4 h-4 text-secondary-400 ml-1" />
              <span className="text-secondary-600 dark:text-secondary-300">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <button
              onClick={() => handleRemoveSlot(slot.id)}
              className="p-1 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-full"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </motion.div>
        ))}

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg"
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  اليوم
                </label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="input-field"
                >
                  <option value="">اختر اليوم</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  من
                </label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  إلى
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary px-4 py-2 text-sm"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddSlot}
                className="btn-primary px-4 py-2 text-sm"
              >
                إضافة
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ServiceSchedule;