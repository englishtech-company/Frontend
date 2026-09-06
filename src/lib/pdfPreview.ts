import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function renderPdfFirstPage(
  blob: Blob,
  maxWidth = 320
): Promise<string> {
  const data = await blob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / viewport.width;
  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não foi possível preparar a visualização do PDF.");
  }

  canvas.width = Math.floor(scaledViewport.width);
  canvas.height = Math.floor(scaledViewport.height);

  await page.render({
    canvasContext: context,
    viewport: scaledViewport,
  }).promise;

  return canvas.toDataURL("image/jpeg", 0.88);
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Não foi possível ler o arquivo."));
    };

    reader.onerror = () => {
      reject(new Error("Não foi possível ler o arquivo."));
    };

    reader.readAsDataURL(blob);
  });
}
