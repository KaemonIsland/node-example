const fs = require('fs')
const http = require('http')
const url = require('url')

///////////////////////////////////////////////////////////////
// FILES

// // Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// const textOut = `This is what we know about the avocado: ${textIn}.
// Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File Written!')
 
// // Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('Error!')
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2)
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3)

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written')
//       })
//     })
//   })
// })

////////////////////////////////////////////////
// SERVER

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%NAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)

  if (!product.organic) {
    output = output.replace(/{%ORGANIC%}/g, 'not-organic')
  }
  
  return output
}

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const productData = JSON.parse(data)

const server = http.createServer((req, res) => {
  const pathname = req.url

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html'})

    const cardsHtml = productData.map(el => replaceTemplate(card, el)).join('')
    const output = overview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    res.end(output)

    // Product Page
  } else if (pathname === '/product') {
    res.end('This is the PRODUCT')

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    })
    res.end(productData)
    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    })
    res.end('<h1>Page not found!</h1>')
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000')
})