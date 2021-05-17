export type ObjectMapType<T> = {[identifier:string]: T}

export default function arrayToObjectMap<T>(arr: T[], key: string): ObjectMapType<T>  {
  return arr.reduce((acc, element) => {
    const identifier = element[key]
    if(acc[identifier] !== undefined) {
      console.log(`Identifier ${identifier} already exists for key ${key}`)
    }
    acc[identifier] = element
    return acc
  },{})
}