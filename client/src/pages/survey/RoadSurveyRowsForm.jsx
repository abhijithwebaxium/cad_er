import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { handleFormError } from '../../utils/handleFormError';
import { startLoading, stopLoading } from '../../redux/loadingSlice';
import HeaderImg from '../../assets/chainage.png';
import { Box, Stack, Typography, Grid } from '@mui/material';
import BasicTextFields from '../../components/BasicTextFields';
import BasicButtons from '../../components/BasicButton';
import { IoAdd } from 'react-icons/io5';
import { IoIosRemove } from 'react-icons/io';
import BasicCheckbox from '../../components/BasicCheckbox';
import { showAlert } from '../../redux/alertSlice';
import ButtonLink from '../../components/ButtonLink';
import { MdArrowBackIosNew } from 'react-icons/md';
import {
  getSurvey,
  addSurveyRow,
  endSurvey,
} from '../../services/surveyServices';
import AlertDialogSlide from '../../components/AlertDialogSlide';

const alertData = {
  title: 'Confirm End of Survey',
  description:
    'Ending this survey will lock all existing data and prevent any new rows from being added. Do you want to continue?',
  cancelButtonText: 'Cancel',
  submitButtonText: 'Submit',
};

const initialFormValues = {
  type: 'Chainage',
  chainage: '',
  roadWidth: '',
  spacing: '',
  intermediateOffsets: [{ intermediateSight: '', offset: '' }],
  intermediateSight: '',
  foreSight: '',
  backSight: '',
  remarks: 'skipping ....',
};

const values = {
  Chainage: [
    'chainage',
    'roadWidth',
    'spacing',
    'intermediateOffsets',
    'remarks',
  ],
  CP: ['foreSight', 'backSight', 'remarks'],
  TBM: ['intermediateSight', 'remarks'],
};

const inputDetails = [
  { label: 'Chainage*', name: 'chainage', placeholder: '0/000', type: 'text' },
  { label: 'Road width*', name: 'roadWidth', type: 'number' },
  { label: 'Spacing*', name: 'spacing', type: 'number' },
  { label: 'Fore sight*', name: 'foreSight', type: 'number' },
  { label: 'Back sight*', name: 'backSight', type: 'number' },
];

