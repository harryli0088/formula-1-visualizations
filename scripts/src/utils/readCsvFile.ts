const csv = require('csv-parser')
const fs = require('fs')

export default function readFile(fileName: string) {
  const results: any[] = [];

  return new Promise<any[]>((resolve, reject) => {
    fs.createReadStream(`data/${fileName}`)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
    resolve(results)
    });
  })
}