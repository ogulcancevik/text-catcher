import { useEffect, useMemo, useState } from 'react';
import Tesseract from 'tesseract.js';
import { useWindowSize } from 'usehooks-ts';
import CanvasOverlay from './components/CanvasOverlay';
import ImageRenderer from './components/ImageRenderer';
import Loading from './components/Loading';
import SelectedNgramBox from './components/SelectedNgramBox';
import { INgram, ISize } from './components/types';

const FOUND_COLOR = 'rgba(30,150,250, 0.25)';
function App() {
  const getImageSizes = (file: File) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    return new Promise<ISize>((resolve) => {
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      };
    });
  };
  const [file, setFile] = useState('');
  const [sizes, setSizes] = useState<ISize>({
    width: 0,
    height: 0,
  });
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedNgram, setSelectedNgram] = useState({} as INgram);
  const [ocr, setOcr] = useState<{
    text: string;
    ngrams: INgram[];
  }>({ text: '', ngrams: [] });
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsLoading(true);
    setIsUploaded(false);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFile(reader.result as string);
    };
    const { width, height } = await getImageSizes(file);
    setSizes({ width, height });
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: (m) => setProgress(Math.floor(m.progress * 100)),
    });
    setOcr({
      text: data.text,
      ngrams: data.words.map((word) => {
        return {
          text: word.text,
          x: word.bbox.x0,
          y: word.bbox.y0,
          w: word.bbox.x1 - word.bbox.x0,
          h: word.bbox.y1 - word.bbox.y0,
        };
      }),
    });
  };
  const draw = () => {
    const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // ctx.strokeStyle = 'orange';
    ctx.fillStyle = FOUND_COLOR;
    ctx.lineWidth = 2;
    ocr.ngrams.forEach((ngram) => {
      const { x, y, w, h } = ngram;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      // ctx.stroke();
      ctx.fill();
    });
    setIsLoading(false);
    setIsUploaded(true);
  };
  const undraw = () => {
    const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  useEffect(() => {
    if (ocr.ngrams.length) {
      draw();
    } else {
      undraw();
    }
  }, [ocr]);
  const resetAll = () => {
    undraw();
    setIsUploaded(false);
    setFile('');
    setOcr({ text: '', ngrams: [] });
    setProgress(0);
    setSelectedNgram({} as INgram);
  };
  const isOcrReady = useMemo(() => {
    return ocr.ngrams.length > 0;
  }, [ocr]);
  const { width, height } = useWindowSize();
  useEffect(() => {
    if (sizes.width && sizes.height) {
      const scaleX = width / sizes.width;
      const scaleY = height / sizes.height;
      setScale(Math.min(scaleX, scaleY));
    }
  }, [width, height, sizes]);
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      {!isOcrReady ? (
        <div className="absolute flex justify-center items-center z-40">
          <div className="flex flex-col text-center justify-center items-center gap-3">
            <p className="text-white text-2xl">Upload an image to start OCR</p>
            <label
              className="text-white py-2 px-4 w-max cursor-pointer rounded-xl text-xl hover:bg-white hover:text-black p-2 transition duration-300 ease-in-out"
              htmlFor="file"
            >
              Upload Image
            </label>
          </div>
          <input
            className="hidden"
            type="file"
            id="file"
            onChange={onUpload}
            accept=".png,.jpg,.jpeg"
          />
        </div>
      ) : null}
      <div
        className={`${
          isLoading ? 'hidden' : 'flex'
        } relative h-screen overflow-y-scroll w-screen flex justify-center items-center`}
        style={{ zoom: scale, width: sizes.width, height: sizes.height }}
      >
        <CanvasOverlay
          sizes={sizes}
          ocr={ocr}
          scale={scale}
          setSelectedNgram={setSelectedNgram}
        />
        <ImageRenderer src={file} sizes={sizes} />
      </div>
      <Loading progress={progress} isLoading={isLoading} />
      {isUploaded && <SelectedNgramBox selectedNgram={selectedNgram} resetAll={resetAll} />}
      <div className="absolute bottom-0 right-0 p-4 text-white">
        <p>OCR by Tesseract.js</p>
        <p>
          Created by{' '}
          <a href="https://www.ogulcancevik.com" target="_blank">
            Oğulcan Çevik
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
