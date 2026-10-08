export interface PaginationProps {
  totalElements: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}