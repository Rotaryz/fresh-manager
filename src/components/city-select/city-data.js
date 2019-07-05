import source from 'china-division/dist/pca-code.json'
let s = JSON.parse(JSON.stringify(source).replace(/children/g, 'sub'))
let newS = s.map((city) => {
  let citySub = city.sub.map((area) => {
    area.sub.unshift({name: '请选择'})
    return area
  })
  citySub.unshift({name: '请选择市', sub: []})
  city.sub = citySub
  return city
})
newS.unshift({name: '请选择省', sub: [{name: '请选择市', sub: [{name: '请选择'}]}], type: 1})
export default newS
