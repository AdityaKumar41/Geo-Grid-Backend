import { prismaClient } from "../../client";

const query = {
  VerifyAdmin: () => true,
  employees: async (parent: any, args: any, context: User) => {
    const id = context.user.id;
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }
    const employees = await prismaClient.employee.findMany({
      where: {
        adminId: id,
      },
    });
    return employees;
  },
  employee: async (parent: any, args: { id: number }, context: User) => {
    const id = context.user.id;
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }
    if (!args.id) {
      throw new Error("Employee ID is required");
    }
    const employee = await prismaClient.employee.findUnique({
      where: {
        id: id,
      },
    });
    return employee;
  },
};

const mutation = {
  createEmployee: async (parent: any, args: Employee, context: User) => {
    const id = context.user.id;
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }
    const employee = await prismaClient.employee.create({
      data: {
        name: args.name,
        email: args.email,
        password: args.password,
        position: args.position,
        age: args.age,
        phoneNo: args.phoneNo,
        gender: args.gender,
        profileImage: args.profileImage,
        admin: { connect: { id: id } },
      },
    });
    return employee;
  },
  updateEmployee: async (
    parent: any,
    args: UpdateEmployeeInput,
    context: User
  ) => {
    const id = context.user.id;
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }
    const employee = await prismaClient.employee.update({
      where: {
        id: args.id,
      },
      data: {
        name: args.name,
        email: args.email,
        position: args.position,
        profileImage: args.profileImage,
        age: args.age,
        phoneNo: args.phoneNo,
      },
    });
    return employee;
  },
  deleteEmployee: async (
    parent: any,
    args: DeleteEmployeeInput,
    context: User
  ) => {
    const id = context.user.id;
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }

    if (!args.id) {
      throw new Error("Employee ID is required");
    }

    const employee = await prismaClient.employee.delete({
      where: {
        id: id,
      },
    });

    return employee;
  },
};
const resolvers = {
  Query: query,
  Mutation: mutation,
};
export default resolvers;
