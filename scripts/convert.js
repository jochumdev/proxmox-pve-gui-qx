const yaml = require('js-yaml')
const fs = require('fs')

let res = {}
let doc = yaml.safeLoad(fs.readFileSync('icons.yml', 'utf8'))
doc.icons.forEach((iconDsc) => {
  res[iconDsc.id] = iconDsc.unicode
  
  if (res.aliases) {
    res.aliases.forEach((alias) => {
      res[alias] = iconDsc.unicode
    })
  }
})

fs.writeFileSync('fontawesome.map', JSON.stringify(res))
