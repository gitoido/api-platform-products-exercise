import moment from "moment";

export function formatDateTime(date?: string): string | null {
  if (!date) return null;

  return moment(date).format("DD/MM/YYYY");
}

export function formatDateInput(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return moment(value).format("YYYY-MM-DD");
}

