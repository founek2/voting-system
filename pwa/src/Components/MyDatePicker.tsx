import { PickerValidDate } from "@mui/x-date-pickers/models/pickers";
import {
  DatePickerProps,
  DatePicker as OriginalDatePicker,
} from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { ChangeHandler, Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

export function MyDatePickerControlled<
  TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  {
    control,
    name,
    defaultValue,
    label,
  }: UseControllerProps<TFieldValues, TName> & { label: string },
) {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue ? (new Date(defaultValue) as any) : undefined}
      control={control}
      render={({ field }) => {
        return <OriginalDatePicker
          slotProps={{ textField: { fullWidth: true } }}
          label={label}
          value={field.value ? new Date(field.value) : null}
          onChange={(date) => {
            field.onChange(date)
          }}
          name={name}
        />
      }}
    />
  );
};
