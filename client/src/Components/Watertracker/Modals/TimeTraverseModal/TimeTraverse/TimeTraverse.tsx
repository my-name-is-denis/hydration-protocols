import React from "react";
import { getMonthKey } from "../../../../../Utils/Time.utils";
import { ArrowDirections } from "../../../../../Constants";
import classes from "./TimeTraverse.module.css";
import ArrowButton from "../../../../UI/ArrowButton/ArrowButton";
import { useTranslation } from "react-i18next";

const WIDTH = 150;

interface TimeTraverseProps {
  setNextMonth: () => void;
  setPreviousMonth: () => void;
  setNextYear: () => void;
  setPreviousYear: () => void;
  month: number;
  year: number;
}

/**
 * Component for traversing through time
 */
const TimeTraverse: React.FC<TimeTraverseProps> = ({
  setNextMonth,
  setPreviousMonth,
  setNextYear,
  setPreviousYear,
  month,
  year,
}) => {
  //get translations
  const { t } = useTranslation();
  const translations = {
    month: t("timeNavigation.month"),
    year: t("timeNavigation.year"),
    monthName: t(`timeUnits.months.${getMonthKey(month)}`),
  };

  // Props for the previous month button
  const prevMonthButtonProps = {
    description: t(
      `timeUnits.months.${getMonthKey(month === 0 ? 11 : month - 1)}`
    ),
    direction: ArrowDirections.left,
    width: WIDTH,
    clickHandler: setPreviousMonth,
    isClosed: false,
  };

  // Props for the next month button
  const nextMonthButtonProps = {
    description: t(
      `timeUnits.months.${getMonthKey(month === 11 ? 0 : month + 1)}`
    ),
    direction: ArrowDirections.right,
    width: WIDTH,
    clickHandler: setNextMonth,
    isClosed: false,
  };

  // Props for the previous year button
  const prevYearButtonProps = {
    description: (year - 1).toString(),
    direction: ArrowDirections.left,
    width: WIDTH,
    clickHandler: setPreviousYear,
    isClosed: year - 1 < 2014,
  };

  // Props for the next year button
  const nextYearButtonProps = {
    description: (year + 1).toString(),
    direction: ArrowDirections.right,
    width: WIDTH,
    clickHandler: setNextYear,
    isClosed: year + 1 > 2034,
  };

  return (
    <div className={`${classes.container} watertracker_day-controls-item`}>
      <div className={classes["time-traverse-values"]}>
        {translations.month}
      </div>
      <div className={classes["arrows-wrapper"]}>
        <ArrowButton {...prevMonthButtonProps} />
        <div className={classes["time-orientation"]}>
          {translations.monthName}
        </div>
        <ArrowButton {...nextMonthButtonProps} />
      </div>
      <div className={classes["time-traverse-values"]}>{translations.year}</div>
      <div className={classes["arrows-wrapper"]}>
        <ArrowButton {...prevYearButtonProps} />
        <div className={classes["time-orientation"]}>{year}</div>
        <ArrowButton {...nextYearButtonProps} />
      </div>
    </div>
  );
};

export default TimeTraverse;
