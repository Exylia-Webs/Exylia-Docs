-- The public assistant's spend, per month (the cap) and per day (the admin panel).
CREATE TABLE "AssistantUsage" (
    "month" TEXT NOT NULL,
    "tokens" BIGINT NOT NULL DEFAULT 0,
    "calls" INTEGER NOT NULL DEFAULT 0,
    "quotaHits" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantUsage_pkey" PRIMARY KEY ("month")
);

CREATE TABLE "AssistantUsageDay" (
    "day" DATE NOT NULL,
    "tokens" BIGINT NOT NULL DEFAULT 0,
    "calls" INTEGER NOT NULL DEFAULT 0,
    "quotaHits" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantUsageDay_pkey" PRIMARY KEY ("day")
);
