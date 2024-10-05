import React from "react";
import { useWaterTrackerInitializer } from "../WaterTracker.hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers/Store";
import { Grid } from "@mui/material";
import { Month } from "../DataToView";
import MonthControls from "../MonthControls/MonthControls";
import { MonthSkeleton } from "../DataToView/Month/Month.skeleton";
import { MonthControlsSkeleton } from "../MonthControls/MonthControls.skeleton";
import classes from "./MonthTraverse.module.css";

/**
 * Component for displaying month and month navigation
 */
const MonthTraverse: React.FC = () => {
  // get time traverse data from redux and initialize date for data initialization
  const { timeTraverse } = useSelector(
    (state: RootState) => state.waterTracker
  );
  const date = new Date(timeTraverse.year, timeTraverse.month, 1);

  // initialize all necessary data for water tracker and provide them to components
  const { initialLoading } = useWaterTrackerInitializer(date);

  // if month data is loading then show skeleton
  const MonthOnLoading = initialLoading ? MonthSkeleton : Month;

  // if data is loading then show skeleton
  const MonthControlsEl = initialLoading
    ? MonthControlsSkeleton
    : MonthControls;

  return (
    <div className={`lg:my-3 my-0 ${classes["wrapper"]}`}>
      <Grid container spacing={{ xs: 1 }} alignItems={"center"}>
        <MonthControlsEl />
        <MonthOnLoading />
      </Grid>
    </div>
  );
};

export { MonthTraverse };