const schema = Yup.object().shape({
  type: Yup.string().required('Type is required'),

  chainage: Yup.string().when('type', {
    is: 'Chainage',
    then: (schema) => schema.required('Chainage is required'),
    otherwise: (schema) => schema.nullable(),
  }),

  roadWidth: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .when('type', {
      is: 'Chainage',
      then: (schema) =>
        schema
          .typeError('Road width is required')
          .required('Road width is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  spacing: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .when('type', {
      is: 'Chainage',
      then: (schema) =>
        schema.typeError('Spacing is required').required('Spacing is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  intermediateOffsets: Yup.array()
    .of(
      Yup.object().shape({
        intermediateSight: Yup.number()
          .transform((v, o) => (o === '' ? null : v))
          .nullable()
          .typeError('Intermediate sight is required')
          .required('Intermediate sight is required'),
        offset: Yup.number()
          .transform((v, o) => (o === '' ? null : v))
          .nullable()
          .typeError('Offset is required')
          .required('Offset is required'),
      })
    )
    .when('type', {
      is: 'Chainage',
      then: (schema) =>
        schema
          .min(1, 'At least one row is required')
          .required('Offsets are required'),
      otherwise: () =>
        Yup.mixed()
          .transform(() => null)
          .nullable(),
    }),

  foreSight: Yup.number()
    .transform((v, o) => (o === '' ? null : v))
    .when('type', {
      is: 'CP',
      then: (schema) =>
        schema
          .typeError('Fore sight is required')
          .required('Fore sight is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  intermediateSight: Yup.number()
    .transform((v, o) => (o === '' ? null : v))
    .when('type', {
      is: 'TBM',
      then: (schema) =>
        schema
          .typeError('Intermediate sight is required')
          .required('Intermediate sight is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  backSight: Yup.number()
    .transform((v, o) => (o === '' ? null : v))
    .when('type', {
      is: 'CP',
      then: (schema) =>
        schema
          .typeError('Back sight is required')
          .required('Back sight is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  remarks: Yup.string()
    .trim()
    .when('type', {
      is: (val) => ['Chainage', 'CP', 'TBM'].includes(val),
      then: (schema) => schema.required('Remarks are required'),
      otherwise: (schema) => schema.nullable(),
    }),
});

const RoadSurveyRowsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { global } = useSelector((state) => state.loading);

  const [survey, setSurvey] = useState(null);
  const formValues = useRef(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [inputData, setInputData] = useState([]);
  const [rowType, setRowType] = useState('Chainage');
  const [page, setPage] = useState(0);
  const [forceRender, setForceRender] = useState(false);
  const [autoOffset, setAutoOffset] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateInputData = () => {
    const filteredInputData = inputDetails?.filter((d) =>
      values[rowType]?.includes(d.name)
    );
    formValues.current.type = rowType;

    if (rowType === 'TBM') {
      filteredInputData.push({
        label: 'Intermediate sight*',
        name: 'intermediateSight',
        type: 'number',
      });
    }

    setInputData(filteredInputData);
  };

  const handleChangeRowType = (type) => setRowType(type);

  const calculateOffset = () => {
    const roadWidth = Number(formValues.current.roadWidth || 0);
    const spacing = Number(formValues.current.spacing || 0);

    if (!roadWidth || !spacing) return;

    const halfWidth = roadWidth / 2;
    const pattern = [];

    // Generate offsets from -halfWidth to +halfWidth (inclusive)
    for (
      let offset = -halfWidth;
      offset <= halfWidth + 0.0001;
      offset += spacing
    ) {
      pattern.push(offset.toFixed(3));
    }

    const limit = formValues.current.intermediateOffsets.length;
    const updatedRows = [...formValues.current.intermediateOffsets];

    for (let i = 0; i < limit; i++) {
      const offset = pattern[i % pattern.length];
      updatedRows[i].offset = offset;
      updatedRows[i].intermediateSight = updatedRows[i].intermediateSight || '';
    }

    formValues.current.intermediateOffsets = updatedRows;
    setForceRender(!forceRender);
  };

  const handleChangeAutoOffset = (e) => {
    const checked = e.target.checked;
    setAutoOffset(checked);

    if (!checked) return;

    calculateOffset();
  };

  const handleInputChange = async (event, index, field) => {
    const { name, value } = event.target;

    const target =
      name === 'intermediateOffsets'
        ? `intermediateOffsets[${index}].${field}`
        : name;

    if (name === 'intermediateOffsets') {
      const updated = [...formValues.current.intermediateOffsets];
      updated[index][field] = value;
      formValues.current.intermediateOffsets = updated;
    } else {
      formValues.current = {
        ...formValues.current,
        [name]: value,
      };
    }

    try {
      await Yup.reach(schema, name).validate(value);

      setFormErrors({ ...formErrors, [target]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [target]: error.message });
    }
  };

  const handleAddRow = () => {
    formValues.current.intermediateOffsets.push({
      intermediateSight: '',
      offset: '',
    });
    setInputData([...inputData]);
  };

  const handleRemoveRow = (index) => {
    if (formValues.current.intermediateOffsets.length > 1) {
      formValues.current.intermediateOffsets.splice(index, 1);
      setInputData([...inputData]);
    }
  };

  const getNewChainage = (survey) => {
    const isFirstChainage = survey?.rows?.find((r) => r.type === 'Chainage');

    if (!isFirstChainage) {
      formValues.current.chainage = '0/000';
    } else {
      let lastChainage = null;
      survey?.rows?.forEach((row) => {
        if (row.type === 'Chainage') lastChainage = row.chainage;
      });

      const chainageMultiple = survey?.chainageMultiple;

      // Extract the numeric part after '/'
      const lastDigit = Number(lastChainage.split('/')[1]);

      // Calculate next chainage
      const remainder = lastDigit % chainageMultiple;
      const nextNumber =
        remainder === 0
          ? lastDigit + chainageMultiple
          : lastDigit + (chainageMultiple - remainder);

      // Format back to chainage string like "0/010"
      const nextChainage = `0/${String(nextNumber).padStart(3, '0')}`;

      formValues.current.chainage = nextChainage;
    }
  };

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      if (rowType === 'Chainage' && page === 0) {
        const partialSchema = schema.pick(['chainage', 'roadWidth', 'spacing']);
        await partialSchema.validate(formValues.current, { abortEarly: false });

        if (formValues.current.intermediateOffsets?.length === 1) {
          formValues.current.intermediateOffsets.push(
            { intermediateSight: '', offset: '' },
            { intermediateSight: '', offset: '' }
          );
        }

        setBtnLoading(false);
        return setPage(1);
      }

      await schema.validate(formValues.current, { abortEarly: false });

      let payload = null;

      if (rowType === 'Chainage') {
        payload = {
          ...formValues.current,
          intermediateSight: formValues.current.intermediateOffsets.map(
            (r) => r.intermediateSight
          ),
          offsets: formValues.current.intermediateOffsets.map((r) => r.offset),
        };
      } else {
        payload = { ...formValues.current };
      }

      const { data } = await addSurveyRow(id, payload);

      if (data.success) {
        dispatch(
          showAlert({
            type: 'success',
            message: `${rowType} Added Successfully`,
          })
        );

        formValues.current = {
          ...initialFormValues,
          intermediateOffsets: [{ intermediateSight: '', offset: '' }],
        };
        getNewChainage(data.survey);

        if (rowType === 'Chainage') {
          setPage(0);
          setAutoOffset(false);
        } else {
          setForceRender(!forceRender);
        }
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEndSurvey = async () => {
    try {
      const { data } = await endSurvey(id);

      if (data.success) {
        dispatch(
          showAlert({
            type: 'success',
            message: `${survey.purpose} Finished`,
          })
        );

        navigate(`/survey/road-survey/${id}/result`);
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    updateInputData();
  }, [rowType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!global) dispatch(startLoading());

        const { data } = await getSurvey(id);

        if (data.survey.isSurveyFinish) {
          navigate(`/survey/road-survey/${id}/result`);
          throw Error('Survey already finished');
        }

        getNewChainage(data.survey);
        setSurvey(data.survey);
      } catch (error) {
        handleFormError(error, null, dispatch, navigate);
      } finally {
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [id]);

  return (
    <Box p={3}>
      <AlertDialogSlide
        {...alertData}
        open={open}
        onCancel={handleClose}
        onSubmit={handleEndSurvey}
      />

      {page === 1 && (
        <Box
          sx={{
            border: '1px solid #EFEFEF',
            borderRadius: '9px',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            mb: '24px',
          }}
          onClick={() => setPage(0)}
        >
          <MdArrowBackIosNew />
        </Box>
      )}
      <Stack alignItems={'center'} spacing={5}>
        {page === 0 && (
          <Box className="set-chainage-img-wrapper">
            <img src={HeaderImg} alt="landing" className="chainage-img" />
          </Box>
        )}

        <Stack>
          <Stack direction={'row'} justifyContent={'end'} gap={2}>
            {rowType !== 'Chainage' && (
              <ButtonLink
                label={'Add Chainage'}
                onClick={() => handleChangeRowType('Chainage')}
              />
            )}
            {rowType !== 'CP' && (
              <ButtonLink
                label={'Add CP'}
                onClick={() => handleChangeRowType('CP')}
              />
            )}
            {rowType !== 'TBM' && (
              <ButtonLink
                label={'Add TBM'}
                onClick={() => handleChangeRowType('TBM')}
              />
            )}
          </Stack>

          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography fontSize={'26px'} fontWeight={700}>
              Please Set The {rowType}:
            </Typography>
            <Typography fontSize={'16px'} fontWeight={400} color="#434343">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            </Typography>
          </Box>
        </Stack>

        <Box width={'100%'} maxWidth={'md'}>
          <Grid container spacing={3} columns={12}>
            {page === 0 &&
              inputData.map((input, index) => (
                <Grid
                  size={{
                    xs: 12,
                    sm:
                      input.name === 'roadWidth' || input.name === 'spacing'
                        ? 6
                        : 12,
                  }}
                  key={index}
                >
                  <Box
                    sx={{
                      '& .MuiOutlinedInput-root, & .MuiFilledInput-root': {
                        borderRadius: '15px',
                      },
                      width: '100%',
                    }}
                  >
                    <BasicTextFields
                      {...input}
                      value={formValues.current[input.name]}
                      error={formErrors && formErrors[input.name]}
                      variant="filled"
                      sx={{ width: '100%' }}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Box>
                </Grid>
              ))}

            {/* ✅ Dynamic Intermediate + Offset Rows */}
            {page === 1 && rowType === 'Chainage' && (
              <Grid size={{ xs: 12 }}>
                <Stack direction={'row'} alignItems={'center'}>
                  <BasicCheckbox
                    checked={autoOffset}
                    onChange={(e) => handleChangeAutoOffset(e)}
                  />
                  <Typography
                    fontSize={'16px'}
                    fontWeight={400}
                    color="#434343"
                  >
                    Default offset
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {formValues.current.intermediateOffsets.map((row, idx) => (
                    <Stack
                      key={idx}
                      direction={'row'}
                      alignItems={'center'}
                      spacing={1}
                    >
                      <BasicTextFields
                        label="Intermediate Sight"
                        type="number"
                        name="intermediateOffsets"
                        value={row.intermediateSight}
                        onChange={(e) =>
                          handleInputChange(e, idx, 'intermediateSight')
                        }
                        error={
                          formErrors &&
                          formErrors[
                            `intermediateOffsets[${idx}].intermediateSight`
                          ]
                        }
                        variant="filled"
                        sx={{ width: '100%' }}
                      />

                      <BasicTextFields
                        label="Offset"
                        type="number"
                        name="intermediateOffsets"
                        value={row.offset}
                        onChange={(e) => handleInputChange(e, idx, 'offset')}
                        error={
                          formErrors &&
                          formErrors[`intermediateOffsets[${idx}].offset`]
                        }
                        variant="filled"
                        sx={{ width: '100%' }}
                      />

                      {idx ===
                      formValues.current.intermediateOffsets?.length - 1 ? (
                        <Box className="add-new-sight" onClick={handleAddRow}>
                          <IoAdd fontSize={'24px'} color="#0059E7" />
                        </Box>
                      ) : (
                        <Box
                          className="remove-new-sight"
                          onClick={() => handleRemoveRow(idx)}
                        >
                          <IoIosRemove fontSize={'24px'} color="rgb(231 0 0)" />
                        </Box>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box px={'24px'} width={'100%'} maxWidth={'md'}>
          <Stack direction={'row'} spacing={2}>
            <BasicButtons
              value={'Continue'}
              sx={{ backgroundColor: '#0059E7', height: '45px' }}
              fullWidth={true}
              onClick={handleSubmit}
              loading={btnLoading}
            />

            {page === 0 && (
              <BasicButtons
                value={'Finish Survey'}
                sx={{ backgroundColor: '#4caf50', height: '45px' }}
                fullWidth={true}
                onClick={handleClickOpen}
                loading={btnLoading}
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RoadSurveyRowsForm;
