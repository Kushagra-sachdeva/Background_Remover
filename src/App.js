import './App.css'; 
import Navbar from './Components/Navbar/Navbar';
import Body from './Components/Body/Body';
import Upload from './Components/Upload/Upload';
import Remover from './Components/Remover/Remover';
function App() {
  return (
  <div>
    <Navbar />
    <Body />
    <Upload />  
    <Remover />
  </div>
  );
}

export default App;
