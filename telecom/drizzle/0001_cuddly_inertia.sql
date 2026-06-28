CREATE TABLE "add_ons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'connectivity' NOT NULL,
	"price_cents" integer NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'Star' NOT NULL,
	"perks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "add_ons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "line_add_ons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"line_id" uuid NOT NULL,
	"add_on_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "storage_options" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "color_options" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "specs" jsonb;--> statement-breakpoint
ALTER TABLE "line_add_ons" ADD CONSTRAINT "line_add_ons_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_add_ons" ADD CONSTRAINT "line_add_ons_add_on_id_add_ons_id_fk" FOREIGN KEY ("add_on_id") REFERENCES "public"."add_ons"("id") ON DELETE cascade ON UPDATE no action;