import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import Admin from './Admin'
// import { Server, Model } from 'miragejs'
import 'bootstrap/dist/css/bootstrap.min.css'

// new Server({
//   models: {
//     product: Model
//   },
//   seeds(server) {
//     server.create('product', {
//       category: 'Notebook',
//       title: 'Dell i7',
//       description: 'Modelo BR3',
//       price: 7845,
//       image: 'url.....'
//     })
//     server.create('product', {
//       category: 'Notebook',
//       title: 'Samsung i7',
//       description: 'Modelo BR3',
//       price: 4845,
//       image: 'url.....'
//     })
//     server.create('product', {
//       category: 'Monitor',
//       title: 'Monitor Samsung',
//       description: 'Modelo 3',
//       price: 845,
//       image: 'url.....'
//     })
//   },
//   routes() {
//     this.namespace = 'api'
//     this.timing = 50

//     this.get('/product', schema => {
//       return schema.products.all()
//     })

//     this.post('/product', (schema, request) => {
//       const attrs = JSON.parse(request.requestBody)
//       return schema.products.create(attrs)
//     })

//     this.patch('/product/:id', (schema, request) => {
//       let id = request.params.id
//       let product = JSON.parse(request.requestBody)
//       return schema.db.products.update(id, product)
//     })

//     this.delete('/product/:id', (schema, request) => {
//       let id = request.params.id
//       return schema.products.find(id).destroy()
//     })
//   }
// })

ReactDOM.render(
  <React.StrictMode>
    <Admin />
  </React.StrictMode>,
  document.getElementById('root')
)
