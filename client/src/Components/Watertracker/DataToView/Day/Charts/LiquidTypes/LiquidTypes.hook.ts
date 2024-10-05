import { useSelector } from "react-redux";
import { RootState } from "../../../../../../Reducers/Store";
import { generateRandomRGB } from "../../../../../../Utils/Color.utils";
import { MakeOptional } from "@mui/x-charts/internals";
import { PieChartSlotProps, PieSeriesType, PieValueType } from "@mui/x-charts";
import { SxProps } from "@mui/material";
import { Theme } from "@emotion/react";
import { SingleDayData } from "../../../../../../Types/WaterTracker.types";

function useLiquidTypes(colors: string[], day: SingleDayData | null) {
  const { contentIsLoading } = useSelector(
    (state: RootState) => state.waterTracker
  );

  // create map of liquid types
  const liquidTypes = new Map();
  if (day && day.activity) {
    // iterate over hourly activity
    day.activity.forEach((hour) => {
      // check if the element is an array and has content
      if (Array.isArray(hour) && hour.length > 0) {
        // iterate over the array and sum up the amount of each liquid type
        hour.forEach((item) => {
          // if liquid type is already in the map then add the amount to the existing amount
          if (liquidTypes.has(item.type)) {
            liquidTypes.set(
              item.type,
              liquidTypes.get(item.type) + item.amount
            );
          } else {
            liquidTypes.set(item.type, item.amount);
          }
        });
      }
    });
  }

  // set up the data for the chart
  const data = [] as {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
  let index = 0;
  liquidTypes.forEach((value, key) => {
    data.push({
      id: key,
      label: key,
      value: value,
      color: `${colors[index] ? colors[index] : generateRandomRGB()}`,
    });
    index++;
  });

  const chartConfig = {
    series: [
      {
        data,
        innerRadius: 27,
        outerRadius: 97,
        paddingAngle: 3,
        cornerRadius: 5,
        cx: 132,
        cy: 132,
        highlightScope: { faded: "global", highlighted: "item" },
        faded: {
          innerRadius: 34,
          additionalRadius: -17,
          color: "gray",
        },
        valueFormatter: (value) => `${value.value} ml`,
      },
    ] as MakeOptional<
      PieSeriesType<MakeOptional<PieValueType, "id">>,
      "type"
    >[],
    slotProps: {
      legend: { hidden: true },
    } as PieChartSlotProps,
    sx: { "&&": { touchAction: "auto" } } as SxProps<Theme>,
  };

  return { data, chartConfig, contentIsLoading };
}

export { useLiquidTypes };
