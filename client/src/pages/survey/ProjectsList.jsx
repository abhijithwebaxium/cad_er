import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  styled,
  IconButton,
  TextField,
} from "@mui/material";
import IOSegmentedTabs from "../../components/IOSegmentedTabs";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { stopLoading } from "../../redux/loadingSlice";
import { handleFormError } from "../../utils/handleFormError";
import { deleteSurvey, getAllSurvey } from "../../services/surveyServices";
import { motion, AnimatePresence } from "framer-motion";
import BasicAccordion from "../../components/BasicAccordion";
import { MdOutlineExpandMore, MdOutlineSearch } from "react-icons/md";
import { MdSort } from "react-icons/md";
import BasicCard from "../../components/BasicCard";
import StatusChip from "../../components/StatusChip";
import { IoIosArrowForward } from "react-icons/io";
import { ProjectListCardSkeleton } from "./components/ProjectListCardSkeleton";
import { highlightText } from "../../internals";
import AlertDialogSlide from "../../components/AlertDialogSlide";
import { showAlert } from "../../redux/alertSlice";
import BasicButton from "../../components/BasicButton";
import { MdDelete } from "react-icons/md";
import SmallHeader from "../../components/SmallHeader";
import BasicDivider from "../../components/BasicDevider";

const alertDetails = {
  title: "Field Book",
  description: "Please select the level to go to the field book",
  content: "",
  cancelButtonText: "Cancel",
  submitButtonText: "View",
};

const deleteProjectAlertDetails = {
  title: "Delete Project",
  description: "Are you sure you want to delete this project?",
  content: "",
  cancelButtonText: "Cancel",
  submitButtonText: "Delete",
};

const colors = {
  Initial: "green",
  Proposed: "blue",
  Final: "red",
};

const PRIMARY_BRAND = "#6366f1";
const HEADER_GRADIENT_START = "#4f46e5";
const HEADER_GRADIENT_END = "#6366f1";
const BG_COLOR = "#f8fafc";
const CARD_BORDER = "#e2e8f0";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  marginBottom: 0,
  color: "rgba(0, 0, 0, 0.74)",
  fontSize: "14px",
  display: "flex",
  justifyContent: "space-between",
}));

const fieldsToMap = [
  {
    key: "Auto Level",
    value: "Equipment",
    type: "constant",
  },
  {
    key: "type",
    value: "Type",
  },
  {
    key: "lastPurpose",
    value: "Purpose",
  },
  {
    key: "updatedAt",
    value: "Last Edited",
    type: "Date",
  },
  {
    key: "scheduledDate",
    value: "Scheduled Date",
    type: "Date",
  },
  {
    key: <IoIosArrowForward fontSize={20} color="rgba(0, 111, 253, 1)" />,
    value: "Field Book",
    type: "Icon",
  },
  {
    key: <IoIosArrowForward fontSize={20} color="rgba(0, 111, 253, 1)" />,
    value: "Reports",
    type: "Icon",
  },
];

const getLink = (survey, target, type) => {
  if (target === "reports") {
    return `/survey/${survey._id}/report`;
  }

  const level = survey?.purposes?.find(
    (p) => p.type === (type || "Initial Level"),
  );

  if (target === "Field Book") {
    if (level?.isPurposeFinish) {
      return `/survey/road-survey/${level._id}/field-book`;
    } else {
      return "#";
    }
  } else {
    return `/survey/${survey._id}/report`;
  }
};

