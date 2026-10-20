-- CreateTable
CREATE TABLE "Membership" (
    "mid" SERIAL NOT NULL,
    "mname" VARCHAR(50) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("mid")
);

-- CreateTable
CREATE TABLE "Customer" (
    "uid" INTEGER NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "mid" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE INDEX "Customer_mid_idx" ON "Customer"("mid");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_mid_fkey" FOREIGN KEY ("mid") REFERENCES "Membership"("mid") ON DELETE RESTRICT ON UPDATE CASCADE;
