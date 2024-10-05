import React from "react";
import { useLoadMonthData } from "../Hooks/LoadMonthData";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getMonthStats } from "../WaterTracker.utils";
import { getMonthKey } from "../../../Utils/Time.utils";
import { RootState } from "../../../Reducers/Store";
import { MonthIndex } from "../../../Types/Global.types";
import { CURRENT_YEAR } from "../../../Constants";

const useMonthControls = () => {
  const { timeTraverse, selectedMonth, selectedYear, month } = useSelector(
    (state: RootState) => state.waterTracker
  );
  const [monthIndex, setMonthIndex] = React.useState(timeTraverse.month);
  const [year, setYear] = React.useState(timeTraverse.year);

  const [showTimeTraverse, setShowTimeTraverse] = React.useState(false);

  const { loadMonth } = useLoadMonthData();

  // get translations
  const { t } = useTranslation();
  const translations = {
    title: t("archive.title", {
      month: t(`timeUnits.months.${getMonthKey(selectedMonth)}`),
      year: selectedYear,
    }),
    buttonDesc: t("archive.buttonDesc"),
    navigate: t("archive.navigate"),
  };

  // get month statistics and set config object for statistics component
  const monthStats = month && getMonthStats(month);
  const statisticsConfig = {
    max: monthStats?.maxAmount ? monthStats.maxAmount : null,
    average: monthStats?.averageAmount ? monthStats.averageAmount : null,
    daysLeft:
      monthStats && typeof monthStats?.daysInMonthLeft === "number"
        ? monthStats.daysInMonthLeft
        : null,
    daysInTotal: monthStats?.daysInMonth ? monthStats.daysInMonth : null,
    goalsReached: monthStats?.goalReachedCounter
      ? monthStats.goalReachedCounter
      : 0,
  };

  // set month and year on timeTraverse change in local state
  React.useEffect(() => {
    setMonthIndex(timeTraverse.month);
    setYear(timeTraverse.year);
  }, [timeTraverse]);

  /**
   * load month data based on year and month
   */
  const loadSetTime = async () => {
    // close modal for time navigation
    setShowTimeTraverse(false);

    // load month data
    await loadMonth(year, monthIndex as MonthIndex);
  };

  const setPreviousYear = () => {
    // limitation -10 years
    if (year > CURRENT_YEAR - 10) {
      setYear(year - 1);
    } else {
      setYear(CURRENT_YEAR);
    }
  };

  const setNextYear = () => {
    // limitation +10 years
    if (year < CURRENT_YEAR + 10) {
      setYear(year + 1);
    } else {
      setYear(CURRENT_YEAR);
    }
  };

  const setPreviousMonth = () => {
    if (monthIndex <= 0) {
      // switch to december after juanuary
      setMonthIndex(11);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const setNextMonth = () => {
    if (monthIndex < 11) {
      setMonthIndex(monthIndex + 1);
    } else {
      //jump to january after december
      setMonthIndex(0);
    }
  };

  /**
   * open modal for time navigation
   */
  const openModal = () => {
    setShowTimeTraverse(true);
  };

  /**
   * close on cancel modal for time navigation
   */
  const closeModal = () => {
    // reset changed values back to origin
    setMonthIndex(timeTraverse.month);
    setYear(timeTraverse.year);

    setShowTimeTraverse(false);
  };

  // props for time traverse component
  const timeTraverseProps = {
    setNextMonth,
    setPreviousMonth,
    setNextYear,
    setPreviousYear,
    year,
    month: monthIndex,
  };

  return {
    loadSetTime,
    closeModal,
    openModal,
    timeTraverseProps,
    showTimeTraverse,
    selectedMonth,
    selectedYear,
    statisticsConfig,
    translations,
  };
};

export { useMonthControls };
