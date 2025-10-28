import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getSurvey } from '../../../services/surveyServices';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BasicButtons from '../../../components/BasicButton';

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

  const calculateHI = () =>
    Number(survey?.backSight || 0) + Number(survey?.reducedLevel || 0);

  const hiValue = calculateHI();

  if (!survey) {
    return <Typography p={2}>Loading survey details...</Typography>;
  }

  const exportToExcel = () => {
    if (!survey) return;

    const data = [];

    // Second row (first data row under headers)
    data.push({
      CH: '-',
      BS: survey.backSight || 0,
      IS: '-',
      FS: '-',
      HI: hiValue,
      RL: survey.reducedLevel || 0,
      Offset: '-',
      Remarks: '-',
    });

    // Chainage rows
    survey.tbm.forEach((chainageData) => {
      chainageData.is.forEach((entry, index) => {
        data.push({
          CH: index === 0 ? chainageData.chainage : '',
          BS: '-',
          IS: entry,
          FS: '-',
          HI: hiValue,
          RL: (hiValue - Number(entry)).toFixed(3),
          Offset: chainageData.offset[index] || '-',
          Remarks: '-',
        });
      });
    });

    // Closing row
    data.push({
      CH: '-',
      BS: '-',
      IS: '-',
      FS: hiValue - (survey.reducedLevel || 0),
      HI: '-',
      RL: survey.reducedLevel || 0,
      Offset: '-',
      Remarks: `Closed on Starting TBM at CH:${survey.tbm[0]?.chainage}`,
    });

    // Define headers / columns
    const headers = ['CH', 'BS', 'IS', 'FS', 'HI', 'RL', 'Offset', 'Remarks'];

    // Create worksheet with first row = survey name, second row = headers
    const aoa = [[`Name of Work: ${survey.name}`], headers];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);

    // Merge the survey name across all columns (A1:H1)
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });

    // Add the data starting at row 3 (A3), skipHeader true because headers already written in row 2
    XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A3', skipHeader: true, header: headers });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `Survey_${id}.xlsx`);
  };

  return (
    <Box p={2}>
      <BasicButtons
        variant="contained"
        sx={{ mb: 2 }}
        onClick={exportToExcel}
        value="Download Excel 📥"
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>CH</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                BS
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                IS
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                FS
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                HI
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                RL
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Offset
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell align="right">{survey?.backSight || 0}</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">{hiValue}</TableCell>
              <TableCell align="right">{survey?.reducedLevel || 0}</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
            </TableRow>

            {survey?.tbm.map((chainageData, idx) =>
              chainageData?.is.map((entry, index) => (
                <TableRow key={`${idx}-${index}`}>
                  {index === 0 && (
                    <TableCell rowSpan={chainageData.is.length}>
                      {chainageData.chainage}
                    </TableCell>
                  )}

                  <TableCell align="right">-</TableCell>
                  <TableCell align="right">{entry}</TableCell>
                  <TableCell align="right">-</TableCell>
                  <TableCell align="right">{hiValue}</TableCell>
                  <TableCell align="right">
                    {(hiValue - Number(entry)).toFixed(3)}
                  </TableCell>
                  <TableCell align="right">
                    {chainageData?.offset[index] || '-'}
                  </TableCell>
                  <TableCell align="right">-</TableCell>
                </TableRow>
              ))
            )}

            <TableRow>
              <TableCell>-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">
                {hiValue - (survey?.reducedLevel || 0)}
              </TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">{survey?.reducedLevel || 0}</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">
                Closed on Starting TBM at CH:{survey?.tbm[0]?.chainage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
