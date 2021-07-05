export const downloadFile = (object: Blob, filename: string) => {
  const url = window.URL.createObjectURL(object);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
