import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

const Loading = ({ progress, isLoading }: { progress: number , isLoading: boolean }) => {
  const progressString = useMemo(() => {
    return `${progress}%` === '100%' || `${progress}%` === '0%' ? '' : `${progress}%`;
  }, [progress]);
  return (
    <AnimatePresence>
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50">
          <motion.div
            className="h-screen absolute top-0 right-0 bottom-0 bg-black flex justify-center items-center"
            initial={{ width: '0vw' }}
            animate={{ width: '50vw' }}
            exit={{ width: '0vw' }}
            transition={{ duration: 0.5 }}
          />
          <div className="text-white z-10 absolute flex w-full h-full justify-center items-center text-4xl">
            {progressString}
          </div>
          <motion.div
            className="h-screen absolute top-0 left-0 bottom-0 bg-black flex justify-center items-center"
            initial={{ width: '0vw' }}
            animate={{ width: '50vw' }}
            exit={{ width: '0vw' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
