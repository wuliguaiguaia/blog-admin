export default function flattern(arr: any, depth = 1) {
  if (!Array.isArray(arr)) return [arr]
  return arr.reduce((res, item) => {
    if (Array.isArray(item)) {
      if (depth === 1) {
        res.push(...item)
      } else {
        res.push(...flattern(item, depth - 1))
      }
    } else {
      res.push(item)
    }
    return res
  }, [])
}


export const flatternObj = (arr: any, depth = 1) => {
  if (!Array.isArray(arr) && arr.children?.length === 0) return [arr]
  return arr.reduce((res: any[], item: { children: any }) => {
    const {children} = item
    if (children?.length) {
      res.push(item)
      if (depth === 1) {
        res.push(...children)
      } else {
        res.push(...flattern(children, depth - 1))
      }
    } else {
      res.push(item)
    }
    return res
  }, [])
}
