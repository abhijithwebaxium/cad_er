import { Box, Stack, Typography } from '@mui/material';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { IoIosRemove } from 'react-icons/io';
import BasicCheckbox from '../../../components/BasicCheckbox';

const initialRow = [{ id: 1, isValue: '', offsetValue: '' }];

const IntermediateSight = ({ setTab, formValues, onSubmit }) => {
  const [rows, setRows] = useState(initialRow);

  const [autoOffset, setAutoOffset] = useState(false);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    const lastId = rows[rows.length - 1]?.id || 0;
    setRows((prev) => [
      ...prev,
      { id: lastId + 1, isValue: '', offsetValue: '' },
    ]);
  };

  const handleRemoveRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const getValues = (action) => {
    const iSValues = rows.map((row) => row.isValue).filter((v) => v !== '');
    const offsetValues = rows
      .map((row) => row.offsetValue)
      .filter((v) => v !== '');

    const values = { iSValues, offsetValues };

    onSubmit(values, 'Intermediate Sight', action);
  };

  const handleAddChainage = () => getValues();
  const handleFinish = () => getValues('finish');

  const handleChangeAutoOffset = (e) => {
    const checked = e.target.checked;
    setAutoOffset(checked);

    if (!checked) return;

    const length = Object.keys(formValues).length;
    const roadWidth = Number(formValues[length]?.roadWidth || 0);
    const offsetHalf = (roadWidth / 2).toFixed(3);

    const lhs = `-${offsetHalf}`;
    const pls = '0.000';
    const rhs = offsetHalf;

    const pattern = [lhs, pls, rhs];

    const limit = rows.length;
    const updatedRows = [...rows];

    for (let i = 0; i < limit; i++) {
      const offsetValue = pattern[i % 3];

      if (updatedRows[i]?.id) {
        updatedRows[i].offsetValue = offsetValue;
        updatedRows[i].isValue = '';
      } else {
        updatedRows[i] = {
          id: i + 1,
          offsetValue,
          isValue: '',
        };
      }
    }

    setRows(updatedRows);
  };

  return (
    <Stack alignItems={'center'} spacing={5}>
      <Box px={'24px'} className="landing-btn" width={'100%'}>
        <BasicButtons
          value={'Add CP'}
          sx={{
            border: '1px solid #0059E7',
            height: '45px',
            color: '#0059E7',
            fontWeight: '700',
          }}
          fullWidth={true}
          variant={'outlined'}
        />
      </Box>

      {/* Heading */}
      <Stack alignItems={'center'}>
        <Typography fontSize={'26px'} fontWeight={700}>
          Enter Intermediate Sight (IS)
        </Typography>
        <Typography fontSize={'16px'} fontWeight={400} color="#434343">
          Click the plus button to add more IS
        </Typography>
      </Stack>

      <Box width={'100%'} className="input-wrapper">
        <Stack direction={'row'} alignItems={'center'}>
          <BasicCheckbox
            checked={autoOffset}
            onChange={(e) => handleChangeAutoOffset(e)}
          />
          <Typography fontSize={'16px'} fontWeight={400} color="#434343">
            Default offset
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {rows.map((row, idx) => (
            <Stack
              key={row.id}
              direction={'row'}
              alignItems={'center'}
              spacing={1}
            >
              <BasicTextFields
                id={row.id}
                variant={'filled'}
                sx={{ width: '100%', borderRadius: '15px !important' }}
                value={row.isValue}
                onChange={(e) => updateRow(row.id, 'isValue', e.target.value)}
                label={'IS'}
                name="is"
              />

              <BasicTextFields
                id={row.id}
                variant={'filled'}
                sx={{ width: '100%', borderRadius: '15px !important' }}
                value={row.offsetValue}
                onChange={(e) =>
                  updateRow(row.id, 'offsetValue', e.target.value)
                }
                label={'Offset'}
                name="offset"
              />

              {idx === rows.length - 1 ? (
                <Box className="add-new-sight" onClick={handleAddRow}>
                  <IoAdd fontSize={'24px'} color="#0059E7" />
                </Box>
              ) : (
                <Box
                  className="remove-new-sight"
                  onClick={() => handleRemoveRow(row.id)}
                >
                  <IoIosRemove fontSize={'24px'} color="rgb(231 0 0)" />
                </Box>
              )}
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Actions */}
      <Box px={'24px'} className="landing-btn" width={'100%'}>
        <Stack direction={'row'} gap={2}>
          <BasicButtons
            value={'Add Chainage'}
            sx={{ backgroundColor: '#0059E7', height: '45px' }}
            fullWidth
            onClick={handleAddChainage}
          />
          <BasicButtons
            value={'Finish'}
            sx={{
              border: '1px solid #0059E7',
              height: '45px',
              color: '#0059E7',
              fontWeight: '700',
            }}
            fullWidth
            variant={'outlined'}
            onClick={handleFinish}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default IntermediateSight;
