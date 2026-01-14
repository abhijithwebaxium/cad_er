import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { proposalCode, purposeCode } from "../../../constants";

const colors = {
  Initial: "green",
  Proposed: "blue",
  Final: "red",
};

const CrossSectionChartV2 = ({ selectedCs, chartOptions }) => {
  const [width, setWidth] = useState(window.innerWidth);

  const calcWidth = () => {
    const isLs = selectedCs.type === "ls";

    const length = isLs
      ? selectedCs?.chainages?.length
      : selectedCs?.offsets?.length;

    const subtractValue = isLs ? 30 : 70;

    const isWidth = width > length * 90;

    return isWidth ? width - 30 : length * 90 - subtractValue;
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
    // sx={{
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   opacity: 0,
    //   pointerEvents: "none",
    //   zIndex: -1,
    // }}
    >
      <Box sx={{ bgcolor: "transparent" }}>
        <Typography fontSize="12px" textAlign={"center"}>
          CHAINAGE {selectedCs?.chainage}
        </Typography>
        <Stack alignItems={"end"}>
          <Typography fontSize="8px">SCALE X- 1:100</Typography>
          <Typography fontSize="8px">SCALE Y- 1:100</Typography>
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableBody>
              {/* CHART ROW */}
              <TableRow>
                <TableCell sx={{ border: "none", p: 0 }}>
                  <Box maxWidth={`${calcWidth()}px`} height="250px" mb={2}>
                    <Plot
                      data={selectedCs?.series?.map((s) => ({
                        x: s?.data?.map((p) => p.x),
                        y: s?.data?.map((p) => p.y),
                        type: "scatter",
                        mode: "lines",
                        name: s.name,
                        line: { shape: "linear", width: 1, color: s.color },
                      }))}
                      config={{
                        ...chartOptions.config,
                        displayModeBar: false,
                      }}
                      layout={chartOptions.layout}
                      style={chartOptions.style}
                    />
                  </Box>
                </TableCell>
              </TableRow>

              {/* LEVEL / DIST ROWS */}
              {[...(selectedCs?.series || [])]?.reverse()?.map((s, idx) => {
                // detect color for series
                const color =
                  colors[
                    s.name?.includes("Initial")
                      ? "Initial"
                      : s.name?.includes("Proposed")
                      ? "Proposed"
                      : "Final"
                  ];

                return (
                  <TableRow key={idx}>
                    <TableCell sx={{ border: "none", px: "6px", py: 0 }}>
                      <Stack direction="row" width="fit-content">
                        {/* Name column */}
                        <Typography
                          color={color}
                          fontSize="12px"
                          sx={{
                            minWidth: "35px",
                            maxWidth: "35px",
                            textAlign: "right",
                            pr: 1,
                            flexShrink: 0,
                          }}
                        >
                          {{ ...proposalCode, ...purposeCode }?.[s.name]}
                        </Typography>

                        {/* Data section */}
                        <Box
                          sx={{
                            position: "relative",
                            height: "65px",
                            flexShrink: 0,
                            minWidth: `
                          ${calcWidth() - 74}px`,
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "10px",
                              left: 0,
                              right: 0,
                              height: "2px",
                              backgroundColor: color,
                            }}
                          />

                          <Box
                            sx={{
                              position: "absolute",
                              top: "28px",
                              left: 0,
                              right: 0,
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            {s.data.map((val, i) => (
                              <Typography
                                key={i}
                                fontSize="12px"
                                sx={{
                                  transform: "rotate(-90deg)",
                                  color,
                                  width: "10px",
                                  mt: "12px",
                                }}
                              >
                                {val?.y}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell sx={{ border: "none", px: "6px", py: 0 }}>
                  <Stack direction="row" width="fit-content">
                    {/* Name column */}
                    <Typography
                      color="#000"
                      fontSize="12px"
                      sx={{
                        minWidth: "35px",
                        maxWidth: "35px",
                        textAlign: "right",
                        pr: 1,
                        flexShrink: 0,
                      }}
                    >
                      Offset
                    </Typography>

                    {/* Data section */}
                    <Box
                      sx={{
                        position: "relative",
                        height: "65px",
                        flexShrink: 0,
                        minWidth: `
                          ${calcWidth() - 74}px`,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "10px",
                          left: 0,
                          right: 0,
                          height: "2px",
                          backgroundColor: "#000",
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          top: "28px",
                          left: 0,
                          right: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {selectedCs?.offsets?.map((val, i) => (
                          <Typography
                            key={i}
                            fontSize="12px"
                            sx={{
                              transform: "rotate(-90deg)",
                              color: "#000",
                              width: "10px",
                              mt: "12px",
                            }}
                          >
                            {val}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CrossSectionChartV2;
