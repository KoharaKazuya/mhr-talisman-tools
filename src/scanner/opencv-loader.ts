let promise: Promise<void> | undefined;

export function loadOpenCV(): Promise<void> {
  if (!promise)
    promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = resolve;
      script.onerror = reject;
      script.src = "/opencv-4.5.2.js";
      document.head.appendChild(script);
    }).then(
      () =>
        new Promise((resolve) => {
          cv["onRuntimeInitialized"] = resolve;
        })
    );
  return promise;
}

declare global {
  var cv: any;
}
