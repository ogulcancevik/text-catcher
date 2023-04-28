interface CanvasOverlayProps {
  sizes: { width: number; height: number };
  ocr: {
    text: string;
    ngrams: { text: string; x: number; y: number; w: number; h: number }[];
  };
  scale: number;
  setSelectedNgram: (ngram: {
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }) => void;
}
const CanvasOverlay = (props: CanvasOverlayProps) => {
  const { sizes, ocr, scale, setSelectedNgram } = props;
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = canvas.getBoundingClientRect();
    return {
      x: e.clientX - x * scale,
      y: e.clientY - y * scale,
    };
  };
  const handleClickNgram = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    // get the clicking ngram
    const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getMousePos(e) as { x: number; y: number };
    const ngram = ocr.ngrams.find((ngram) => {
      const { x: ngramX, y: ngramY, w, h } = ngram;
      return (
        x > ngramX * scale &&
        x < (ngramX + w) * scale &&
        y > ngramY * scale &&
        y < (ngramY + h) * scale
      );
    });
    if (!ngram) return;
    // set the selected ngram and this position opening absolute box
    setSelectedNgram(ngram);
  };
  return (
    <canvas
      onClick={handleClickNgram}
      className="absolute z-10"
      id="ocr-canvas"
      width={sizes.width}
      height={sizes.height}
    ></canvas>
  );
};

export default CanvasOverlay;
