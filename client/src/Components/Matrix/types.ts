export type HeadingType = { name: string, count: number }

export type CellDataType = {
  c: number, //column index
  r: number, //row index
  z: number, //cell value
}

export type OrdersType = {
  columns: {
    [orderBy:string]: number[],
  },
  rows: {
    [orderBy:string]: number[],
  },
}