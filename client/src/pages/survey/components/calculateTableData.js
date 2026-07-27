import { calculateSurveyRows } from "../../../constants";

export function calculateTableData(survey) {
  if (!survey) return [];

  const rows = [];
  const context = {
    hi: 0,
    rl: survey.reducedLevel || 0,
    idx: 0,
  };

  let branchCounter = 0;

  // Helper function to process a set of rows (main or branch)
  const processRows = (
    purposeRows,
    surveyContext,
    isBranch = false,
    branchName = "",
    phase = "Actual",
  ) => {
    if (!purposeRows) return;
    if (isBranch) {
      rows.push({
        // non-editable header for branch
        rowIndex: -1,
        rowType: "-",
        CH: "",
        BS: "",
        IS: "",
        FS: "",
        HI: "",
        RL: "",
        Offset: "",
        remarks: `Branch - ${branchCounter}_ ${branchName}`,
      });
    }

    const calculatedRows = calculateSurveyRows(
      purposeRows,
      surveyContext?.reducedLevel ?? surveyContext?.surveyId?.reducedLevel,
      phase,
    );

    calculatedRows.forEach((row, pIndex) => {
      if (!row) return;

      switch (row.type) {
        case "Instrument setup": {
          // If it's a branch, we might use a specific RL, otherwise continue from current
          context.rl = Number(row.reducedLevels?.[0] ?? context.rl);
          context.hi = Number(row.heightOfInstrument || 0);
          rows.push(createRowObject(row, context, "BS", isBranch, pIndex));
          break;
        }

        case "Water Level": {
          const inter = row.intermediateSight || [];
          inter.forEach((isVal, i) => {
            const rlValue = row.reducedLevels?.[i] || "";
            rows.push({
              rowIndex: pIndex,
              rowType: row.type,
              index: i,
              CH: "",
              BS: "",
              IS: isVal ?? "",
              FS: "",
              HI: "", // Hide HI to match image (empty on non-setup rows)
              RL: rlValue,
              Offset: "",
              remarks: row.remark ?? "",
              isBranch,
            });
          });
          break;
        }

        case "Chainage": {
          const offsetsList = row.intermediateOffsets || [];
          offsetsList.forEach((entry, i) => {
            const rlValue = row.reducedLevels?.[i] || "";
            rows.push({
              rowIndex: pIndex,
              rowType: row.type,
              index: i,
              CH: i === 0 ? (row.chainage ?? "") : "",
              BS: "",
              IS: entry.is ?? "",
              FS: "",
              HI: "", // Hide HI to match image (empty on non-setup rows)
              RL: rlValue,
              Offset: entry.offset ?? "",
              remarks: entry.remark ?? "",
              isBranch,
            });
          });
          break;
        }

        case "TBM": {
          const inter = row.intermediateSight || [];
          inter.forEach((isVal, i) => {
            const rlValue = row.reducedLevels?.[i] || "";
            rows.push({
              rowIndex: pIndex,
              rowType: row.type,
              index: i,
              CH: "",
              BS: "",
              IS: isVal ?? "",
              FS: "",
              HI: "", // Hide HI to match image (empty on non-setup rows)
              RL: rlValue,
              Offset: "",
              remarks: row.remark ?? "",
              isBranch,
            });
          });
          break;
        }

        case "CP": {
          context.rl = Number(row.reducedLevels?.[0] ?? context.rl);
          context.hi = Number(row.heightOfInstrument || context.hi);
          rows.push(createRowObject(row, context, "CP", isBranch, pIndex));
          break;
        }

        case "Break": {
          rows.push({
            rowIndex: pIndex,
            rowType: row.type,
            CH: "",
            BS: "",
            IS: "",
            FS: "",
            HI: "",
            RL: "",
            Offset: "",
            remarks: `Break from - ${row?.from} to ${row?.to}`,
          });
        }
      }

      // RECURSION: Check for nested branches in THIS row
      if (row.upcomingBranches?.length > 0) {
        row.upcomingBranches.forEach((branchId) => {
          const branch = survey.branches?.find((b) => b._id === branchId);

          if (branch && branch.purposes?.[0]) {
            branchCounter++;
            processRows(
              branch.purposes[0].rows,
              {
                ...branch.surveyId,
                reducedLevel:
                  branch.purposes[0].startingReducedLevel ??
                  branch.surveyId?.reducedLevel,
              },
              true,
              branch.name,
              branch.purposes[0].phase,
            );
          }
        });
      }
    });
  };

  // Helper to keep the switch cleaner
  const createRowObject = (row, ctx, type, isBranch, sourceIndex) => ({
    // sourceIndex corresponds to purpose.rows index
    rowIndex: sourceIndex,
    rowType: row.type,
    CH: "",
    BS: row.backSight ?? "",
    IS: "",
    FS: type === "CP" ? (row.foreSight ?? "") : "",
    HI: ctx.hi.toFixed(3),
    RL: Number(ctx.rl).toFixed(3),
    Offset: "",
    remarks: row.remark ?? "",
    isBranch,
  });

  // Start the process with the main survey
  const mainPurpose = survey.purposes?.[0];
  processRows(
    mainPurpose?.rows,
    {
      ...survey,
      reducedLevel:
        mainPurpose?.startingReducedLevel ?? survey.reducedLevel,
    },
    false,
    "",
    mainPurpose?.phase,
  );

  // Final closure row (Logic remains similar)
  if (mainPurpose) {
    const finalFS = Number(mainPurpose.finalForesight || 0);
    const finalRl = context.hi - finalFS;
    const diff = finalRl - Number(survey.reducedLevel || 0);

    rows.push({
      rowIndex: -1,
      rowType: "Closure",
      CH: "",
      BS: "",
      IS: "",
      FS: finalFS.toFixed(3),
      HI: "",
      RL: finalRl.toFixed(3),
      Offset: "",
      diff,
      remarks: `Closed on Starting TBM at ${
        diff === 0
          ? "±0.000"
          : diff < 0
            ? diff.toFixed(3)
            : `+${diff.toFixed(3)}`
      }`,
    });
  }

  return rows;
}
