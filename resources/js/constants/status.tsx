export const APPROVAL_STATUS_BADGE: Record<string, string> = {
  Disetujui: "bg-green-100 text-green-700",
  Menunggu: "bg-amber-100 text-amber-700",
  "Menunggu Validasi": "bg-amber-100 text-amber-700",
  Ditolak: "bg-red-100 text-red-700",
  "Belum Diunggah": "bg-gray-100 text-gray-500",
};

export const getApprovalStatusBadge = (status: string | undefined | null) => {
  if (!status) return "bg-gray-100 text-gray-500";
  return APPROVAL_STATUS_BADGE[status] ?? "bg-gray-100 text-gray-500";
};

export const APPROVAL_STATUS_BORDER: Record<string, string> = {
  Disetujui: "border-green-500",
  Menunggu: "border-amber-500",
  "Menunggu Validasi": "border-amber-500",
  Ditolak: "border-red-500",
};

export const getApprovalStatusBorder = (status: string | undefined | null) => {
  if (!status) return "border-gray-300";
  return APPROVAL_STATUS_BORDER[status] ?? "border-gray-300";
};

import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";

export const ApprovalStatusIcon = ({ status, size = 14 }: { status: string; size?: number }) => {
  if (status === "Disetujui") return <CheckCircle size={size} className="text-green-500" />;
  if (status === "Menunggu" || status === "Menunggu Validasi") return <Clock size={size} className="text-amber-500" />;
  if (status === "Ditolak") return <XCircle size={size} className="text-red-500" />;
  return <FileText size={size} className="text-gray-400" />;
};
