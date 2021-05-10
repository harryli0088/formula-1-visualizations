import { parse } from 'papaparse'

export default function parseCsvFile(file: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    parse(`${window.location.href}${file}`, {
      header: true,
      download: true,
      worker: true,
      complete: function(results) {
        resolve(results.data);
      }
    })
  });
}