import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import { FiEdit, FiTrash, FiCheck } from 'react-icons/fi'
import './styles.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    width: 500,
    height: 400,
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    background: 'rgba(0,0,0,0.6)'
  }
}

Modal.setAppElement('#root')

export default function FormModal() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [id, setId] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  const [visibleModal, setVisibleModal] = useState(false)

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {
    setLoading(true)
    try {
      const data = await fetch('http://localhost:3000/api/products')
      const { products } = await data.json()

      setProducts(products)
    } catch (error) {
      alert('Houve um erro de comunicação com o servidor.')
    }
    setLoading(false)
  }

  async function newProduct(event) {
    event.preventDefault()

    if (!title || !description || !price || !image) {
      alert('Preencha todos os campos')
    } else {
      const body = {
        title,
        description,
        price,
        image,
        status: false
      }

      try {
        await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify(body)
        })
        clearStates()
        getProducts()
      } catch (error) {
        alert('Erro ao cadastrar o produto, tente novamente')
      }
    }
  }

  async function deleteProduct(id) {
    try {
      await fetch('http://localhost:3000/api/products' + id, {
        method: 'DELETE'
      })
      alert('Produto deletado')
      getProducts()
    } catch (error) {
      alert('Erro ao deletar o produtos, tente novamente')
    }
  }

  function fillStates(product) {
    setId(product.id)
    setCategory(product.category)
    setTitle(product.title)
    setDescription(product.description)
    setPrice(product.price)
    setImage(product.image)
  }

  function clearStates() {
    setId('')
    setCategory('')
    setTitle('')
    setDescription('')
    setPrice('')
    setImage('')
  }

  async function editProduct(event) {
    event.preventDefault()
    try {
      const body = {
        category,
        title,
        description,
        price,
        image
      }
      await fetch('http://localhost:3000/api/products/' + id, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
      alert('Dados do produto alterados com sucesso.')
      clearStates()
      getProducts()
    } catch (error) {
      alert('Erro ao alterar os dados do produto')
    }
  }

  async function checkProduct(id, status) {
    const body = {
      status: !status
    }

    try {
      await fetch('http://localhost:3000/api/poducts/' + id, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
      getProducts()
    } catch (error) {}
  }

  const options = [
    {
      label: 'Notebook',
      value: 'notebook'
    },
    {
      label: 'Monitor',
      value: 'monitor'
    }
  ]

  return (
    <div>
      <Modal
        style={customStyles}
        isOpen={visibleModal}
        onRequestClose={() => setVisibleModal(false)}
      >
        <h1>Cadastro de novos produtos</h1>
        <form onSubmit={id ? editProduct : newProduct}>
          <div className="admin-input">
            <label>
              <span>Selecione a categoria</span>
              <select className="select-category">
                {options.map(option => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Nome do produto</span>
              <input
                placeholder="Nome do produto"
                value={title}
                onChange={event => setTitle(event.target.value)}
              ></input>
            </label>

            <label>
              <span>Descrição</span>
              <input
                placeholder="Descrição"
                value={description}
                onChange={event => setDescription(event.target.value)}
              ></input>
            </label>

            <label>
              <span>Preço</span>
              <input
                type="number"
                placeholder="Preço"
                value={price}
                onChange={event => setPrice(event.target.value)}
              ></input>
            </label>
            <label>
              <span>Imagem</span>
              <input
                placeholder="Imagem"
                value={image}
                onChange={event => setImage(event.target.value)}
              ></input>
            </label>
          </div>

          <div className="container-buttons">
            <button type="submit">{!id ? 'Salvar' : 'Alterar'}</button>
            <button type="button" onClick={clearStates}>
              Limpar
            </button>
          </div>
        </form>
      </Modal>

      <ul>
        {products.map(product => (
          <li>
            <div>
              <p>{product.category}</p>
              <p>{product.title}</p>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <p>{product.image}</p>
              <p>{product.status.toString()}</p>
            </div>

            <div className="container-buttons">
              <FiEdit
                size={20}
                color="#444"
                onClick={() => fillStates(product)}
              />

              <FiTrash
                size={20}
                color="#444"
                onClick={() => deleteProduct(product)}
              />

              <FiCheck
                size={20}
                color="#444"
                onClick={() => checkProduct(product)}
              />
            </div>
          </li>
        ))}{' '}
        {loading && <h4>Carregando dados...</h4>}
      </ul>
    </div>
  )
}
