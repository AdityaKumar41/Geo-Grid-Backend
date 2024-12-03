export const types = `#graphql
    scalar DateTime

enum AttendanceStatus {
  CHECKED_IN
  CHECKED_OUT
}

type Employee {
  id: ID!
  name: String!
  profileImage: String
  gender: String!
  age: Int!
  phoneNo: String!
  email: String!
  position: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  attendances: [Attendance!]!
  adminId: ID!
  admin: Admin!
  attendancePairs: [AttendancePair!]!
}

type Admin {
  id: ID!
  name: String!
  email: String!
  password: String!
  profileImage: String
  createdAt: DateTime!
  updatedAt: DateTime!
  employees: [Employee!]!
  attendances: [Attendance!]!
  attendancePairs: [AttendancePair!]!
}

type AttendancePair {
  id: ID!
  employeeId: ID!
  adminId: ID!
  date: DateTime!
  checkInId: ID
  checkOutId: ID
  checkIn: Attendance
  checkOut: Attendance
  createdAt: DateTime!
  updatedAt: DateTime!
  employee: Employee!
  admin: Admin!
}

type Attendance {
  id: ID!
  employeeId: ID!
  adminId: ID!
  timestamp: DateTime!
  status: AttendanceStatus!
  checkInPair: AttendancePair
  checkOutPair: AttendancePair
  createdAt: DateTime!
  updatedAt: DateTime!
  employee: Employee!
  admin: Admin!
}
`;
