import React from "react";
import { useLiquidTypes } from "./LiquidTypes.hook";
import { useTranslation } from "react-i18next";
import { PieChart } from "@mui/x-charts";
import { Grid } from "@mui/material";
import { ChartIsLoading, ChartLegendList } from "../Charts";
import { SingleDayData } from "../../../../../../Types/WaterTracker.types";
import classes from "./LiquidTypes.module.css";
import classesChart from "../Charts.module.css";

/**
 * no data message
 */
const NoData = () => {
  // get translations
  const { t } = useTranslation();
  const message = t("tracker.emptyMessage");

  return (
    <div className={`${classesChart["no-data-container"]} lg:pt-14`}>
      <svg
        className={`${classesChart["icon"]} mb-3`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path d="M304 240l0-223.4c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16L304 240zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4L256 288 412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288l238.4 0z" />
      </svg>

      <h4 className={`${classesChart["no-data-text"]}`}>{message}</h4>
    </div>
  );
};

interface LiquidTypesProps {
  colors: string[];
  day: SingleDayData | null;
}

/**
 * Liquid Types Component: displays the liquid types and their amounts in a pie chart
 */
const LiquidTypes: React.FC<LiquidTypesProps> = ({ colors, day }) => {
  const { data, chartConfig, contentIsLoading } = useLiquidTypes(colors, day);

  // get translations
  const { t } = useTranslation();
  const translations = {
    chartTitle: t("tracker.todayPanel.liquidTypes.chartTitle"),
    listTitle: t("tracker.todayPanel.liquidTypes.listTitle"),
    ml: t("measuringUnits.ml"),
    hours: t("timeUnits.hours"),
  };

  // check if there is data to display
  const chartContent =
    data.length > 0 ? (
      <PieChart {...chartConfig} sx={{ "&&": { touchAction: "auto" } }} />
    ) : (
      <NoData />
    );
  const legendListContent =
    data.length > 0 ? <ChartLegendList data={data} /> : <NoData />;

  // show loading spinner if data is loading
  const legendList = contentIsLoading ? <ChartIsLoading /> : legendListContent;

  // show loading spinner if data is loading
  const chart = contentIsLoading ? (
    <ChartIsLoading />
  ) : (
    <div className={`flex flex-col justify-center items-center`}>
      <div className={`${classes["pie-chart"]}`}>{chartContent}</div>
    </div>
  );

  return (
    <div className={`${classes["container"]}`}>
      <Grid container>
        <Grid item xs={12}>
          <h3 className={`${classes["title"]}`}>{translations.chartTitle}</h3>
        </Grid>
        <Grid item sm={6} xs={12}>
          {chart}
        </Grid>
        <Grid item sm={6} xs={12}>
          {legendList}
        </Grid>
      </Grid>
    </div>
  );
};

export { LiquidTypes };
