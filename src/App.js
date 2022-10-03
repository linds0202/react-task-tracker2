import {useState, useEffect} from "react"
import { BrowerRouter as Router, Route } from "react-router-dom"


import Header from "./components/Header"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import About from "./components/About"
import Footer from "./components/Footer"

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([
    {
        id: 1,
        text: "task 1",
        reminder: true
    },
    {
        id: 2,
        text: "task 2",
        reminder: true
    },
    {
        id: 3,
        text: "task 3",
        reminder: true
    }
])

useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  
  getTasks()
}, [])

//Fetch tasks
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = res.json()

  return data
}

//Fetch a single task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = res.json()

  return data
}



//Add task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-tpye': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...tasks, data])


  // const id = Math.floor(Math.random() * 10000) + 1

  // const newTask = {id, ...task}

  // setTasks([...tasks, newTask])
}

//Delete task

const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE'
  })
  setTasks(tasks.filter(task => task.id !== id))
}

//Toggle reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)

  const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-tpye': 'application/json'
    },
    body: JSON.stringify(updTask)
  })

  const data = await res.json()

  setTasks(
    tasks.map(task => 
      task.id === id ? 
      { ...task, reminder: data.reminder } : 
      task
    ))
}

return (
  <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      
      <Route path="/" exact render={(props) => (
        <>
          {showAddTask && <AddTask onAdd={addTask}/>}
          { tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : "No tasks to show" }
        </>
      )} />
      <Route path="/about" component={About} />
      <Footer />
    </div>
  </Router>
  )
}

export default App;
