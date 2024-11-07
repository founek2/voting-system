import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import type { Election } from "../endpoints/types";
import {
  DatePicker as OriginalDatePicker,
  DatePickerProps,
  PickerValidDate,
} from "@mui/x-date-pickers";
import { ChangeHandler } from "react-hook-form";

type CustomDatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
> = Omit<
  DatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
  "onChange"
> & {
  onChange: ChangeHandler;
};
export const MyDatePicker = React.forwardRef(function <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
>(
  {
    onChange,
    name,
    ...props
  }: CustomDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <OriginalDatePicker
      ref={ref}
      slotProps={{ textField: { fullWidth: true } }}
      onChange={(date) => {
        onChange({ target: { value: date?.toISOString(), name: name } });
      }}
      name={name}
      {...props}
    />
  );
});

// export function MyDatePicker2<
//   TDate extends PickerValidDate,
//   TEnableAccessibleFieldDOMStructure extends boolean = false
// >({
//   onChange,
//   name,
//   ...props
// }: CustomDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>) {
//   return (
//     <OriginalDatePicker
//       slotProps={{ textField: { fullWidth: true } }}
//       onChange={(date) => {
//         onChange({ target: { value: date?.toISOString(), name: name } });
//       }}
//       name={name}
//       {...props}
//     />
//   );
// }
