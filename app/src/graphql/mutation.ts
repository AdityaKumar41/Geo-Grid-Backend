export const mutation = `#graphql
    createEmployee(
    name: String!
    profileImage: String!
    password: String!
    gender: String!
    age: Int!
    phoneNo: String!
    email: String!
    position: String!
  ): Employee!

  updateEmployee(
    id: ID!
    name: String
    profileImage: String
    gender: String
    age: Int
    email: String
    position: String
  ): Employee!

  deleteEmployee(id: ID!): Employee!

  # createAdmin(
  #   name: String!
  #   email: String!
  #   password: String!
  #   profileImage: String
  # ): Admin!

  # updateAdmin(
  #   id: ID!
  #   name: String
  #   email: String
  #   password: String
  #   profileImage: String
  # ): Admin!

  # deleteAdmin(id: ID!): Admin!

  createAttendance(
    employeeId: ID!
    adminId: ID!
    timestamp: DateTime
    status: AttendanceStatus!
  ): Attendance!

  updateAttendance(
    id: ID!
    status: AttendanceStatus
  ): Attendance!

  # deleteAttendance(id: ID!): Attendance!

  createAttendancePair(
    employeeId: ID!
    adminId: ID!
    date: DateTime!
    checkInId: ID
    checkOutId: ID
  ): AttendancePair!

  updateAttendancePair(
    id: ID!
    checkInId: ID
    checkOutId: ID
  ): AttendancePair!

  checkIn(employeeId: ID!): AttendancePair!

  checkOut(employeeId: ID!): AttendancePair!

  # deleteAttendancePair(id: ID!): AttendancePair!
`;
