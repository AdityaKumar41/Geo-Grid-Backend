type EmployeeAttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

interface Employee {
  name: string;
  profileImage: string;
  gender: string;
  age: number;
  phoneNo: string;
  position: string;
  email: string;
}

interface UpdateEmployeeInput {
  id: string;
  name?: string;
  profileImage?: string;
  gender?: string;
  age?: number;
  phoneNo?: string;
  email?: string;
  position?: string;
}

interface DeleteEmployeeInput {
  id: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  adminId: string;
  timestamp?: Date;
  status: EmployeeAttendanceStatus;
}

interface UpdateAttendanceInput {
  id: string;
  status?: EmployeeAttendanceStatus;
}

interface AttendancePair {
  id: string;
  employeeId: string;
  adminId: string;
  date: Date;
  checkInId?: string;
  checkOutId?: string;
}

interface UpdateAttendancePairInput {
  id: string;
  checkInId?: string;
  checkOutId?: string;
}
