import {
  DatePickerProps,
  DatePicker as OriginalDatePicker,
  PickerValidDate,
} from "@mui/x-date-pickers";
import React from "react";
import { ChangeHandler } from "react-hook-form";

type CustomDatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
> = Omit<
  DatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
  "onChange" | "defaultValue"
> & {
  onChange: ChangeHandler;
  defaultValue?: string | null;
};
export const MyDatePicker = React.forwardRef(function <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
>(
  {
    onChange,
    name,
    defaultValue,
    value,
    ...props
  }: CustomDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <OriginalDatePicker
      inputRef={ref}
      slotProps={{ textField: { fullWidth: true } }}
      onChange={(date) => {
        if (isNaN(date as any)) {
          onChange({ target: { value, name: name } });
        } else {
          onChange({ target: { value: date?.toISOString(), name: name } });
        }
      }}
      name={name}
      defaultValue={defaultValue ? (new Date(defaultValue) as any) : undefined}
      {...props}
    />
  );
});
