export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;      // página actual (0-based)
  size: number;        // tamaño de página
}