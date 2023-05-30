import { useState, useEffect } from 'react'
import './App.css'

const API = "http://localhost:5174";

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await fetch(API + '/todos/')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)
      setTodos(res)
    }
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(), title, time, done: false,
    }
    await fetch(API + '/todos/', {
      method: "POST",
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json", },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle('')
    setTime('')
  }

  const handleDelete = async (id) => {
    await fetch(API + '/todos/' + id, {
      method: 'DELETE',
    })
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json", },
    })
    setTodos((prevState) => prevState.map((t) => (t.id === data.id) ? (t = data) : t))

  }

  if (loading) {
    return <p>Stand by</p>
  }

  return (

    <div className='App'>
      <div className='header'>
        <h1>TuneUp React!</h1>
      </div>
      <div className='form'>
        <h2>New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>What you've got to do?</label>
            <input type='text' name='title' placeholder='Task' onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              required />
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Time?</label>
            <input type='text' name='time' placeholder='Time to do' onChange={(e) => setTime(e.target.value)}
              value={time || ''}
              required />
          </div>
          <input type='submit' value="Criar Tarefa" />
        </form>
      </div>
      <div className='list'>
        <h2>Tasks for now:</h2>
        {todos.length === 0 && <p>No tasks to do!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>time to do: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? 'CHECK' : 'Do it!'}
              </span>
              <button onClick={() => handleDelete(todo.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
