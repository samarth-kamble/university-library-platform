import { eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";
type InitialData = {
  email: string;
  fullname: string;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const THREE_DAYS_MS = 3 * ONE_DAY_MS; // 3 days in milliseconds
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS; // 30 days in milliseconds;

const getUserState = async (email: string): Promise<UserState> => {
  const userState = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userState.length === 0) return "non-active";

  const lastActivityDate = new Date(userState[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_MS && timeDifference <= THIRTY_DAYS_MS) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullname } = context.requestPayload;

  console.log("WORKFLOW PAYLOAD", email, fullname);

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the platform",
      message: `Hi ${fullname}, welcome to the platform!`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run(
      "check-user-state",
      async () => await getUserState(email)
    );

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Hmm, it's been a while",
          message: `Hi ${fullname}, it's been a while since you last logged in. We hope you're doing well!`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Woah, you're still here!",
          message: `Hi ${fullname}, it's good to see you active and learning new things!`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
