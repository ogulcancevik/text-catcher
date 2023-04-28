import { useMemo } from 'react';
import { INgram } from './types';

const SelectedNgramBox = ({
  selectedNgram,
  resetAll,
}: {
  selectedNgram: INgram;
  resetAll: () => void;
}) => {
  const isHaveNgram = useMemo(() => {
    return Object.keys(selectedNgram).length > 0;
  }, [selectedNgram]);
  return (
    <div
      className="absolute w-64 p-4 rounded-md shadow-md top-0 right-0 bg-gray-900 text-white flex flex-col items-start gap-4"
      style={{ zIndex: 50 }}
    >
      {isHaveNgram ? (
        <>
          <h1>Selected Ngram</h1>
          <h2>text: {selectedNgram.text}</h2>
          <h2>
            x: {selectedNgram.x}, y: {selectedNgram.y}
          </h2>
          <h2>
            w: {selectedNgram.w}, h: {selectedNgram.h}
          </h2>
        </>
      ) : (
        'No Ngram Selected'
      )}
      <div className='cursor-pointer' onClick={resetAll}> Reset and Upload New Image</div>
    </div>
  );
};

export default SelectedNgramBox;
