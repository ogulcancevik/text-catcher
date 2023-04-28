import { ISize } from './types';

const ImageRenderer = ({
  src,
  sizes,
}: {
  src: string;
  sizes: ISize;
}) => {
  if (src)
    return (
      <img
        className="absolute"
        style={{
          width: sizes.width,
          height: sizes.height,
        }}
        src={src}
        alt="image"
      />
    );
  return null;
};

export default ImageRenderer;
