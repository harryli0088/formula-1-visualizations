//https://www.mediawiki.org/wiki/API:Images
export default function fetchWikipediaImages(title: string) {
  let url = "https://en.wikipedia.org/w/api.php?origin=*"
  const params = {
      action: "query",
      prop: "pageimages",
      titles: title,
      format: "json",
      piprop: "original",
  }

  Object.keys(params).forEach((key) => url += `&${key}=${params[key]}`)

  return fetch(url)
  .then(res => res.json())
  .then(data => {
    return Object.values(data.query.pages).map(
      p => p.original.source
    )
  })
}