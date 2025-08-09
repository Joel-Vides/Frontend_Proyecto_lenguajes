import type { BusModel } from "../../core/models/bus.models";

export interface OneBusResponse extends BusModel {
  id: string;
  companyId: string
  imageUrl?: string;
}