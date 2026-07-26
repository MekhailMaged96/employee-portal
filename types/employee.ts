export interface Department {
  id: number;
  name: string;
}

export interface EmployeeUser {
  email: string;
  roles: string[];
}

export interface Employee {
  id: number;
  name: string;
  salary: number;
  department: Department | null;
  user: EmployeeUser | null;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
