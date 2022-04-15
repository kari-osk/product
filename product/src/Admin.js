import './styles.css'
import { formatMoney } from './hooks/useUtils'
import api from './services/api'
import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import {
  FiEdit,
  FiTrash,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi'
import { Table, Container, Tooltip } from 'react-bootstrap'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    width: 550,
    height: 580,
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    background: 'rgba(0,0,0,0.6)'
  }
}

Modal.setAppElement('#root')

function Admin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [id, setId] = useState('')
  const [category, setCategory] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')

  const [visibleModal, setVisibleModal] = useState(false)
  const [displaySalvar, setDisplaySalvar] = useState('block')
  const [displayAlterar, setDisplayAlterar] = useState('block')

  const [pageNumber, setPageNumber] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [firstPage, setFirstPage] = useState(false)

  useEffect(() => {
    getProducts()
  }, [pageNumber])

  async function getProducts() {
    setLoading(true)
    try {
      const data = await fetch(
        `http://3.16.56.233:8080/products?size=5&page=${pageNumber}`
      )
      const { content, totalPages, last, first } = await data.json()

      setProducts(content)
      setTotalPages(totalPages)
      setLastPage(last)
      setFirstPage(first)
    } catch (error) {
      alert('Houve um erro de comunicação com o servidor.', error)
    }
    setLoading(false)
  }

  async function newProduct() {
    // event.preventDefault()

    if (!title || !description || !price || !image) {
      alert('Preencha todos os campos')
    } else {
      const body = {
        title,
        price: Number(price),
        category: parseInt(category),
        description,
        image
      }

      try {
        await fetch('http://3.16.56.233:8080/products', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        console.log(body)
        clearStates()
        getProducts()
      } catch (error) {
        alert('Erro ao cadastrar o produto, tente novamente')
      }
    }
    setVisibleModal(false)
  }

  async function deleteProduct(id) {
    try {
      await fetch('http://3.16.56.233:8080/products/' + id, {
        method: 'DELETE'
      })
      // alert('Produto deletado')
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
    setVisibleModal(true)
    setDisplayAlterar('block')
    setDisplaySalvar('none')
  }

  function clearStates() {
    setId('')
    setCategory('')
    setTitle('')
    setDescription('')
    setPrice('')
    setImage('')
  }

  async function editProduct() {
    // event.preventDefault()
    try {
      const body = {
        category,
        title,
        description,
        price,
        image
      }
      await fetch('http://3.16.56.233:8080/products/' + id, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
      // alert('Dados do produto alterados com sucesso.')
      clearStates()
      getProducts()
    } catch (error) {
      alert('Erro ao alterar os dados do produto')
    }
  }

  function updateProduct() {
    editProduct()
    setVisibleModal(false)
  }

  function mostrarModal() {
    setVisibleModal(true)
    setDisplaySalvar('block')
    setDisplayAlterar('none')
  }

  // function pegarId(id) {
  //   setCategory(id)
  //   return id
  // }

  const options = [
    {
      name: 'Escolha uma categoria',
      id: 0
    },
    {
      name: 'Periféricos',
      id: 1
    },
    {
      name: 'Notebook',
      id: 2
    },
    {
      name: 'Hardware',
      id: 2
    },
    {
      name: 'Cadeira',
      id: 2
    },
    {
      name: 'Smartphone',
      id: 2
    }
  ]
  // return----------------------------------------------------------------------

  return (
    <div className="Admin">
      <Container>
        <h1 className="admin-h1">Produtos</h1>
        <div>
          <button
            className="button-icon-admin"
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={firstPage}
          >
            {' '}
            volta
          </button>

          <span className="pages-number-admin">
            {pageNumber + 1}-{totalPages}
          </span>
          <button
            className="button-icon-admin"
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={lastPage}
          >
            {' '}
            vai
          </button>
        </div>
        <Table striped bordered hover size="sm" responsive="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Categoria</th>
              <th>Nome do produto</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Imagem</th>
              <th></th>
            </tr>
          </thead>
          {products.map(product => (
            <>
              <tbody>
                {/* key={product.id} */}
                <tr>
                  <td>{product.id}</td>
                  <td>{product.category.name}</td>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>{formatMoney(product.price)}</td>
                  <td>{product.image}</td>
                  <td>
                    <FiEdit
                      className="button-icon-table"
                      data-toggle="tooltip"
                      title="Editar"
                      onClick={() => fillStates(product)}
                    />
                  </td>
                  <td>
                    <FiTrash
                      className="button-icon-table"
                      data-toggle="tooltip"
                      title="Deletar"
                      onClick={() => {
                        const confirmBox = window.confirm(
                          'Deseja deletar o produto?'
                        )
                        if (confirmBox === true) {
                          deleteProduct(product.id)
                        }
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </>
          ))}
        </Table>

        <button className="button-add-product" onClick={() => mostrarModal()}>
          Adicionar produto
        </button>
      </Container>

      <Modal
        style={customStyles}
        isOpen={visibleModal}
        onRequestClose={() => setVisibleModal(false)}
      >
        <FiX
          data-toggle="tooltip"
          title="Fechar"
          className="button-close-modal"
          onClick={() => setVisibleModal(false)}
        />
        <h1 className="form-h1">Cadastro de novos produtos</h1>
        <form className="form-admin">
          {/* onSubmit={id ? editProduct : newProduct} */}
          <div className="div-form">
            <label className="form-label">
              <span className="form-span">Selecione a categoria</span>
              <select
                className="select-category"
                onChange={e => setCategory(e.target.value)}
              >
                {options.map(option => (
                  <option value={option.id}>
                    {option.name}
                    {/* {console.log(option.id)} */}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              <span className="form-span">Nome do produto</span>
              <input
                className="form-input"
                placeholder="Nome do produto"
                value={title}
                onChange={event => setTitle(event.target.value)}
              ></input>
            </label>

            <label className="form-label">
              <span className="form-span">Descrição</span>
              <input
                className="form-input"
                placeholder="Descrição"
                value={description}
                onChange={event => setDescription(event.target.value)}
              ></input>
            </label>

            <label className="form-label">
              <span className="form-span">Preço</span>
              <input
                className="form-input"
                type="number"
                placeholder="Preço"
                value={price}
                onChange={event => setPrice(event.target.value)}
              ></input>
            </label>
            <label className="form-label">
              <span className="form-span">Imagem</span>
              <input
                className="form-input"
                placeholder="Imagem"
                value={image}
                onChange={event => setImage(event.target.value)}
              ></input>
            </label>
          </div>
        </form>

        <div className="container-buttons">
          <button
            style={{ display: displaySalvar }}
            className="button-form save"
            type="submit"
            onClick={() => newProduct()}
          >
            Salvar
          </button>
          <button
            style={{ display: displayAlterar }}
            className="button-form save"
            type="submit"
            onClick={() => updateProduct()}
          >
            Alterar
          </button>

          <button
            className="button-form cancel"
            type="button"
            onClick={clearStates}
          >
            Limpar
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Admin
