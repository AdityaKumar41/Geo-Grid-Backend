export const query = `#graphql
    VerifyAdmin(email: String!, password: String!): Admin
    employees: [Employee!]!
  employee(id: ID!): Employee
  admins: [Admin!]!
  admin(id: ID!): Admin
  attendances: [Attendance!]!
  attendance(id: ID!): Attendance
  attendancePairs: [AttendancePair!]!
  attendancePair(id: ID!): AttendancePair
    
`;
