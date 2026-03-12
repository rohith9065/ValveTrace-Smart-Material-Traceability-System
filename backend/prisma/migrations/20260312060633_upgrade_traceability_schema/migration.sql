-- AlterTable
ALTER TABLE "Material" ADD COLUMN "chemicalComp" TEXT;
ALTER TABLE "Material" ADD COLUMN "dateReceived" DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Material" ADD COLUMN "mechanicalProp" TEXT;

-- AlterTable
ALTER TABLE "Valve" ADD COLUMN "batchNumber" TEXT;
ALTER TABLE "Valve" ADD COLUMN "customerName" TEXT;
ALTER TABLE "Valve" ADD COLUMN "destination" TEXT;
ALTER TABLE "Valve" ADD COLUMN "poNumber" TEXT;
ALTER TABLE "Valve" ADD COLUMN "shipmentDate" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valveId" TEXT NOT NULL,
    "hydroTest" TEXT,
    "pressureTest" TEXT,
    "leakTest" TEXT,
    "ndtInspection" TEXT,
    "visualInspection" TEXT,
    "inspector" TEXT,
    "result" TEXT NOT NULL,
    "reportFile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestReport_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestReport" ("createdAt", "id", "leakTest", "pressureTest", "reportFile", "result", "valveId") SELECT "createdAt", "id", "leakTest", "pressureTest", "reportFile", "result", "valveId" FROM "TestReport";
DROP TABLE "TestReport";
ALTER TABLE "new_TestReport" RENAME TO "TestReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
