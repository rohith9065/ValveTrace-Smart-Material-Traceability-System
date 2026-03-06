-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materialId" TEXT NOT NULL,
    "heatNumber" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "certificateFile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "componentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "machine" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Component_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Valve" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valveId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "assemblyStatus" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ValveComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valveId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    CONSTRAINT "ValveComponent_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ValveComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "processStage" TEXT NOT NULL,
    "machine" TEXT,
    "operator" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    CONSTRAINT "ProcessLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Valve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valveId" TEXT NOT NULL,
    "pressureTest" TEXT NOT NULL,
    "leakTest" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "reportFile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestReport_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Material_materialId_key" ON "Material"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Component_componentId_key" ON "Component"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "Valve_valveId_key" ON "Valve"("valveId");

-- CreateIndex
CREATE UNIQUE INDEX "Valve_serialNumber_key" ON "Valve"("serialNumber");
