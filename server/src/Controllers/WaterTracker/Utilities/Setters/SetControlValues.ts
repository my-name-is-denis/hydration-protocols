import { Request, Response } from "express";
import { HTTPStatusCodes } from "../../../../Constants/Constants";
import { formatStringToDate, isDateStringValid } from "../../../../Utils/Time";
import { waterTrackerGetModel } from "../../../../Model/WaterTracker.get";
import { waterTrackerSetModel } from "../../../../Model/WaterTracker.set";
import { sendInternalErrorMessage } from "../../../index.utils";
import { ErrorMessages } from "../../../index.enums";
import { isAmountRangeValid, isGoalRangeValid } from "../../WaterTracker.utils";

/**
 * set control values
 * @param req - Controls { amount: number, goal: number, type: string }
 * @param res - updated control values
 */
async function setControlValues(req: Request, res: Response) {
  // Authentication check
  if (!req.user) {
    return res.status(HTTPStatusCodes.UNAUTHORIZED).send("Unauthorized");
  }
  try {
    // validate daily amount and send an error req
    const errors = validateControlValues(req.body);
    if (errors.length > 0) {
      return res.status(HTTPStatusCodes.BAD_REQUEST).send({ error: errors });
    }

    // get values from request body
    const { amount, goal, type, date } = req.body as {
      amount: number;
      goal: number;
      type: string;
      date: string;
    };
    const uid = req.user.uid;

    // get date object from incoming string
    const dateObj = formatStringToDate(date, "DD.MM.YYYY");

    // get previous control values and day data
    const controls = await waterTrackerGetModel.getControls(uid);
    const day = await waterTrackerGetModel.getDay(dateObj, uid);

    // send error if the values are not found
    if (!controls || !day) {
      return res
        .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: "Values not found" });
    }

    // set control values and get updated ones
    await waterTrackerSetModel.setControls(
      { goal: controls.goal, type, amount },
      uid
    );
    const updatedValues = await waterTrackerGetModel.getControls(uid);

    // update daily goal and get updated value
    await waterTrackerSetModel.setDailyGoal(goal, dateObj, uid);
    const updatedGoal = await waterTrackerGetModel.getDailyGoal(dateObj, uid);

    // send error if the values are not found
    if (!updatedValues) {
      return res
        .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: "Unable to update" });
    }

    // set response with updated control values
    const response = {
      amount: updatedValues.amount,
      goal: updatedGoal,
      type: updatedValues.type,
      date,
    };

    res.status(HTTPStatusCodes.OK).send(response);
  } catch (error) {
    sendInternalErrorMessage(res);
  }
}

/**
 * validate control values from incoming request
 */
const validateControlValues = (body: any) => {
  const errors = [];
  const { amount, goal, type, date } = body;

  // check for date format
  if (!isDateStringValid(date, "DD.MM.YYYY")) {
    errors.push(ErrorMessages.invalidDate);
  }

  // check for amount range
  if (!isAmountRangeValid(amount)) {
    errors.push(ErrorMessages.invalidControlAmount);
  }

  // check for goal range
  if (!isGoalRangeValid(goal)) {
    errors.push(ErrorMessages.invalidGoal);
  }

  // check for invalid type
  if (
    typeof type !== "string" ||
    (typeof type === "string" && type.length > 40)
  ) {
    errors.push(ErrorMessages.invalidTypeProperty);
  }

  return errors;
};

export { setControlValues };
