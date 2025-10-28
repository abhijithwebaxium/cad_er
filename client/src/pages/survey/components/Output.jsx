import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { getSurvey } from '../../../services/surveyServices';

export default function Output() {
  const { id } = useParams();

  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getSurvey(id);

      setSurvey(data);
    };

    fetchData();
  }, [id]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: '700' }}>CH</TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              BS
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              IS
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              FS
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              HI
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              RL
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              OFFSET
            </TableCell>
            <TableCell sx={{ fontWeight: '700' }} align="right">
              REMARKS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>-</TableCell>
            <TableCell align="right">{survey?.backSight || 0}</TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">
              {Number(survey?.backSight || 0) +
                Number(survey?.reducedLevel || 0)}
            </TableCell>
            <TableCell align="right">{survey?.reducedLevel || 0}</TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
          </TableRow>

          {survey?.tbm.map((chainageData, idx) =>
            chainageData?.is?.map((entry, valueIndex) => (
              <TableRow key={`${idx}-${valueIndex}`}>
                {valueIndex === 0 && (
                  <TableCell rowSpan={chainageData.is.length}>
                    {chainageData.chainage}
                  </TableCell>
                )}

                <TableCell align="right">-</TableCell>
                <TableCell align="right">{entry}</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  {Number(survey?.backSight || 0) +
                    Number(survey?.reducedLevel || 0)}
                </TableCell>
                <TableCell align="right">
                  {(
                    Number(survey?.backSight || 0) +
                    Number(survey?.reducedLevel || 0) -
                    Number(entry)
                  )?.toFixed(3)}
                </TableCell>
                <TableCell align="right">
                  {chainageData?.offset[valueIndex]}
                </TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
