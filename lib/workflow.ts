import { Client as Qstash, resend } from "@upstash/qstash";
import { Client as WorkflowClient } from "@upstash/workflow";

import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken!,
});

export const qstashClient = new Qstash({
  token: config.env.upstash.qstashToken!,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {};
