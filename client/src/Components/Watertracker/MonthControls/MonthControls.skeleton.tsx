import React from "react";
import { Grid, Skeleton } from "@mui/material";
import classes from "./MonthControls.module.css";

/**
 * Skeleton component for month controls if data is loading
 */
const MonthControlsSkeleton: React.FC = () => {
  return (
    <Grid item xs={12}>
      <div className={classes["month-controls-container"]}>
        <Grid container>
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <Skeleton
              className="mb-7"
              variant="rounded"
              width={"10rem"}
              height={"1.5rem"}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Skeleton
              className="mb-7"
              variant="rounded"
              width={"14rem"}
              height={"3rem"}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export { MonthControlsSkeleton };
