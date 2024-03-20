import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//layout
import MainLayout from './components/MainLayout';
import AddTodo from './components/AddTodo';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index path='' element={<Home />} />
          <Route index path='home' element={<Home />} />
          <Route index path='todo' element={<AddTodo />} />
          <Route path="list/:id" element={<AddTodo id={':id'} />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
