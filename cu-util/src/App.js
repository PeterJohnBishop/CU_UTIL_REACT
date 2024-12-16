import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryContainer from "./Auth/Entry";
import AuthenticationContainer from "./Auth/AccessToken";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryContainer />} />
        <Route path="/oauthSuccess" element={<AuthenticationContainer />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
