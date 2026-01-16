import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Grid,
  TextField,
  Chip,
  Pagination,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG Icons
const IconMapPin = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconChevronRight = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconUpload = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconArrowLeft = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconCheckCircle = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 20 20"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const IconBuilding = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="22" x2="9" y2="2"></line>
    <line x1="15" y1="22" x2="15" y2="2"></line>
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="10" x2="20" y2="10"></line>
    <line x1="4" y1="14" x2="20" y2="14"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

const IconSearch = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PLACEMENTS = [
  {
    id: "p-01",
    company: "BuildCorp International",
    title: "Junior Site Surveyor",
    location: "Dubai, UAE",
    stipend: "$2,500/mo",
    tags: ["Immediate Start", "Housing"],
    deadline: "Oct 15, 2023",
  },
  {
    id: "p-02",
    company: "GeoTech Solutions",
    title: "Civil Engineering Intern",
    location: "Singapore",
    stipend: "$1,800/mo",
    tags: ["Remote Friendly", "Mentorship"],
    deadline: "Nov 01, 2023",
  },
  {
    id: "p-03",
    company: "Infrastructure Ltd",
    title: "Quantity Surveyor Trainee",
    location: "London, UK",
    stipend: "£2,200/mo",
    tags: ["Career Growth", "Travel"],
    deadline: "Oct 28, 2023",
  },
  {
    id: "p-04",
    company: "Skyline Erectors",
    title: "Structural Assistant",
    location: "Chicago, USA",
    stipend: "$3,000/mo",
    tags: ["Skyscrapers", "High-Rise"],
    deadline: "Nov 10, 2023",
  },
  {
    id: "p-05",
    company: "Terraform Group",
    title: "Land Surveyor",
    location: "Sydney, Australia",
    stipend: "$4,200 AUD",
    tags: ["Mining", "Field Work"],
    deadline: "Oct 20, 2023",
  },
  {
    id: "p-06",
    company: "AquaStructure",
    title: "Hydraulic Eng Intern",
    location: "Amsterdam, NL",
    stipend: "€1,900/mo",
    tags: ["Water Management"],
    deadline: "Dec 05, 2023",
  },
  {
    id: "p-07",
    company: "Metro Rail Corp",
    title: "Alignment Engineer",
    location: "Mumbai, India",
    stipend: "₹45,000/mo",
    tags: ["Public Transit", "Rail"],
    deadline: "Oct 30, 2023",
  },
  {
    id: "p-08",
    company: "GreenBuild Co",
    title: "Sustainability Consultant",
    location: "Portland, USA",
    stipend: "$2,800/mo",
    tags: ["LEED", "Solar"],
    deadline: "Nov 15, 2023",
  },
  {
    id: "p-09",
    company: "Nordic Civil",
    title: "Junior Site Manager",
    location: "Oslo, Norway",
    stipend: "kr 32,000",
    tags: ["Tunneling", "Arctic Tech"],
    deadline: "Nov 22, 2023",
  },
  {
    id: "p-10",
    company: "Desert Roads",
    title: "Asphalt Specialist",
    location: "Riyadh, KSA",
    stipend: "$3,500/mo",
    tags: ["Highways", "Expats Welcome"],
    deadline: "Dec 10, 2023",
  },
  {
    id: "p-11",
    company: "Urban Scapes",
    title: "Draftsperson",
    location: "Toronto, Canada",
    stipend: "$3,100 CAD",
    tags: ["AutoCAD", "BIM"],
    deadline: "Oct 25, 2023",
  },
  {
    id: "p-12",
    company: "Alpine Bridges",
    title: "Bridge Inspector",
    location: "Zurich, Switzerland",
    stipend: "CHF 4,500",
    tags: ["Steel Structures"],
    deadline: "Jan 15, 2024",
  },
  {
    id: "p-13",
    company: "Pacific Dredging",
    title: "Coastal Engineer",
    location: "Auckland, NZ",
    stipend: "$3,800 NZD",
    tags: ["Marine Tech"],
    deadline: "Nov 30, 2023",
  },
  {
    id: "p-14",
    company: "Smart City Lab",
    title: "IoT Site Coordinator",
    location: "Seoul, S. Korea",
    stipend: "₩2,800,000",
    tags: ["Smart Tech", "Innovation"],
    deadline: "Nov 05, 2023",
  },
  {
    id: "p-15",
    company: "Heritage Restorations",
    title: "Masonry Apprentice",
    location: "Rome, Italy",
    stipend: "€1,600/mo",
    tags: ["Historic", "Artisan"],
    deadline: "Dec 20, 2023",
  },
  {
    id: "p-16",
    company: "Concrete Masters",
    title: "Quality Control Tech",
    location: "Berlin, Germany",
    stipend: "€2,400/mo",
    tags: ["Lab Work", "Precast"],
    deadline: "Oct 31, 2023",
  },
  {
    id: "p-17",
    company: "Peak Power",
    title: "Solar Farm Surveyor",
    location: "Madrid, Spain",
    stipend: "€2,100/mo",
    tags: ["Energy", "Outdoor"],
    deadline: "Nov 12, 2023",
  },
  {
    id: "p-18",
    company: "Titan Foundation",
    title: "Piling Assistant",
    location: "Tokyo, Japan",
    stipend: "¥350,000",
    tags: ["Seismic Tech"],
    deadline: "Jan 05, 2024",
  },
  {
    id: "p-19",
    company: "QuickBuild Prefab",
    title: "Assembly Supervisor",
    location: "Austin, USA",
    stipend: "$2,900/mo",
    tags: ["Modular", "Fast-Track"],
    deadline: "Dec 15, 2023",
  },
  {
    id: "p-20",
    company: "River Flow Ltd",
    title: "Dam Safety Intern",
    location: "Cairo, Egypt",
    stipend: "$1,200/mo",
    tags: ["Geotechnical"],
    deadline: "Nov 18, 2023",
  },
  {
    id: "p-21",
    company: "Apex Mapping",
    title: "GIS Analyst",
    location: "Denver, USA",
    stipend: "$3,200/mo",
    tags: ["Data Science", "Drones"],
    deadline: "Oct 29, 2023",
  },
  {
    id: "p-22",
    company: "Euro Tunnel",
    title: "Excavation Trainee",
    location: "Calais, France",
    stipend: "€2,300/mo",
    tags: ["Heavy Machinery"],
    deadline: "Dec 01, 2023",
  },
  {
    id: "p-23",
    company: "Vista Development",
    title: "Junior Planner",
    location: "Cape Town, SA",
    stipend: "R 25,000",
    tags: ["Residential", "Urban Design"],
    deadline: "Nov 25, 2023",
  },
  {
    id: "p-24",
    company: "Blueprint Civil",
    title: "Estimation Engineer",
    location: "Bangkok, Thailand",
    stipend: "฿40,000",
    tags: ["Costing", "Procurement"],
    deadline: "Oct 27, 2023",
  },
  {
    id: "p-25",
    company: "Iron & Steel Co",
    title: "Welding Inspector",
    location: "Pittsburgh, USA",
    stipend: "$3,400/mo",
    tags: ["Manufacturing"],
    deadline: "Nov 08, 2023",
  },
  {
    id: "p-26",
    company: "Island Infra",
    title: "Pavement Engineer",
    location: "Bali, Indonesia",
    stipend: "Rp 15,000k",
    tags: ["Rural Dev"],
    deadline: "Dec 30, 2023",
  },
  {
    id: "p-27",
    company: "Nova Surveying",
    title: "LiDAR Technician",
    location: "Seattle, USA",
    stipend: "$3,600/mo",
    tags: ["Laser Scanning"],
    deadline: "Nov 20, 2023",
  },
  {
    id: "p-28",
    company: "Canal Builders",
    title: "Logistics Assistant",
    location: "Panama City, PA",
    stipend: "$2,000/mo",
    tags: ["Transport"],
    deadline: "Oct 22, 2023",
  },
  {
    id: "p-29",
    company: "Solid Rock Eng",
    title: "Blasting Trainee",
    location: "Johannesburg, SA",
    stipend: "R 28,000",
    tags: ["Quarrying"],
    deadline: "Nov 14, 2023",
  },
  {
    id: "p-30",
    company: "Deep Blue Marine",
    title: "Underwater Surveyor",
    location: "Miami, USA",
    stipend: "$4,500/mo",
    tags: ["Diving Required"],
    deadline: "Jan 10, 2024",
  },
];

