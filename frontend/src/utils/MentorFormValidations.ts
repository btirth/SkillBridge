// Validation utility functions for ApplyMentor form

import dayjs from "dayjs";

export const validateFirstName = (value: string): string => {
  if (!value.trim()) return "First name is required.";
  return "";
};

export const validateLastName = (value: string): string => {
  if (!value.trim()) return "Last name is required.";
  return "";
};

export const validateGender = (value: string): string => {
  if (!value.trim()) return "Gender is required.";
  return "";
};

export const validateEmail = (value: string): string => {
  if (!value.trim()) return "Email is required.";
  if (!/\S+@\S+\.\S+/.test(value)) return "Email address is invalid.";
  return "";
};

export const validatePhoneNumber = (value: number): string => {
  if (!value) return "Phone number is required.";
  if (value.toString().length !== 10)
    return "Phone number must be 10 digits long.";
  return "";
};

export const validateExperience = (value: number): string => {
  if (value < 2)
    return "Minimum of 2 years of experience is required to apply.";
  return "";
};

export const validateAreaOfExpertise = (values: string[]): string => {
  if (values.length === 0)
    return "At least one area of expertise must be selected.";
  return "";
};

export const validateAvailability = (
  values: { day: string; from: string; to: string; isActive: boolean }[]
): string => {
  if (values.every((value) => !value.isActive))
    return "Availability must be set.";
  return "";
};

export const validateFile = (file: File | null): string => {
  if (!file) return "Please upload your resume.";
  if (file.type !== "application/pdf") return "Resume must be a PDF file.";
  return "";
};

export const validateTerms = (isChecked: boolean): string => {
  if (!isChecked) return "You must accept the terms and conditions.";
  return "";
};

export const validateDateOfBirth = (value: dayjs.Dayjs | null): string => {
  if (!value) return "Date of birth is required.";

  const currentDate = dayjs();
  const minimumAgeDate = currentDate.subtract(18, "year");

  if (value.isAfter(minimumAgeDate)) {
    return "You must be at least 18 years old.";
  }

  return "";
};
