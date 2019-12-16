//转2019-12-12T12:00:00
const timeFormat = (input) => {
  if (!input) return
  return new Date(+new Date(input) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
}
// //arr=[1,2] 转成 '新闻,资讯'   obj={1:'新闻',2:'资讯'}
// const arrayIdsToWords = (arr, obj) => {
//   let str = arr.map(item => obj[item])
//   return str.join(",")
// }

const idToWords = (id, list) => {
  if (id !==null && list.length > 0) {
    let str = list.find(o => id == o.id)
    return str.name
  }
}


//arr=[1,2] 转成 '新闻,资讯'   obj=[{id:1,name:'新闻'},{id:1,name:'资讯'}]
const arrayIdsToWords = (arr, list) => {
  if (Object.prototype.toString.call(arr) === '[object Array]' && list.length > 0) {
    let str = arr.map(item => {
      let a = list.find(o => item == o.id)
      return a.name
    })
    return str.join(",")
  }
}


export {
  timeFormat,
  idToWords,
  arrayIdsToWords,
}
