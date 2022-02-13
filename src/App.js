import { AuthProvider } from './context/AuthContext'
import CommentsDisplay from './Components/CommentsDisplay'
import AddComment from './Components/AddComment'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className='container'>
        <CommentsDisplay />
      </div>
      <AddComment />
    </AuthProvider>
  )
}

export default App
