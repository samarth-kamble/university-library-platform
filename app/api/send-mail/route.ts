import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import config from "@/lib/config";

export async function POST(req: Request) {
  const { email, subject, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: config.env.smtp.mail,
      pass: config.env.smtp.password,
    },
  });

  try {
    await transporter.sendMail({
      from: `"BookWise - Library " <${config.env.smtp.mail}>`,
      to: email,
      subject,
      html: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
