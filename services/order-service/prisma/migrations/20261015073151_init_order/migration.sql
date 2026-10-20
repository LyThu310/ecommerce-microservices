-- CreateTable
CREATE TABLE "Order" (
    "oid" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "oid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("oid","pid")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "eventid" TEXT NOT NULL,
    "aggregatetype" VARCHAR(50) NOT NULL,
    "aggregateid" INTEGER NOT NULL,
    "eventtype" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedat" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("eventid")
);

-- CreateIndex
CREATE INDEX "OutboxEvent_status_createdat_idx" ON "OutboxEvent"("status", "createdat");

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_oid_fkey" FOREIGN KEY ("oid") REFERENCES "Order"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
