import { prismaClient } from "../../client";
import nodemailer from "nodemailer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import crypto from "crypto"; // Import the crypto module

const s3ClientInstance = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);

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
  getSignedUrl: async (
    parent: any,
    args: { fileType: string; fileName: string },
    context: User
  ) => {
    if (!context.user) {
      throw new Error("You are not authorized to perform this action");
    }
    if (!args.fileName || !args.fileType) {
      throw new Error("File name is required");
    }
    const { fileName, fileType } = args;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "audio/mpeg",
      "audio/mp3",
    ];

    if (!allowedTypes.includes(fileType)) {
      throw new Error("Invalid file type");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      // make sure change to folder name as per employee id
      Key: `upload/${context.user.id}/${fileName}`,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3ClientInstance, command, {
      expiresIn: 60 * 5,
    });

    return signedUrl;
  },
};

const mutation = {
  createEmployee: async (parent: any, args: Employee, context: User) => {
    // check admin or not
    const id = context.user.id;
    if (!id) {
      throw new Error("You are not authorized to perform this action");
    }
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: id,
      },
    });

    if (!admin) {
      throw new Error("You are not authorized to perform this action");
    }

    // Generate a unique password
    const uniquePassword = crypto.randomBytes(8).toString("hex");

    const employee = await prismaClient.employee.create({
      data: {
        name: args.name,
        email: args.email,
        password: uniquePassword, // Use the generated password
        position: args.position,
        age: args.age,
        phoneNo: args.phoneNo,
        gender: args.gender,
        profileImage: args.profileImage,
        admin: { connect: { id: context.user.id } },
      },
    });

    if (!employee) {
      throw new Error("Failed to create employee");
    }

    // nodemailer setup

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace "smtp.gmail.com" with "gmail"
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: employee.email, // Recipient's email address
      subject: "Hello from NodeMailer", // Subject line
      text: "This is a test email sent from Node.js using NodeMailer!", // Plain text body
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Company</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #007bff;
            color: white;
            text-align: center;
            padding: 20px;
          }
          .header h1 {
            margin: 0;
          }
          .content {
            padding: 20px;
          }
          .content p {
            line-height: 1.6;
            color: #333333;
          }
          .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #555555;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to Geo-Grid !</h1>
          </div>
          <div class="content">
            <p>Hi ${employee.name}</p>
            <p>We are excited to welcome you to our team at Geo-Grid! Your account has been successfully created by our admin. Below are your account details:</p>
            <ul>
              <li><strong>Email:</strong> ${employee.email}</li>
              <li><strong>Temporary Password:</strong> ${uniquePassword}</li>
              <li><strong>Position:</strong> ${employee.position}</li>
            </ul>
            <p>Please log in to your account and update your password as soon as possible. If you have any questions or need assistance, feel free to reach out to the HR team.</p>
            <a href="[Login URL]" class="cta-button">Log In to Your Account</a>
            <p>Welcome aboard! We look forward to working with you.</p>
            <p>Best regards,</p>
            <p><strong>The Geo-Grid Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Geo-Grid. All rights reserved.</p>
            <p>CUTM | 9329725090</p>
          </div>
        </div>
      </body>
      </html>
`, // HTML body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(`Error: ${error}`);
      }
      console.log(`Email sent: ${info.response}`);
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