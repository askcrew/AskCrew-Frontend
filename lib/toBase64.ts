/**
 * Use FileReader to Convert Image to Base64 to be able to save it in local storage and keep it displayed
 * even on refreshing the page
 * @param file
 * @returns String
 */
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
