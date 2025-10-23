import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyLanding from './pages/survey';
import RoadSurveyForm from './pages/survey/RoadSurveyForm';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<SurveyLanding />} />

          <Route path="survey">
            <Route path="road-survey" element={<RoadSurveyForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
