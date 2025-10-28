import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { getSurvey } from '../../../services/surveyServices';

export default function Output() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // if (isMobile) {
  //   return (
  //     <Box p={2}>
  //       <Typography fontWeight={700} fontSize={20} mb={2}>
  //         Survey Output
  //       </Typography>

  //       {/* First TBM card */}
  //       <Card elevation={3} sx={{ mb: 2, p: 1 }}>
  //         <CardContent>
  //           <Typography fontSize={14}>BS: {survey?.backSight || 0}</Typography>
  //           <Typography fontSize={14}>HI: {hiValue}</Typography>
  //           <Typography fontSize={14}>
  //             RL: {survey?.reducedLevel || 0}
  //           </Typography>
  //         </CardContent>
  //       </Card>

  //       {survey?.tbm?.map((chainageData, idx) =>
  //         chainageData?.is?.map((entry, index) => (
  //           <Card
  //             key={`${idx}-${index}`}
  //             elevation={3}
  //             sx={{ mb: 2, borderRadius: 2 }}
  //           >
  //             <CardContent>
  //               <Typography
  //                 fontWeight={700}
  //                 textTransform="uppercase"
  //                 fontSize={15}
  //                 color="primary"
  //               >
  //                 Chainage: {chainageData.chainage}
  //               </Typography>

  //               <Divider sx={{ my: 1 }} />

  //               <Box display="flex" justifyContent="space-between" py={0.5}>
  //                 <strong>IS</strong> <span>{entry}</span>
  //               </Box>

  //               <Box display="flex" justifyContent="space-between" py={0.5}>
  //                 <strong>HI</strong> <span>{hiValue}</span>
  //               </Box>

  //               <Box display="flex" justifyContent="space-between" py={0.5}>
  //                 <strong>RL</strong>{' '}
  //                 <span>{(hiValue - Number(entry)).toFixed(3)}</span>
  //               </Box>

  //               <Box display="flex" justifyContent="space-between" py={0.5}>
  //                 <strong>Offset</strong>{' '}
  //                 <span>{chainageData?.offset[index] || '-'}</span>
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         ))
  //       )}
  //     </Box>
  //   );
  // }

  return (
    <Box p={2}>
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
