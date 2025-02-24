interface PaginationMetadata {
    total_count: number;
    current_page: number;
    total_pages: number;
    items_per_page: number;
  }

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: PaginationMetadata;  // This should be separate from the data
    status_code?: number;
    cacheable?: boolean;
  }