export const query = `#graphql
    VerifyAdmin(email: String!, password: String!): Admin
    VerifyEmployee(email: String!, password: String!): Employee
    AttendanceByDate(date: DateTime!): [Attendance!]!
    AttendanceByEmployee(employeeId: ID!): [Attendance!]!
    AttendanceByWeek(week: Int!): [Attendance!]!
    employees: [Employee!]!
  employee(id: ID!): Employee
  admins: [Admin!]!
  admin(id: ID!): Admin
  attendances: [Attendance!]!
  attendance(id: ID!): Attendance
  attendancePairs: [AttendancePair!]!
  attendancePair(id: ID!): AttendancePair
    
`;
