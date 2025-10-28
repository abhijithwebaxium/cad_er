import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyLanding from './pages/survey';
import RoadSurveyForm from './pages/survey/RoadSurveyForm';
import Output from './pages/survey/components/Output';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<SurveyLanding />} />

          <Route path="survey">
            <Route path="road-survey" element={<RoadSurveyForm />} />
            <Route path="road-survey-tbm/:id" element={<Output />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
