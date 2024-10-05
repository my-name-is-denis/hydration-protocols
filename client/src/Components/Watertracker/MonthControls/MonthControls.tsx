import React from "react";
import { useMonthControls } from "./MonthControls.hooks";
import { Grid } from "@mui/material";
import { TimeTraverseModal } from "../Modals/TimeTraverseModal/TimeTraverseModal";
import { Statistics } from "../DataToView/Statistics/Statistics";
import classes from "./MonthControls.module.css";

/**
 * MonthControls component for month overview and time navigation
 */
const MonthControls: React.FC = () => {
  // get all necessary data and functions for month controls
  const monthControls = useMonthControls();

  return (
    <>
      {monthControls.showTimeTraverse && (
        <TimeTraverseModal
          loadSetTime={monthControls.loadSetTime}
          closeModal={monthControls.closeModal}
          timeTraverseProps={monthControls.timeTraverseProps}
        />
      )}
      <Grid item xs={12}>
        <div className={classes["month-controls-container"]}>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes["header"]}>
                {monthControls.translations.title}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <div
                onClick={monthControls.openModal}
                className={classes["button"]}
              >
                <div className={classes["button-output"]}>
                  {monthControls.translations.navigate}
                </div>
              </div>
            </Grid>
          </Grid>
          <Statistics {...monthControls.statisticsConfig} />
        </div>
      </Grid>
    </>
  );
};

export default MonthControls;
