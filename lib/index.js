import path from 'path'
import fs from 'fs'

const packageBuf = fs.readFileSync('./package.json')
const pkg = JSON.parse(packageBuf)
console.log(pkg.name)
console.log(process.argv)