export default function ProjectsList() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { state } = useLocation();

  const [tab, setTab] = useState("in_progress");

  const [loading, setLoading] = useState(true);

  const [surveys, setSurveys] = useState([]);

  const [list, setList] = useState({
    todo: [],
    in_progress: [],
    finished: [],
  });

  const [searchMode, setSearchMode] = useState(false);

  const [alertData, setAlertData] = useState(alertDetails);

  const [open, setOpen] = useState(false);

  const [link, setLink] = useState("");

  const [search, setSearch] = useState("");

  const [deleteProjectAlert, setDeleteProjectAlert] = useState(false);

  const [deleteId, setDeleteId] = useState("");

  const handleChange = (e, newValue) => setTab(newValue);

  const filteredSurveys = list?.in_progress.filter((s) =>
    s.project.toLowerCase().includes(search.toLowerCase()),
  );

  const handleContinueSurvey = async (id) => {
    try {
      const survey = surveys.find((s) => String(s._id) === id);

      if (!survey) throw Error("Something went wrong");
      if (survey.isSurveyFinish) throw Error("The survey already finished");

      const activePurpose = survey.purposes?.find((p) => !p.isPurposeFinish);

      if (activePurpose) {
        navigate(`/survey/road-survey/${activePurpose._id}/rows`);
      } else {
        navigate(`/survey/road-survey/${survey._id}`);
      }
    } catch (err) {
      dispatch(
        showAlert({
          type: "error",
          message: "Something went wrong",
        }),
      );
    }
  };

  const handleClose = () => {
    setLink("");

    setOpen(false);
  };

  const handleOpenDeleteProjectAlert = (id) => {
    setDeleteId(id);
    setDeleteProjectAlert(true);
  };

  const handleCloseDeleteProjectAlert = () => {
    setDeleteId("");
    setDeleteProjectAlert(false);
  };

  const handleDeleteProject = async () => {
    try {
      const { data } = await deleteSurvey(deleteId);

      const updatedList = list.in_progress.filter(
        (s) => String(s._id) !== deleteId,
      );

      setList((prev) => ({
        ...prev,
        in_progress: updatedList,
      }));

      if (data.success) {
        dispatch(
          showAlert({
            type: "success",
            message: "Project deleted successfully",
          }),
        );
      } else {
        throw Error("Something went wrong");
      }
    } catch (error) {
      handleFormError(error, null, dispatch, navigate);
    } finally {
      setDeleteProjectAlert(false);
    }
  };

  const handleClickFiledBook = (surveyId) => {
    const survey = surveys.find((s) => String(s._id) === surveyId);
    if (!survey) return;

    const fieldBooks = survey.purposes.filter(
      (p) => p.phase === "Actual" && p.isPurposeFinish,
    );

    if (!fieldBooks.length) {
      return dispatch(
        showAlert({
          type: "warning",
          message: "Please complete the Initial Level",
        }),
      );
    }

    if (fieldBooks.length === 1) {
      const link = getLink(survey, "Field Book");

      return navigate(link);
    }

    setAlertData((prev) => ({
      ...prev,
      content: (
        <Box mt={2}>
          {fieldBooks.map((fieldBook, idx) => (
            <BasicButton
              key={idx}
              sx={{
                width: "100%",
                borderRadius: 1.5,
                p: 1.5,
                mb: 1,
                justifyContent: "space-between",
                textAlign: "left",
                border: "1px solid #e0e0e0",
              }}
              variant="outlined"
              onClick={() =>
                setLink(getLink(survey, "Field Book", fieldBook?.type))
              }
              value={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="body2"
                    fontSize="16px"
                    fontWeight={600}
                    color="black"
                  >
                    {fieldBook?.type}
                  </Typography>
                </Stack>
              }
            />
          ))}
        </Box>
      ),
    }));

    setOpen(true);
  };

  const handleViewFieldBook = () => {
    if (!link) {
      return dispatch(
        showAlert({
          type: "warning",
          message: "Please select a level to view the field book.",
        }),
      );
    }

    navigate(link);
  };

  const fetchSurveys = async () => {
    try {
      const { data } = await getAllSurvey();
      if (data.success) {
        const updatedSurveys =
          data?.surveys?.map((survey) => {
            const lastPurposeDoc = survey?.purposes
              ?.reverse()
              ?.find((p) => p.phase === "Actual");

            return {
              ...survey,
              lastPurpose: lastPurposeDoc?.type || "N/A",
            };
          }) || [];

        setSurveys(updatedSurveys);

        const grouped = updatedSurveys.reduce(
          (acc, survey) => {
            switch (survey.status) {
              case "Scheduled":
                acc.todo.push(survey);
                break;

              case "Active":
                acc.in_progress.push(survey);
                break;

              case "Completed":
                acc.finished.push(survey);
                break;

              default:
                break;
            }

            return acc;
          },
          {
            todo: [],
            in_progress: [],
            finished: [],
          },
        );

        setList(grouped);
      } else {
        throw Error("Failed to fetch surveys");
      }
    } catch (error) {
      handleFormError(error, null, dispatch, navigate);
    } finally {
      setLoading(false);
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    const searchText = state?.search?.trim() || "";
    const selectedTab = state?.tab;

    if (searchText) {
      setSearchMode(true);
      setSearch(searchText);
    }

    if (selectedTab) {
      setTab(selectedTab);
    }
  }, [state]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  // 🔥 Reusable motion variants
  const fadeSlide = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const tabContent = {
    todo: (
      <motion.div {...fadeSlide}>
        {list?.todo?.length ? (
          <Stack spacing={2}>
            {list?.todo?.map((survey, idx) => (
              <BasicCard
                key={idx}
                content={
                  <Box>
                    <BasicAccordion
                      summary={
                        <Stack direction="row" spacing={2} alignItems="center" width="100%" pr={1}>
                          {/* Modern Avatar */}
                          <Box
                            onClick={(e) => { e.stopPropagation(); handleContinueSurvey(survey._id); }}
                            sx={{
                              minWidth: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: `${PRIMARY_BRAND}15`,
                              borderRadius: "14px",
                              color: PRIMARY_BRAND,
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              cursor: "pointer",
                            }}
                          >
                            {survey.project.slice(0, 1).toUpperCase()}
                          </Box>

                          {/* Main Info */}
                          <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" fontWeight={800} sx={{ color: PRIMARY_BRAND, letterSpacing: "0.05em" }}>
                                {survey.type?.toUpperCase() || "SURVEY"}
                              </Typography>
                              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                              <Typography variant="caption" fontWeight={700} color="#94a3b8">
                                {new Date(survey.createdAt)?.toLocaleDateString("en-IN")}
                              </Typography>
                            </Stack>

                            <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {highlightText(survey.project, search)}
                            </Typography>
                          </Stack>

                          {/* Status */}
                          <Box onClick={(e) => e.stopPropagation()}>
                            <StatusChip status={survey.status} />
                          </Box>
                        </Stack>
                      }
                      details={
                        <Stack>
                          {fieldsToMap
                            ?.filter(
                              (item) =>
                                item.value !== "Field Book" &&
                                item.value !== "Reports",
                            )
                            .map(({ key, value, type }, idx) => (
                              <Item key={idx}>
                                {value}

                                {type === "Icon" ? (
                                  value === "Field Book" ? (
                                    <Box
                                      onClick={() =>
                                        handleClickFiledBook(survey._id)
                                      }
                                    >
                                      {key}
                                    </Box>
                                  ) : (
                                    <Link to={getLink(survey, value)}>
                                      {key}
                                    </Link>
                                  )
                                ) : (
                                  <Typography
                                    color={
                                      key === "lastPurpose"
                                        ? colors[
                                        survey[key]?.includes("Initial")
                                          ? "Initial"
                                          : survey[key]?.includes("Final")
                                            ? "Final"
                                            : ""
                                        ]
                                        : ""
                                    }
                                    fontSize={14}
                                    fontWeight={700}
                                  >
                                    {type === "Date"
                                      ? new Date(
                                        survey[key],
                                      )?.toLocaleDateString("en-IN")
                                      : type === "constant"
                                        ? key
                                        : survey[key]}
                                  </Typography>
                                )}
                              </Item>
                            ))}
                        </Stack>
                      }
                      expandIcon={
                        <MdOutlineExpandMore
                          color="rgba(161, 161, 170, 1)"
                          fontSize={28}
                        />
                      }
                      sx={{ boxShadow: "none" }}
                    />

                    {/* Bottom row removed for modern look */}
                  </Box>
                }
                sx={{
                  borderRadius: "20px",
                  border: `1px solid ${CARD_BORDER}`,
                  background: "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px -10px rgba(99, 102, 241, 0.15)",
                    borderColor: PRIMARY_BRAND,
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography fontSize="20px" fontWeight={600}>
              Todo Items
            </Typography>
            <Typography fontSize="14px" color="gray" mt={1}>
              Your scheduled projects will appear here.
            </Typography>
          </Box>
        )}
      </motion.div>
    ),
    in_progress: (
      <motion.div {...fadeSlide}>
        {filteredSurveys?.length ? (
          <Stack spacing={2}>
            {filteredSurveys?.map((survey, idx) => (
              <BasicCard
                key={idx}
                content={
                  <Box>
                    <BasicAccordion
                      summary={
                        <Stack direction="row" spacing={2} alignItems="center" width="100%" pr={1}>
                          <Box
                            onClick={(e) => { e.stopPropagation(); handleContinueSurvey(survey._id); }}
                            sx={{
                              minWidth: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: `${PRIMARY_BRAND}15`,
                              borderRadius: "14px",
                              color: PRIMARY_BRAND,
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              cursor: "pointer",
                            }}
                          >
                            {survey.project.slice(0, 1).toUpperCase()}
                          </Box>
                          <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" fontWeight={800} sx={{ color: PRIMARY_BRAND, letterSpacing: "0.05em" }}>
                                {survey.type?.toUpperCase() || "SURVEY"}
                              </Typography>
                              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                              <Typography variant="caption" fontWeight={700} color="#94a3b8">
                                {new Date(survey.createdAt)?.toLocaleDateString("en-IN")}
                              </Typography>
                            </Stack>
                            <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {highlightText(survey.project, search)}
                            </Typography>
                          </Stack>

                        </Stack>
                      }
                      details={
                        <Stack>
                          {fieldsToMap
                            ?.filter((item) => item.value !== "Scheduled Date")
                            .map(({ key, value, type }, idx) => (
                              <Item key={idx}>
                                {value}

                                {type === "Icon" ? (
                                  value === "Field Book" ? (
                                    <Box
                                      onClick={() =>
                                        handleClickFiledBook(survey._id)
                                      }
                                    >
                                      {key}
                                    </Box>
                                  ) : (
                                    <Link to={getLink(survey, value)}>
                                      {key}
                                    </Link>
                                  )
                                ) : (
                                  <Typography
                                    color={
                                      key === "lastPurpose"
                                        ? colors[
                                        survey[key]?.includes("Initial")
                                          ? "Initial"
                                          : survey[key]?.includes("Final")
                                            ? "Final"
                                            : ""
                                        ]
                                        : ""
                                    }
                                    fontSize={14}
                                    fontWeight={700}
                                  >
                                    {type === "Date"
                                      ? new Date(
                                        survey[key],
                                      )?.toLocaleDateString("en-IN")
                                      : type === "constant"
                                        ? key
                                        : survey[key]}
                                  </Typography>
                                )}
                              </Item>
                            ))}

                          {survey?.branchDetails?.hasBranching && (
                            <Item>
                              Branch Reports
                              <Typography fontSize={14} fontWeight={700}>
                                <IoIosArrowForward
                                  fontSize={20}
                                  color="rgba(0, 111, 253, 1)"
                                  onClick={() =>
                                    navigate(`/survey/report`, {
                                      state: {
                                        getBranchReport: true,
                                        surveyId: survey._id,
                                      },
                                    })
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                              </Typography>
                            </Item>
                          )}

                          <Item sx={{ color: "red" }}>
                            Delete Project
                            <Typography fontSize={14} fontWeight={700}>
                              <MdDelete
                                fontSize={20}
                                color="red"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleOpenDeleteProjectAlert(survey._id)
                                }
                              />
                            </Typography>
                          </Item>
                        </Stack>
                      }
                      expandIcon={
                        <MdOutlineExpandMore
                          color="rgba(161, 161, 170, 1)"
                          fontSize={28}
                        />
                      }
                      sx={{ boxShadow: "none" }}
                    />

                    <BasicDivider borderBottomWidth={0.5} color="#d9d9d9" />

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      px={1}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize="14px"
                        color="rgba(0, 0, 0, 0.74)"
                      >
                        Status
                      </Typography>

                      <StatusChip status={survey.status} />
                    </Stack>
                  </Box>
                }
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0px 4px 8px 0px #1c252c2a",
                }}
              />
            ))}
          </Stack>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography fontSize="20px" fontWeight={600}>
              In Progress
            </Typography>
            <Typography fontSize="14px" color="gray" mt={1}>
              Your ongoing projects will appear here.
            </Typography>
          </Box>
        )}
      </motion.div>
    ),
    finished: (
      <motion.div {...fadeSlide}>
        {list?.finished?.length ? (
          <Stack spacing={2}>
            {list?.finished?.map((survey, idx) => (
              <BasicCard
                key={idx}
                content={
                  <Box>
                    <BasicAccordion
                      summary={
                        <Stack direction="row" spacing={2} alignItems="center" width="100%" pr={1}>
                          <Box
                            onClick={(e) => { e.stopPropagation(); handleContinueSurvey(survey._id); }}
                            sx={{
                              minWidth: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: `${PRIMARY_BRAND}15`,
                              borderRadius: "14px",
                              color: PRIMARY_BRAND,
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              cursor: "pointer",
                            }}
                          >
                            {survey.project.slice(0, 1).toUpperCase()}
                          </Box>
                          <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" fontWeight={800} sx={{ color: PRIMARY_BRAND, letterSpacing: "0.05em" }}>
                                {survey.type?.toUpperCase() || "SURVEY"}
                              </Typography>
                              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                              <Typography variant="caption" fontWeight={700} color="#94a3b8">
                                {new Date(survey.createdAt)?.toLocaleDateString("en-IN")}
                              </Typography>
                            </Stack>
                            <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {highlightText(survey.project, search)}
                            </Typography>
                          </Stack>

                        </Stack>
                      }
                      details={
                        <Stack>
                          {fieldsToMap
                            ?.filter((item) => item.value !== "Scheduled Date")
                            .map(({ key, value, type }, idx) => (
                              <Item key={idx}>
                                {value}

                                {type === "Icon" ? (
                                  value === "Field Book" ? (
                                    <Box
                                      onClick={() =>
                                        handleClickFiledBook(survey._id)
                                      }
                                    >
                                      {key}
                                    </Box>
                                  ) : (
                                    <Link to={getLink(survey, value)}>
                                      {key}
                                    </Link>
                                  )
                                ) : (
                                  <Typography
                                    color={
                                      key === "lastPurpose"
                                        ? colors[
                                        survey[key]?.includes("Initial")
                                          ? "Initial"
                                          : survey[key]?.includes("Final")
                                            ? "Final"
                                            : ""
                                        ]
                                        : ""
                                    }
                                    fontSize={14}
                                    fontWeight={700}
                                  >
                                    {type === "Date"
                                      ? new Date(
                                        survey[key],
                                      )?.toLocaleDateString("en-IN")
                                      : type === "constant"
                                        ? key
                                        : survey[key]}
                                  </Typography>
                                )}
                              </Item>
                            ))}

                          {survey?.branchDetails?.hasBranching && (
                            <Item>
                              Branch Reports
                              <Typography fontSize={14} fontWeight={700}>
                                <IoIosArrowForward
                                  fontSize={20}
                                  color="rgba(0, 111, 253, 1)"
                                  onClick={() =>
                                    navigate(`/survey/report`, {
                                      state: {
                                        getBranchReport: true,
                                        surveyId: survey._id,
                                      },
                                    })
                                  }
                                />
                              </Typography>
                            </Item>
                          )}
                        </Stack>
                      }
                      expandIcon={
                        <MdOutlineExpandMore
                          color="rgba(161, 161, 170, 1)"
                          fontSize={28}
                        />
                      }
                      sx={{ boxShadow: "none" }}
                    />

                    <BasicDivider borderBottomWidth={0.5} color="#d9d9d9" />

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      px={1}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize="14px"
                        color="rgba(0, 0, 0, 0.74)"
                      >
                        Status
                      </Typography>

                      <StatusChip status={survey.status} />
                    </Stack>
                  </Box>
                }
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0px 4px 8px 0px #1c252c2a",
                }}
              />
            ))}
          </Stack>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography fontSize="20px" fontWeight={600}>
              Finished Projects
            </Typography>
            <Typography fontSize="14px" color="gray" mt={1}>
              Your finished projects will appear here.
            </Typography>
          </Box>
        )}
      </motion.div>
    ),
  };

  return (
    <Box overflow={"hidden"} sx={{ bgcolor: BG_COLOR, minHeight: "100vh", pb: 5 }}>
      <SmallHeader />

      <AlertDialogSlide
        {...alertData}
        open={open}
        onCancel={handleClose}
        onSubmit={handleViewFieldBook}
      />

      <AlertDialogSlide
        {...deleteProjectAlertDetails}
        open={deleteProjectAlert}
        onCancel={handleCloseDeleteProjectAlert}
        onSubmit={handleDeleteProject}
      />

      <Box
        className="overlapping-header"
        position={"sticky"}
        p={2}
        top={0}
        zIndex={10}
        sx={{
          background: `linear-gradient(135deg, ${HEADER_GRADIENT_START} 0%, ${HEADER_GRADIENT_END} 100%)`,
          color: "white",
          borderRadius: "0 0 20px 20px",
          boxShadow: "0 10px 40px -10px rgba(79, 70, 229, 0.3)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* 🔍 Left Icon */}
          <IconButton onClick={() => setSearchMode(true)} sx={{ color: "white" }}>
            <MdOutlineSearch size={26} />
          </IconButton>

          {/* 🔄 Title / Search Input with Animation */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              {!searchMode ? (
                // 🏷️ Projects Title
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Typography fontWeight={900} fontSize="24px" letterSpacing="-0.5px">
                    Projects
                  </Typography>
                </motion.div>
              ) : (
                // 🔍 Search Input
                <motion.div
                  key="searchInput"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: "100%" }}
                >
                  <TextField
                    autoFocus
                    size="small"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      width: "85%",
                      background: "#F3F3F3",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                    slotProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => {
                            setSearch("");
                            setSearchMode(false);
                          }}
                        >
                          ❌
                        </IconButton>
                      ),
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* ↕ Sort Icon */}
          <IconButton sx={{ color: "white" }}>
            <MdSort size={26} />
          </IconButton>
        </Box>

        {/* iOS Tabs display: 'flex', justifyContent: 'center', */}
        <Box>
          <IOSegmentedTabs
            value={tab}
            onChange={handleChange}
            tabs={[
              { label: "To do", value: "todo" },
              { label: "In progress", value: "in_progress" },
              { label: "Finished", value: "finished" },
            ]}
          />
        </Box>
      </Box>

      {/* Animate tab content */}
      <Box px={2} pt={3} mb={"82px"}>
        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <ProjectListCardSkeleton key={idx} />
            ))}
          </Stack>
        ) : (
          <AnimatePresence mode="popLayout">{tabContent[tab]}</AnimatePresence>
        )}
      </Box>
    </Box>
  );
}
