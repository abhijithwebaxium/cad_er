import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSurvey } from '../../services/surveyServices';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { startLoading, stopLoading } from '../../redux/loadingSlice';
import { FaEye, FaStopCircle } from 'react-icons/fa';
import { handleFormError } from '../../utils/handleFormError';

export default function SurveyList() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { global } = useSelector((state) => state.loading);

  const [surveys, setSurveys] = useState([]);

  const fetchSurveys = async () => {
    try {
      if (!global) {
        dispatch(startLoading());
      }

      const { data } = await getAllSurvey();

      if (data.success) {
        setSurveys(data.surveys || []);
      } else {
        throw Error('Failed to fetch surveys');
      }
    } catch (error) {
      handleFormError(error, null, dispatch, navigate);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleEndSurvey = async (id) => {
    alert('!');
  };

  if (surveys.length === 0)
    return (
      <Typography p={2} color="text.secondary">
        No surveys found.
      </Typography>
    );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Surveys List
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Instrument No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Chainage Multiple</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey._id} hover>
                <TableCell>{survey.purpose}</TableCell>
                <TableCell>{survey.instrumentNo}</TableCell>
                <TableCell>{survey.type}</TableCell>
                <TableCell>{survey.chainageMultiple}</TableCell>
                <TableCell>
                  <Chip
                    label={survey.isSurveyFinish ? 'Finished' : 'Active'}
                    color={survey.isSurveyFinish ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(survey.DateOfSurvey).toLocaleDateString()}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(`/survey/road-survey/${survey._id}/result`)
                    }
                  >
                    <FaEye />
                  </IconButton>

                  {!survey.isSurveyFinish && (
                    <IconButton
                      color="error"
                      onClick={() => handleEndSurvey(survey._id)}
                    >
                      <FaStopCircle />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
