import { TStatus } from "./semesterRegistration.interface";

export const Status: TStatus[] = ["UPCOMING", "ONGOING", "ENDED"];

export const semesterRegistrationStatus = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;
