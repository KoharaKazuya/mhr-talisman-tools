import { useDropzone } from "react-dropzone";
import AspectRatio from "../../aspect-ratio";
import classes from "./dropzone.module.css";

type Props = {
  onDrop?: (acceptedFiles: File[]) => void;
};

export default function Dropzone({ onDrop }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <AspectRatio width={16} height={9}>
      <div className={classes.zone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>ここにスキャンしたいファイルをドロップしてください</p>
        ) : (
          <p>
            ここにスキャンしたいファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください
          </p>
        )}
      </div>
    </AspectRatio>
  );
}
