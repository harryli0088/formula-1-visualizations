export default function arrayToObjectMap(arr: any[], key: string) {
  return arr.reduce((acc, element) => {
    const identifier = element[key]
    if(acc[identifier] !== undefined) {
      console.log(`Identifier ${identifier} already exists for key ${key}`)
    }
    acc[identifier] = element
    return acc
  },{})
}