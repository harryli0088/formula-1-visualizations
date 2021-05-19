export type BarChartDataType = {
  keys: string[],
  label: string, //the overall label for this entry
  values: number[],
}

export type ScaledBarChartDataType = BarChartDataType & {
  displayValues: number[],
  labelDisplayValue: number,
  labelValue: number,
  lastSums: number[],
}

export type RectDataType = {
  height: number,
  width: number,
  x: number,
  y: number,
}

export type ExtendedBarChartDataType = (
  ScaledBarChartDataType 
  & RectDataType 
  & {
    pixelValues: RectDataType[],
  }
)

export type StackDataType = {
  label: string,
  labelIndex: number,
  key: string,
  keyIndex: number,
  value: number,
  lastSum: number,
}