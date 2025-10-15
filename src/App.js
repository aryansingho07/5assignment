import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import Home from './Home/Home'
import Dashboard from './Dashboard/Dashboard';
import Addphototext from './addphototext/addphototext';
function App() {
  return (
   <>
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/dashboard' element ={<Dashboard />} />
      <Route path='/addphototext' element ={<Addphototext />} />
    </Routes>
    </BrowserRouter>
    </div>
   </>
  );
}

export default App;