const ITEMS_PER_PAGE = 5;

const Placements = () => {
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic (Text-based search)
  const filteredPlacements = useMemo(() => {
    return PLACEMENTS.filter(
      (p) =>
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination logic
  const paginatedPlacements = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredPlacements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPlacements, page]);

  const totalPages = Math.ceil(filteredPlacements.length / ITEMS_PER_PAGE);

  const handleApply = (opening) => {
    setSelectedOpening(opening);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSelectedOpening(null);
    }, 5000);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", pb: 10 }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          borderBottom: "1px solid #dbeafe",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              variant="overline"
              sx={{ color: "#6366f1", fontWeight: 800, letterSpacing: 3 }}
            >
              PLACEMENT PORTAL
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Explore New <br />
              <span style={{ color: "#6366f1" }}>Placement Openings</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#475569", maxWidth: 600, fontWeight: 400 }}
            >
              Connecting CADer certified professionals with leading construction
              and engineering firms globally.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <AnimatePresence mode="wait">
          {!selectedOpening ? (
            <motion.div
              key="placement-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: "#1e293b", minWidth: 150 }}
                  >
                    Search Openings:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by company or role..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSearch />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ bgcolor: "white" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", whiteSpace: "nowrap" }}
                  >
                    Showing {filteredPlacements.length} results
                  </Typography>
                </Paper>

                {paginatedPlacements.length > 0 ? (
                  paginatedPlacements.map((opening) => (
                    <Paper
                      key={opening.id}
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#6366f1",
                          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                bgcolor: "#eff6ff",
                                borderRadius: 2,
                                color: "#3b82f6",
                              }}
                            >
                              <IconBuilding />
                            </Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: "#64748b",
                                textTransform: "uppercase",
                              }}
                            >
                              {opening.company}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 800, color: "#111827" }}
                          >
                            {opening.title}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ color: "#64748b" }}
                            >
                              <IconMapPin />
                              <Typography variant="body2">
                                {opening.location}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              sx={{ color: "#3B82F6", fontWeight: 600 }}
                            >
                              {opening.stipend}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            {opening.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: "#f1f5f9",
                                  fontWeight: 600,
                                  color: "#475569",
                                  mb: 1,
                                }}
                              />
                            ))}
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", display: "block", mt: 1 }}
                          >
                            Deadline: {opening.deadline}
                          </Typography>
                        </Grid>
                        <Grid
                          size={{ xs: 12, md: 3 }}
                          sx={{ textAlign: { md: "right" } }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleApply(opening)}
                            endIcon={<IconChevronRight />}
                            sx={{
                              bgcolor: "#6366f1",
                              borderRadius: 2,
                              px: 3,
                              textTransform: "none",
                              fontWeight: 700,
                              "&:hover": { bgcolor: "#4f46e5" },
                            }}
                          >
                            Express Interest
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 10 }}>
                    <Typography color="textSecondary">
                      No openings matching your search.
                    </Typography>
                  </Box>
                )}

                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, v) => setPage(v)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="apply-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 6,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
                }}
              >
                {!formSubmitted ? (
                  <>
                    <Button
                      startIcon={<IconArrowLeft />}
                      onClick={() => setSelectedOpening(null)}
                      sx={{ color: "#64748b", mb: 4, textTransform: "none" }}
                    >
                      Back to All Openings
                    </Button>

                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                      Interest in {selectedOpening.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", mb: 5 }}
                    >
                      Position at <strong>{selectedOpening.company}</strong>.
                      Provide your details for the placement coordinator.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="CADer Student ID / Email"
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Current CGPA / Grade"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            select
                            label="Preferred Start Date"
                            defaultValue="immediate"
                            variant="outlined"
                          >
                            <MenuItem value="immediate">Immediate</MenuItem>
                            <MenuItem value="next-month">Next Month</MenuItem>
                            <MenuItem value="quarter">Next Quarter</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Portfolio Link (Surveying/Design)"
                            placeholder="Behance, GitHub, or Drive link"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Brief Technical Summary"
                            placeholder="Mention your expertise in total station, AutoCAD, etc."
                            variant="outlined"
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              p: 4,
                              border: "2px dashed #cbd5e1",
                              borderRadius: 4,
                              textAlign: "center",
                              bgcolor: "#f8fafc",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": {
                                borderColor: "#6366f1",
                                bgcolor: "#f3f4ff",
                              },
                            }}
                          >
                            <IconUpload />
                            <Typography
                              variant="h6"
                              sx={{ fontSize: "1rem", fontWeight: 700, mt: 1 }}
                            >
                              Attach Professional Resume
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#94a3b8" }}
                            >
                              PDF preferred (max 5MB)
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                              py: 2,
                              bgcolor: "#6366f1",
                              borderRadius: 3,
                              fontWeight: 800,
                              fontSize: "1.1rem",
                              textTransform: "none",
                              mt: 2,
                              "&:hover": { bgcolor: "#4f46e5" },
                            }}
                          >
                            Submit to Placement Cell
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </>
                ) : (
                  <Stack alignItems="center" spacing={3} sx={{ py: 8 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Box sx={{ color: "#10b981", fontSize: 80 }}>
                        <IconCheckCircle />
                      </Box>
                    </motion.div>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      Interest Recorded!
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        textAlign: "center",
                        maxWidth: 450,
                      }}
                    >
                      Your profile has been shared with the placement team at{" "}
                      {selectedOpening.company}. Check your email for further
                      instructions on the interview schedule.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setFormSubmitted(false);
                        setSelectedOpening(null);
                      }}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        mt: 2,
                        textTransform: "none",
                      }}
                    >
                      Browse Other Placements
                    </Button>
                  </Stack>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Placements;
