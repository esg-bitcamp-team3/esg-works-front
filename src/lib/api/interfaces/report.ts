import { User } from "@/lib/interfaces/auth";
import { Corporation } from "./corporation";

export interface Report {
  id: string;
  title: string;
  content: string;
  userId: string; // User_id 참조
  corp: Corporation;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isInterestedReport: boolean;
}

export interface ReportDetail {
  id: string;
  title: string;
  content: string;
  userId: string; // User_id 참조
  corp: Corporation;
  createdAt: string;
  createdBy: User;
  updatedAt: string;
  updatedBy: User;
  isInterestedReport: boolean;
}

export interface SortProp {
  sortField: string;
  direction: string;
}

export interface InterestReport {
  interestReportId: string;
  report: Report;
  userId: string;
  checkTime: string;
}

export interface Template {
  templateId: string;
  title: string;
  content: string;
}
