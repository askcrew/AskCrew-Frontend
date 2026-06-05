export function base64ToFile(base64: string, filename: string): File {
  console.log({ base64 });
  const arr = base64.split(",");
  const mime = extractMimeType(base64) || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  console.log(new File([u8arr], filename, { type: mime }));
  return new File([u8arr], filename, { type: mime });
}

export function extractMimeType(base64: string): string | null {
  const match = base64.match(/^data:(.*?);base64,/);
  return match ? match[1] : null;
}
