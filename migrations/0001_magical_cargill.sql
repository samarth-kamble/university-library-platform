CREATE TYPE "public"."fine_status" AS ENUM('PENDING', 'PAID', 'WAIVED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "fine_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"borrow_record_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"fine_amount" integer NOT NULL,
	"days_overdue" integer NOT NULL,
	"daily_fine_rate" integer DEFAULT 100 NOT NULL,
	"status" "fine_status" DEFAULT 'PENDING' NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now(),
	"paid_at" timestamp with time zone,
	"waivers_reason" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "fine_records_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "library_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"daily_fine_rate" integer DEFAULT 100 NOT NULL,
	"max_fine_amount" integer DEFAULT 5000 NOT NULL,
	"grace_period_days" integer DEFAULT 0 NOT NULL,
	"auto_calculate_enabled" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "library_settings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "payment_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"fine_record_id" uuid NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"stripe_customer_id" text,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"stripe_status" text,
	"receipt_url" text,
	"failure_reason" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "payment_records_id_unique" UNIQUE("id"),
	CONSTRAINT "payment_records_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
ALTER TABLE "fine_records" ADD CONSTRAINT "fine_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fine_records" ADD CONSTRAINT "fine_records_borrow_record_id_borrow_records_id_fk" FOREIGN KEY ("borrow_record_id") REFERENCES "public"."borrow_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fine_records" ADD CONSTRAINT "fine_records_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_fine_record_id_fine_records_id_fk" FOREIGN KEY ("fine_record_id") REFERENCES "public"."fine_records"("id") ON DELETE no action ON UPDATE no action;