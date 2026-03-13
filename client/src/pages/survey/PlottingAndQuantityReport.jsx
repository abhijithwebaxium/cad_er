import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { startLoading, stopLoading } from "../../redux/loadingSlice";
import { getFieldBook, getSurvey } from "../../services/surveyServices";
import { handleFormError } from "../../utils/handleFormError";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { MdArrowBackIosNew, MdDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import BasicMenu from "../../components/BasicMenu";
import { BsThreeDots } from "react-icons/bs";
import FieldBookTable, {
  calculateTableData,
} from "./components/FieldBookTable";
import CrossSectionChartV2 from "./components/CrossSectionChartV2";
import { v1ChartOptions } from "../../constants";
import CrossSectionChart from "./components/CrossSectionChart";
import html2canvas from "html2canvas";
import ExportLoader from "../../components/ExportLoader";

const LEVEL_ORDER = [
  "Initial Level",
  "Proposed Level",
  "Final Earth Work",
  "Proposed Earth Work",
  "Final Quarry Muck",
  "Proposed Quarry Muck",
  "Final GSB",
  "Proposed GSB",
  "Final WMM",
  "Proposed WMM",
  "Final BM",
  "Proposed BM",
  "Final BC",
  "Proposed BC",
  "Final Tile Top",
  "Proposed Tile Top",
  "Final Level",
];

const colors = {
  Initial: "green",
  Proposed: "blue",
  Final: "red",
};

const inputColors = {
  green: { borderColor: "#00800081", color: "#008000" },
  blue: { borderColor: "#0000ff8a", color: "#0000FF" },
  red: { borderColor: "#ff000085", color: "#FF0000" },
};

const getColor = (type) => {
  if (type.includes("Initial")) return colors.Initial;
  if (type.includes("Proposed")) return colors.Proposed;
  return colors.Final;
};

const menuItems = [
  {
    label: (
      <Stack direction={"row"} alignItems={"center"} gap={0.5}>
        PDF
        <MdDownload />
      </Stack>
    ),
    value: "pdf download",
  },
];

const initialDetails = {
  initialEntry: "",
  secondaryEntry: "",
};

const exportPdf = async ({
  tableData,
  reportDetails,
  surveyInfo,
  showArea,
  setLoading,
}) => {
  if (setLoading) setLoading(true);

  try {
    // Optimization 1: Enable internal PDF compression
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageTotalWidth = doc.internal.pageSize.getWidth();
    const pageTotalHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageTotalWidth - margin * 2;

    // ===== VOLUME REPORT =====
    if (tableData?.rows?.length > 0) {
      const volumeBody = [];
      tableData.rows.forEach((row, index) => {
        if (row.isDeductionRow) {
          volumeBody.push([
            {
              content: row.deductionMessage,
              colSpan: 13,
              styles: {
                fontStyle: "bolditalic",
                halign: "left",
                fillColor: [245, 245, 245],
              },
            },
          ]);
        }
        volumeBody.push([
          index + 1,
          row.section,
          row.prevSection,
          row.difference,
          row.width,
          ...(showArea?.cutting
            ? [
                row.cuttingAreaSqMtr,
                row.cuttingPrevArea,
                row.cuttingAvgSqrMtr,
                row.cuttingVolumeCubicMtr,
              ]
            : []),
          ...(showArea?.filling
            ? [
                row.fillingAreaSqMtr,
                row.fillingPrevArea,
                row.fillingAvgSqrMtr,
                row.fillingVolumeCubicMtr,
              ]
            : []),
        ]);
      });

      volumeBody.push([
        "",
        "",
        "",
        "",
        "",

        { content: "Total", styles: { fontStyle: "bold" } },

        ...(showArea?.cutting
          ? [
              { content: "", colSpan: 2 },
              {
                content: Number(tableData?.totalCuttingVolume)?.toFixed(3),
                styles: { fontStyle: "bold" },
              },
            ]
          : []),

        ...(showArea?.filling
          ? [
              { content: "", colSpan: showArea?.cutting ? 3 : 2 },
              {
                content: Number(tableData?.totalFillingVolume)?.toFixed(3),
                styles: { fontStyle: "bold" },
              },
            ]
          : []),
      ]);

      autoTable(doc, {
        margin: { top: 20 },
        theme: "grid",
        head: [
          [
            { content: "Sl.No.", rowSpan: 2 },
            { content: "Section From", rowSpan: 2 },
            { content: "Previous Section", rowSpan: 2 },
            { content: "Difference", rowSpan: 2 },
            { content: "Width", rowSpan: 2 },
            ...(showArea?.cutting
              ? [{ content: "Cutting Volume", colSpan: 4 }]
              : []),
            ...(showArea?.filling
              ? [{ content: "Filling Volume", colSpan: 4 }]
              : []),
          ],
          [
            ...(showArea?.cutting
              ? [
                  "Area Sq. Mtrs",
                  "Previous Area",
                  "Average Sq. Mtrs",
                  "Volume Cubic Meters",
                ]
              : []),
            ...(showArea?.filling
              ? [
                  "Area Sq. Mtrs",
                  "Previous Area",
                  "Average Sq. Mtrs",
                  "Volume Cubic Meters",
                ]
              : []),
          ],
        ],
        body: volumeBody,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          textColor: 0,
          lineWidth: 0.1,
          valign: "middle",
        },
        headStyles: {
          fontSize: 7.5,
          fontStyle: "bold",
          halign: "center",
          fillColor: false,
          textColor: 0,
          lineWidth: 0.1,
        },
        didDrawPage: () => {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text(
            `Volume Report ${reportDetails.initialEntry} and ${reportDetails.secondaryEntry}`,
            105,
            15,
            { align: "center" },
          );
        },
      });
    }

    // ===== AREA REPORT =====
    if (tableData?.areaReport?.length > 0) {
      if (tableData?.rows?.length > 0) doc.addPage();
      const areaBody = [];
      tableData.areaReport.forEach((section) => {
        areaBody.push([
          {
            content: `Section: ${section.section}`,
            colSpan: 12,
            styles: { fontStyle: "bold" },
          },
        ]);
        areaBody.push([{ content: "", colSpan: 12 }]);
        section.data.forEach((row, idx) => {
          areaBody.push([
            idx + 1,
            row.offset,
            row.initialEntryRL,
            row.secondaryEntryRL,
            ...(showArea?.cutting
              ? [
                  row.cuttingMtr,
                  row.cuttingAvgMtr,
                  row.cuttingWMtr,
                  row.cuttingAreaSqMtr,
                ]
              : []),
            ...(showArea?.filling
              ? [
                  row.fillingMtr,
                  row.fillingAvgMtr,
                  row.fillingWMtr,
                  row.fillingAreaSqMtr,
                ]
              : []),
          ]);
        });
        areaBody.push([
          { content: "", colSpan: 4 },

          { content: "Total", styles: { fontStyle: "bold" } },

          ...(showArea?.cutting
            ? [
                { content: "", colSpan: 2 },
                {
                  content: Number(section?.totalCuttingAreaSqMtr)?.toFixed(3),
                  styles: { fontStyle: "bold" },
                },
              ]
            : []),

          ...(showArea?.filling
            ? [
                { content: "", colSpan: showArea?.cutting ? 3 : 2 },
                {
                  content: Number(section?.totalFillingAreaSqMtr)?.toFixed(3),
                  styles: { fontStyle: "bold" },
                },
              ]
            : []),
        ]);
      });

      autoTable(doc, {
        margin: { top: 20 },
        theme: "grid",
        head: [
          [
            { content: "Sl.No.", rowSpan: 2 },
            { content: "Distance Meters", rowSpan: 2 },
            { content: `${reportDetails.initialEntry} Meters`, rowSpan: 2 },
            { content: `${reportDetails.secondaryEntry} Meters`, rowSpan: 2 },
            ...(showArea?.cutting
              ? [{ content: "Cutting Area", colSpan: 4 }]
              : []),
            ...(showArea?.filling
              ? [{ content: "Filling Area", colSpan: 4 }]
              : []),
          ],
          [
            ...(showArea?.cutting
              ? [
                  "Cutting Meters",
                  "Avg Meters",
                  "Width Meters",
                  "Area Sq. Mtrs",
                ]
              : []),
            ...(showArea?.filling
              ? [
                  "Filling Meters",
                  "Avg Meters",
                  "Width Meters",
                  "Area Sq. Mtrs",
                ]
              : []),
          ],
        ],
        body: areaBody,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          textColor: 0,
          lineWidth: 0.1,
          valign: "middle",
        },
        headStyles: {
          fontSize: 7.5,
          fontStyle: "bold",
          halign: "center",
          fillColor: false,
          textColor: 0,
          lineWidth: 0.1,
        },
        didDrawPage: () => {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text(
            `Area Report Between ${reportDetails.initialEntry} and ${reportDetails.secondaryEntry}`,
            105,
            15,
            { align: "center" },
          );
        },
      });
    }

    // ===== CHARTS & GRAPHS SECTION =====
    const chartPageMargin = 8;
    const chartContentWidth = pageTotalWidth - chartPageMargin * 2;
    const chartContentHeight = pageTotalHeight - chartPageMargin * 2;
    const infoBoxHeight = 42;
    const chartGap = 4;

    const drawGraphInfoSection = () => {
      const left = chartPageMargin;
      const bottom = pageTotalHeight - chartPageMargin;
      const top = bottom - infoBoxHeight;
      const width = chartContentWidth;

      const labelColWidth = 32;
      const descColWidth = 55;
      const approvalStartX = left + labelColWidth + descColWidth;
      const remainingWidth = width - (labelColWidth + descColWidth);

      const mainApprovalColWidth = remainingWidth / 4;
      const subColLabelWidth = mainApprovalColWidth * 0.65;
      const rowHeight = infoBoxHeight / 5;

      doc.setDrawColor(0).setLineWidth(0.2);
      doc.line(left, top, left + width, top);
      doc.line(left + labelColWidth, top, left + labelColWidth, bottom);
      doc.line(approvalStartX, top, approvalStartX, bottom);

      for (let i = 0; i < 4; i++) {
        const colX = approvalStartX + mainApprovalColWidth * i;
        if (i > 0) doc.line(colX, top, colX, bottom);
        doc.line(colX + subColLabelWidth, top, colX + subColLabelWidth, bottom);
      }
      for (let i = 1; i < 5; i++) {
        doc.line(left, top + rowHeight * i, left + width, top + rowHeight * i);
      }

      const headers = ["CONTRACTOR", "CONSULTANT", "CSML", "KMRL"];
      doc.setFont("helvetica", "bold").setFontSize(5.5);
      headers.forEach((h, i) => {
        const centerX =
          approvalStartX + mainApprovalColWidth * i + subColLabelWidth / 2;
        doc.text(h, centerX, top + rowHeight / 2 + 1, { align: "center" });
      });

      const labels = [
        { label: "TITLE :", value: "ROAD 2 AB SALEM ROAD" },
        { label: "PROJECT NAME", value: String(surveyInfo?.project || "-") },
        { label: "CLIENT", value: String(surveyInfo?.client || "-") },
        { label: "CONSULTANT", value: String(surveyInfo?.consultant || "-") },
        { label: "CONTRACTOR", value: String(surveyInfo?.contractor || "-") },
      ];

      labels.forEach((item, i) => {
        const yPos = top + rowHeight * i + rowHeight / 2 + 1;
        doc.setFont("helvetica", "bold").setFontSize(7);
        doc.text(item.label, left + 2, yPos);
        doc.setFont("helvetica", "normal");
        const splitValue = doc.splitTextToSize(item.value, descColWidth - 4);
        doc.text(splitValue, left + labelColWidth + 2, yPos);
      });
      // (Status labels logic same as before...)
    };

    const chartItems = document.querySelectorAll(".pdf-chart-item");

    for (let i = 0; i < chartItems.length; i++) {
      const el = chartItems[i];
      // Give time for charts to render
      await new Promise((res) => setTimeout(res, 500));

      // Optimization 2: Lower scale (2.0 is high quality for print but way smaller than 3.0)
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Optimization 3: Use JPEG at 0.75 quality instead of PNG
      const imgData = canvas.toDataURL("image/jpeg", 0.75);
      doc.addPage();

      // Master Border
      doc.setDrawColor(0).setLineWidth(0.4);
      doc.rect(
        chartPageMargin,
        chartPageMargin,
        chartContentWidth,
        chartContentHeight,
      );

      doc.setFont("helvetica", "bold").setFontSize(11);
      doc.text(
        "Plotting and Quantity Report",
        pageTotalWidth / 2,
        chartPageMargin + 8,
        { align: "center" },
      );

      const availableTop = chartPageMargin + 14;
      const availableBottom =
        pageTotalHeight - chartPageMargin - infoBoxHeight - chartGap;
      const availableHeight = availableBottom - availableTop;

      let imgWidth = chartContentWidth - 2;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      const x = chartPageMargin + (chartContentWidth - imgWidth) / 2;
      const y = availableTop + (availableHeight - imgHeight) / 2;

      // Optimization 4: Use 'FAST' compression alias
      doc.addImage(
        imgData,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );

      drawGraphInfoSection();

      // Cleanup to free memory
      canvas.width = 0;
      canvas.height = 0;
    }

    doc.save(`plotting-and-quantity-report.pdf`);
  } catch (err) {
    console.error("Export error:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const PlottingAndQuantityReport = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const reportDetails = useRef(initialDetails);

  const tokenClientRef = useRef(null);

  const tableDataRef = useRef([]);

  const { state } = useLocation();

  const dispatch = useDispatch();

  const { global } = useSelector((state) => state.loading);

  const [survey, setSurvey] = useState([]);

  const [purpose, setPurpose] = useState(null);

  const [showArea, setShowArea] = useState({ cutting: false, filling: false });

  const [selectedLs, setSelectedLs] = useState(null);

  const [lsTableData, setLsTableData] = useState([]);

  const [csTableData, setCsTableData] = useState([]);

  const [chartOptions, setChartOptions] = useState(v1ChartOptions);

  const allCsRef = useRef({});

  const [allCs, setAllCs] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenuSelect = async (item) => {
    if (item.value === "pdf download") {
      await exportPdf({
        tableData,
        reportDetails: reportDetails.current,
        surveyInfo: survey,
        showArea,
        setLoading,
      });
    }
  };

  const getSafeChainage = (chainage) => {
    return Number(chainage?.split(survey.separator || "/")[1]);
  };

  const buildCsData = (row) => {
    if (!row) return null;

    const initialEntry = csTableData[0];
    if (!initialEntry?.rows?.length) return null;

    const rawOffsets = row.offsets || [];
    const safeInitial = row.reducedLevels || [];

    const numericOffsets = rawOffsets.map(Number);
    const uniqueOffsets = [...new Set(numericOffsets)].sort((a, b) => a - b);

    const data = {
      id,
      type: "cs",
      offsets: [...uniqueOffsets], // Store as Numbers
      chainage: row.chainage,
      series: [],
      allRl: [],
    };

    const makeSeries = (offsets, levels) =>
      offsets.map((o, i) => {
        const valY = Number(levels?.[i] ?? 0);
        data.allRl.push(valY);
        return {
          x: Number(o), // NO .toFixed() here; keep as Number
          y: valY,
        };
      });

    data.series.push({
      _id: row._id,
      purpose: initialEntry._id,
      name: initialEntry.type,
      color: getColor(initialEntry.type),
      data: makeSeries(rawOffsets, safeInitial),
    });

    if (csTableData.length > 1) {
      for (let i = 1; i < csTableData.length; i++) {
        const table = csTableData[i];
        const newRow = table?.rows?.find((r) => r.chainage === row.chainage);
        if (!newRow) continue;

        const rawProposalOffsets = newRow.offsets || [];
        const safeProposalLevels = newRow.reducedLevels || [];

        rawProposalOffsets.forEach((o) => {
          const num = Number(o);
          if (!data.offsets.includes(num)) data.offsets.push(num);
        });

        data.series.push({
          _id: newRow._id,
          purpose: table._id,
          name: table.type,
          color: getColor(table.type),
          data: makeSeries(rawProposalOffsets, safeProposalLevels),
        });
      }
    }

    data.offsets.sort((a, b) => a - b);

    const minY = Math.min(...data.allRl);
    const maxY = Math.max(...data.allRl);
    const minX = Math.min(...data.offsets);
    const maxX = Math.max(...data.offsets);

    const padY = (maxY - minY) * 0.1;

    const xaxis = {
      autorange: false,
      range: [minX, maxX], // Snap range exactly to data bounds
      tickformat: ".3f",
      dtick: maxX - minX <= 10 ? 1 : 2, // Clean integer intervals
      zeroline: false,
      showline: false,
      mirror: true,
      padding: 0,
      constrain: "domain",
    };

    data.specificOptions = {
      ...v1ChartOptions,
      config: {
        ...v1ChartOptions.config,
        displayModeBar: false,
      },
      layout: {
        ...v1ChartOptions.layout,
        margin: { t: 40, r: 30, l: 50, b: 40 }, // Ensure enough space for labels
        yaxis: {
          zeroline: false,
          autorange: false,
          range: [Math.floor(minY) - 1, maxY + padY],
        },
        xaxis,
      },
    };

    data.datum = Math.floor(minY) - 1;
    return data;
  };

  const handleDownloadAllChainage = async () => {
    try {
      const initialEntry = csTableData[0];
      if (!initialEntry?.rows?.length) return;

      const allFormattedData = initialEntry.rows
        ?.filter((row) => row.type === "Chainage")
        .map((row) => buildCsData(row))
        .filter(Boolean);

      setAllCs(allFormattedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateLs = () => {
    const initialEntry = lsTableData[0];
    if (!initialEntry?.rows?.length) return;

    const row = initialEntry.rows.filter((row) => row.type === "Chainage");
    if (!row.length) return;

    const pls = Number(initialEntry.pls || 0);

    const safeChainages = row.map((r) => getSafeChainage(r.chainage)) || [];
    const safeInitial = row.map((r) => {
      const offsetPointIndex = r.offsets?.findIndex((o) => Number(o) === pls);

      const safeOffsetPointIndex =
        offsetPointIndex === -1
          ? Math.round(r.offsets.length / 2)
          : offsetPointIndex;

      return r.reducedLevels[safeOffsetPointIndex];
    });

    const data = {
      id,
      type: "ls",
      datum: 9.4,
      chainages: safeChainages,
      series: [],
      allRl: [],
    };

    const makeSeries = (offsets, levels) =>
      offsets.map((o, i) => ({
        x: Number(Number(o).toFixed(3)), // NUMERIC X (IMPORTANT)
        y: Number(Number(levels?.[i] ?? 0).toFixed(3)),
      }));

    // Add the Initial Entry at the end
    data.series.push({
      name: initialEntry.type,
      color: getColor(initialEntry.type),
      data: makeSeries(safeChainages, safeInitial),
    });

    // Add all additional tableData (Proposed, Level 2, etc.)
    if (lsTableData.length > 1) {
      for (let i = 1; i < lsTableData.length; i++) {
        const table = lsTableData[i];

        const newRow = table?.rows?.filter((r) => r.type === "Chainage") || [];
        if (!newRow.length) continue;

        const safeProposal = newRow.map((r) => {
          const offsetPointIndex = r.offsets?.findIndex(
            (o) => Number(o) === pls,
          );
          const safeOffsetPointIndex =
            offsetPointIndex === -1
              ? Math.round(r.offsets.length / 2)
              : offsetPointIndex;

          return r.reducedLevels[safeOffsetPointIndex];
        });

        data.allRl.push(...safeProposal);

        data.series.push({
          name: table.type,
          color: getColor(table.type),
          data: makeSeries(safeChainages, safeProposal),
        });
      }
    }

    data.allRl.push(...safeInitial);

    // Compute bounds
    const minY = Math.min(...data.allRl);
    const maxY = Math.max(...data.allRl);

    const pad = (maxY - minY) * 0.1;

    const minX = Math.min(...data.chainages);
    const maxX = Math.max(...data.chainages);

    const xaxis = {
      autorange: false,
      range: [minX, maxX],
      tickformat: ".3f",
      dtick: (maxX - minX) / 4,
      zeroline: false,
      showline: false,
      mirror: true,
    };

    setChartOptions((_) => ({
      ...v1ChartOptions,
      layout: {
        ...v1ChartOptions.layout,
        yaxis: {
          zeroline: false,
          autorange: false,
          range: [minY - 2, maxY + pad],
        },

        xaxis,
      },
    }));

    data.datum = Math.round(minY - 2);
    setSelectedLs(data);
  };

  const handleSetTableData = (survey) => {
    let data = [];

    if (state && state?.selectedPurposeIds?.length) {
      state.selectedPurposeIds.forEach((entry) => {
        const purpose = survey?.purposes?.find(
          (p) => String(p._id) === String(entry),
        );

        if (purpose) data.push(purpose);
      });
    } else {
      const initial = survey?.purposes?.find((p) => p.type === "Initial Level");
      const proposal = survey?.purposes?.find(
        (p) => p.type === "Proposed Level",
      );
      if (initial) data.push(initial);
      if (proposal) data.push(proposal);
    }

    data.sort(
      (a, b) => LEVEL_ORDER.indexOf(a.type) - LEVEL_ORDER.indexOf(b.type),
    );

    setCsTableData(data);
    setLsTableData(data);
  };

  const fetchSurvey = async () => {
    try {
      if (!global) {
        dispatch(startLoading());
      }

      const { data } = await getSurvey(id);

      const level = data.survey?.purposes?.find(
        (p) => p.type === "Initial Level",
      );

      const response = await getFieldBook(level._id);

      setSurvey(data?.survey || []);
      setPurpose(response?.data?.survey);
      handleSetTableData(data.survey);
    } catch (error) {
      handleFormError(error, null, dispatch, navigate);
    } finally {
      dispatch(stopLoading());
    }
  };

  const shortType = (type) => {
    if (!type) return type;
    return type.replace(/^Proposed\s+/i, "Prop. ");
  };

  const tableData = useMemo(() => {
    let initialEntry = null;
    let secondaryEntry = null;
    const deductions = (state && state?.rows) || [];
    const isDeduction = deductions.length;

    if (state && state?.selectedPurposeIds?.length) {
      initialEntry = survey?.purposes?.find(
        (p) => String(p._id) === String(state.selectedPurposeIds[0]),
      );
      secondaryEntry = survey?.purposes?.find(
        (p) => String(p._id) === String(state.selectedPurposeIds[1]),
      );
    } else {
      initialEntry = survey?.purposes?.find((p) => p.type === "Initial Level");
      secondaryEntry = survey?.purposes?.find(
        (p) => p.type === "Proposed Level",
      );
    }

    if (!survey || !initialEntry || !secondaryEntry) return [];

    reportDetails.current = {
      initialEntry: shortType(initialEntry.type),
      secondaryEntry: shortType(secondaryEntry.type),
    };

    const initialRows = initialEntry?.rows ?? [];
    const secondaryRows = secondaryEntry?.rows ?? [];
    const rows = [];

    let prevSection = null;
    let currentDeduction = null;
    let isDeductionStarted = false;
    let isDeductionRemarkAdded = false;
    let cuttingPrevArea = "0.000";
    let fillingPrevArea = "0.000";

    const totals = {
      totalCuttingVolume: 0,
      totalFillingVolume: 0,
    };

    // Process only "Chainage" rows
    const filteredInitialRows = initialRows.filter(
      (row) => row.type === "Chainage",
    );

    const areaReport = [];

    filteredInitialRows.forEach((row) => {
      const secondaryRow = secondaryRows?.find(
        (p) => p.chainage === row.chainage,
      );
      const chainage = row.chainage?.split(survey?.separator || "/")?.[1] ?? "";

      let prevReadings = [];

      const data = (row?.offsets ?? []).map((entry, idx) => {
        const initialEntryRL = row?.reducedLevels?.[idx] ?? 0;
        const secondaryEntryRL = secondaryRow?.reducedLevels?.[idx] ?? 0;

        const initRL = Number(initialEntryRL);
        const propRL = Number(secondaryEntryRL);
        const offsetVal = Number(entry);
        const prevOffsetVal = Number(row?.offsets?.[idx - 1] ?? 0);

        // Determine whether it's cutting or filling
        const isCutting = initRL > propRL;

        // Shared width (W) for both cutting and filling
        const widthMtr =
          idx === 0 ? "0.000" : (offsetVal - prevOffsetVal).toFixed(3);

        const cuttingMtr = isCutting ? (initRL - propRL).toFixed(3) : "0.000";

        const cuttingAvgMtr =
          !isCutting || idx === 0
            ? "0.000"
            : (
                (Number(cuttingMtr) +
                  Number(prevReadings[idx - 1]?.cuttingMtr || 0)) /
                2
              ).toFixed(3);

        const fillingMtr = isCutting ? "0.000" : (propRL - initRL).toFixed(3);

        const fillingAvgMtr =
          isCutting || idx === 0
            ? "0.000"
            : (
                (Number(fillingMtr) +
                  Number(prevReadings[idx - 1]?.fillingMtr || 0)) /
                2
              ).toFixed(3);

        const dataDoc = {
          offset: entry,
          initialEntryRL,
          secondaryEntryRL,
          cuttingMtr,
          cuttingAvgMtr,
          cuttingWMtr: widthMtr,
          cuttingAreaSqMtr: (Number(cuttingAvgMtr) * Number(widthMtr)).toFixed(
            3,
          ),
          fillingMtr,
          fillingAvgMtr,
          fillingWMtr: widthMtr,
          fillingAreaSqMtr: (Number(fillingAvgMtr) * Number(widthMtr)).toFixed(
            3,
          ),
        };

        prevReadings.push(dataDoc);
        return dataDoc;
      });

      // --- Total area for this section ---
      const cuttingAreaSqMtr = data.reduce(
        (acc, curr) => acc + Number(curr.cuttingAreaSqMtr || 0),
        0,
      );
      const fillingAreaSqMtr = data.reduce(
        (acc, curr) => acc + Number(curr.fillingAreaSqMtr || 0),
        0,
      );

      areaReport.push({
        section: Number(chainage),
        data,
        totalCuttingAreaSqMtr: cuttingAreaSqMtr,
        totalFillingAreaSqMtr: fillingAreaSqMtr,
      });

      // --- Compute chainage difference ---
      const currentChainage = Number(chainage) || 0;
      const prevChainage = Number(prevSection) || 0;
      let difference = null;
      let deductionMessage = null;
      let flag = false;

      if (isDeduction) {
        const isDeductionRow = deductions.find((d) => d.from === row.chainage);

        if (isDeductionRow) {
          isDeductionStarted = true;
          currentDeduction = isDeductionRow;

          difference = prevSection
            ? (currentChainage - prevChainage).toFixed(3)
            : "0.000";
        } else if (isDeductionStarted) {
          if (!isDeductionRemarkAdded) {
            const trimmedRemark = currentDeduction?.remark?.trim();

            difference = "0.000";
            flag = true;

            deductionMessage =
              "Deduction - " +
              (trimmedRemark
                ? trimmedRemark
                : `from ${currentDeduction?.from} to ${currentDeduction?.to}`);

            isDeductionRemarkAdded = true;
          } else {
            const isDeductionEndingNow = currentDeduction.to === row.chainage;

            if (isDeductionEndingNow) {
              currentDeduction = null;
              isDeductionStarted = false;
            }

            difference = "0.000";
          }
        } else {
          difference = prevSection
            ? (currentChainage - prevChainage).toFixed(3)
            : "0.000";
        }
      } else {
        difference = prevSection
          ? (currentChainage - prevChainage).toFixed(3)
          : "0.000";
      }

      // --- Average areas ---
      const cuttingAvgSqrMtr = (
        (Number(cuttingAreaSqMtr) + Number(cuttingPrevArea)) /
        2
      ).toFixed(3);
      const fillingAvgSqrMtr = (
        (Number(fillingAreaSqMtr) + Number(fillingPrevArea)) /
        2
      ).toFixed(3);

      // --- Volumes ---
      const cuttingVolumeCubicMtr = (
        Number(difference) * Number(cuttingAvgSqrMtr)
      ).toFixed(3);
      const fillingVolumeCubicMtr = (
        Number(difference) * Number(fillingAvgSqrMtr)
      ).toFixed(3);

      // --- Push row ---
      rows.push({
        section: currentChainage.toFixed(3),
        prevSection: prevSection ? prevChainage.toFixed(3) : "-",
        difference,
        width: row?.roadWidth ?? "-",
        cuttingAreaSqMtr: cuttingAreaSqMtr.toFixed(3),
        cuttingPrevArea,
        cuttingAvgSqrMtr,
        cuttingVolumeCubicMtr,
        fillingAreaSqMtr: fillingAreaSqMtr.toFixed(3),
        fillingPrevArea,
        fillingAvgSqrMtr,
        fillingVolumeCubicMtr,
        deductionMessage,
        isDeductionRow: flag,
      });

      if (!showArea.cutting && Number(totals.totalCuttingVolume) > 0) {
        setShowArea((prev) => ({ ...prev, cutting: true }));
      }

      if (!showArea.filling && Number(totals.totalFillingVolume) > 0) {
        setShowArea((prev) => ({ ...prev, filling: true }));
      }

      // --- Prepare for next iteration ---
      cuttingPrevArea = Number(cuttingAreaSqMtr)?.toFixed(3);
      fillingPrevArea = Number(fillingAreaSqMtr)?.toFixed(3);
      totals.totalCuttingVolume += Number(cuttingVolumeCubicMtr);
      totals.totalFillingVolume += Number(fillingVolumeCubicMtr);
      prevSection = chainage;
    });

    return { ...totals, rows, areaReport };
  }, [survey]);

  const fieldBookData = useMemo(() => {
    if (!purpose) return [];
    return calculateTableData(purpose);
  }, [purpose]);

  useEffect(() => {
    tableDataRef.current = tableData;
  }, [tableData]);

  useEffect(() => {
    if (csTableData.length) {
      handleDownloadAllChainage();
    }
  }, [csTableData]);

  useEffect(() => {
    if (lsTableData.length) {
      handleGenerateLs();
    }
  }, [lsTableData]);

  useEffect(() => {
    fetchSurvey();
  }, []);

  return (
    <Box p={2}>
      <ExportLoader open={loading} />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        spacing={2}
        mb={2}
      >
        <Box
          sx={{
            border: "1px solid #EFEFEF",
            borderRadius: "9px",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            mb: "24px",
          }}
          onClick={() => navigate(-1)}
        >
          <MdArrowBackIosNew />
        </Box>

        <Box textAlign={"end"}>
          <BasicMenu
            label={<BsThreeDots />}
            items={menuItems}
            onSelect={handleMenuSelect}
            sx={{ minWidth: "fit-content", p: 1 }}
          />
        </Box>
      </Stack>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <FieldBookTable
          tableData={fieldBookData}
          isEditing={false}
          onFieldChange={() => {}}
          onRLChange={() => {}}
        />
      </TableContainer>

      <Typography
        variant="h6"
        fontSize={18}
        fontWeight={700}
        align="center"
        mt={4}
        mb={2}
      >
        Volume Report {reportDetails.current.initialEntry} and
        {reportDetails.current.secondaryEntry}
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: "90vh" }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead
            sx={{
              backgroundColor: "#f4f6f8",
              "& .MuiTableCell-root": {
                border: "1px solid rgba(224, 224, 224, 1)",
                fontWeight: 700,
              },
              position: "sticky",
              top: 0,
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                Sl.No.
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                Section From
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                Previous Section
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                Difference
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                Width
              </TableCell>

              {showArea?.cutting && (
                <TableCell sx={{ fontWeight: 700 }} colSpan={4} align="center">
                  Cutting Volume
                </TableCell>
              )}

              {showArea?.filling && (
                <TableCell sx={{ fontWeight: 700 }} colSpan={4} align="center">
                  Filling Volume
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              {showArea?.cutting && (
                <>
                  <TableCell sx={{ fontWeight: 700 }}>Area Sq. Mtrs</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Previous Area</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Average Sq. Mtrs
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Volume Cubic Meters
                  </TableCell>
                </>
              )}

              {showArea?.filling && (
                <>
                  <TableCell sx={{ fontWeight: 700 }}>Area Sq. Mtrs</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Previous Area</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Average Sq. Mtrs
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Volume Cubic Meters
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData?.rows?.map((row, index) => (
              <React.Fragment key={index}>
                {row.isDeductionRow && (
                  <TableRow>
                    <TableCell colSpan={13}>{row.deductionMessage}</TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.section}</TableCell>
                  <TableCell>{row.prevSection}</TableCell>
                  <TableCell>{row.difference}</TableCell>
                  <TableCell>{row.width}</TableCell>
                  {showArea?.cutting && (
                    <>
                      <TableCell>{row.cuttingAreaSqMtr}</TableCell>
                      <TableCell>{row.cuttingPrevArea}</TableCell>
                      <TableCell>{row.cuttingAvgSqrMtr}</TableCell>
                      <TableCell>{row.cuttingVolumeCubicMtr}</TableCell>
                    </>
                  )}
                  {showArea?.filling && (
                    <>
                      <TableCell>{row.fillingAreaSqMtr}</TableCell>
                      <TableCell>{row.fillingPrevArea}</TableCell>
                      <TableCell>{row.fillingAvgSqrMtr}</TableCell>
                      <TableCell>{row.fillingVolumeCubicMtr}</TableCell>
                    </>
                  )}
                </TableRow>
              </React.Fragment>
            ))}

            <TableRow>
              <TableCell colSpan={5}></TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>

              {showArea?.cutting && (
                <>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {Number(tableData?.totalCuttingVolume)?.toFixed(3)}
                  </TableCell>
                </>
              )}

              {showArea?.filling && (
                <>
                  <TableCell colSpan={showArea?.cutting ? 3 : 2}></TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>
                    {Number(tableData?.totalFillingVolume)?.toFixed(3)}
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box id="area-report" mt={4}>
        <Typography
          variant="h6"
          fontSize={18}
          fontWeight={700}
          align="center"
          mb={2}
        >
          Area Report Between {reportDetails.current.initialEntry} and
          {reportDetails.current.secondaryEntry}
        </Typography>

        {tableData?.areaReport?.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: "90vh" }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead
                sx={{
                  backgroundColor: "#f4f6f8",
                  "& .MuiTableCell-root": {
                    border: "1px solid rgba(224, 224, 224, 1)",
                    fontWeight: 700,
                  },
                  position: "sticky",
                  top: 0,
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                    Sl.No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                    Distance Meters
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                    {reportDetails?.current?.initialEntry || ""} Meters
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} rowSpan={2}>
                    {reportDetails?.current?.secondaryEntry || ""} Meters
                  </TableCell>
                  {showArea?.cutting && (
                    <TableCell
                      sx={{ fontWeight: 700 }}
                      colSpan={4}
                      align="center"
                    >
                      Cutting Area
                    </TableCell>
                  )}
                  {showArea?.filling && (
                    <TableCell
                      sx={{ fontWeight: 700 }}
                      colSpan={4}
                      align="center"
                    >
                      Filling Area
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  {showArea?.cutting && (
                    <>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Cutting Meters
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Avg Meters</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Width Meters
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Area Sq. Mtrs
                      </TableCell>
                    </>
                  )}

                  {showArea?.filling && (
                    <>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Filling Meters
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Avg Meters</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Width Meters
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Area Sq. Mtrs
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.areaReport.map((row, index) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell colSpan={12} sx={{ fontWeight: "bold" }}>
                        Section: {row.section}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={12} sx={{ py: 1.8 }}></TableCell>
                    </TableRow>

                    {row?.data?.map((entry, idx) => (
                      <TableRow key={`${index}-${idx}`}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{entry.offset}</TableCell>
                        <TableCell>{entry.initialEntryRL}</TableCell>
                        <TableCell>{entry.secondaryEntryRL}</TableCell>

                        {showArea?.cutting && (
                          <>
                            <TableCell>{entry.cuttingMtr}</TableCell>
                            <TableCell>{entry.cuttingAvgMtr}</TableCell>
                            <TableCell>{entry.cuttingWMtr}</TableCell>
                            <TableCell>{entry.cuttingAreaSqMtr}</TableCell>
                          </>
                        )}

                        {showArea?.filling && (
                          <>
                            <TableCell>{entry.fillingMtr}</TableCell>
                            <TableCell>{entry.fillingAvgMtr}</TableCell>
                            <TableCell>{entry.fillingWMtr}</TableCell>
                            <TableCell>{entry.fillingAreaSqMtr}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell colSpan={4}></TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      {showArea?.cutting && (
                        <>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {Number(row?.totalCuttingAreaSqMtr)?.toFixed(3)}
                          </TableCell>
                        </>
                      )}
                      {showArea?.filling && (
                        <>
                          <TableCell
                            colSpan={showArea?.cutting ? 3 : 2}
                          ></TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {Number(row?.totalFillingAreaSqMtr)?.toFixed(3)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Loading ...</Typography>
        )}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        mt={2}
      >
        {selectedLs && selectedLs?.series?.length && (
          <Box className="pdf-chart-item" sx={{ width: "100%" }}>
            <CrossSectionChart
              selectedCs={selectedLs}
              chartOptions={chartOptions}
            />
          </Box>
        )}

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
        >
          [Hor Scale – 1 in 150 : Ver Scale – 1 in 150]
        </Typography>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        mt={2}
      >
        {allCs?.length > 0 &&
          allCs.map((cs, key) => (
            <Box key={key} className="pdf-chart-item" sx={{ mb: 4 }}>
              <CrossSectionChartV2
                selectedCs={cs}
                chartOptions={cs.specificOptions || chartOptions}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default PlottingAndQuantityReport;
