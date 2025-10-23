import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyLanding from './pages/survey';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<SurveyLanding />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
