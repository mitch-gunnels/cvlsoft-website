ALTER TABLE "products" ALTER COLUMN "fit" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "stripe_session_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "stripe_payment_intent";