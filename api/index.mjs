var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import "dotenv/config";

// src/app.ts
import express10 from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String   @id\n  name          String\n  email         String   @unique\n  emailVerified Boolean  @map("email_verified")\n  image         String?\n  createdAt     DateTime @map("created_at")\n  updatedAt     DateTime @map("updated_at")\n\n  role          Roles   @default(STUDENT)\n  first_name    String?\n  last_name     String?\n  phone         String?\n  profile_image String?\n  is_active     Boolean @default(true)\n  is_banned     Boolean @default(false)\n  is_featured   Boolean @default(false)\n  bio           String?\n  location      String?\n\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  tutorBookings   Booking[]     @relation("TutorBookings")\n  reviews         Review[]      @relation("StudentReviews")\n  receivedReviews Review[]      @relation("TutorReviews")\n\n  sessions Session[]\n  accounts Account[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Availability {\n  id             Int       @id @default(autoincrement())\n  tutorProfileId Int       @map("tutor_profile_id")\n  dayOfWeek      DayOfWeek @map("day_of_week")\n  startTime      String    @map("start_time") @db.VarChar(5)\n  endTime        String    @map("end_time") @db.VarChar(5)\n  isActive       Boolean   @default(true) @map("is_active")\n  createdAt      DateTime  @default(now()) @map("created_at")\n  updatedAt      DateTime  @updatedAt @map("updated_at")\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n\n  @@index([tutorProfileId])\n  @@map("availability")\n}\n\nmodel Booking {\n  id                 Int           @id @default(autoincrement())\n  studentId          String        @map("student_id")\n  tutorId            String        @map("tutor_id")\n  subject            String        @default("Bangla")\n  scheduleDate       String\n  scheduleTime       String\n  duration           Int\n  status             BookingStatus @default(CONFIRMED)\n  price              Decimal       @db.Decimal(10, 2)\n  sessionNotes       String?       @map("session_notes") @db.Text\n  cancellationReason String?       @map("cancellation_reason") @db.Text\n  cancelledBy        String?       @map("cancelled_by")\n  completedAt        DateTime?     @map("completed_at")\n  createdAt          DateTime      @default(now()) @map("created_at")\n  updatedAt          DateTime      @updatedAt @map("updated_at")\n\n  student    User      @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n  tutor      User      @relation("TutorBookings", fields: [tutorId], references: [id], onDelete: Cascade)\n  review     Review?\n  category   Category? @relation(fields: [categoryId], references: [id])\n  categoryId Int?\n\n  @@index([studentId])\n  @@index([tutorId])\n  @@index([status])\n  @@map("bookings")\n}\n\nmodel Category {\n  id          Int      @id @default(autoincrement())\n  name        String   @unique @db.VarChar(100)\n  description String?  @db.Text\n  icon        String?  @db.VarChar(255)\n  isActive    Boolean  @default(true) @map("is_active")\n  createdAt   DateTime @default(now()) @map("created_at")\n  updatedAt   DateTime @updatedAt @map("updated_at")\n\n  tutorCategories TutorCategory[]\n  bookings        Booking[]\n\n  @@map("categories")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum DayOfWeek {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nenum Roles {\n  ADMIN\n  TUTOR\n  STUDENT\n}\n\nmodel Review {\n  id        Int      @id @default(autoincrement())\n  bookingId Int      @unique @map("booking_id")\n  studentId String   @map("student_id")\n  tutorId   String   @map("tutor_id")\n  rating    Int\n  comment   String?  @db.Text\n  isPublic  Boolean  @default(true) @map("is_public")\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  student User    @relation("StudentReviews", fields: [studentId], references: [id], onDelete: Cascade)\n  tutor   User    @relation("TutorReviews", fields: [tutorId], references: [id], onDelete: Cascade)\n\n  @@index([tutorId])\n  @@index([rating])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id              Int      @id @default(autoincrement())\n  userId          String   @unique @map("user_id")\n  bio             String?  @db.Text\n  hourlyRate      Decimal  @map("hourly_rate") @db.Decimal(10, 2)\n  yearsExperience Int      @default(0) @map("years_experience")\n  education       String?  @db.Text\n  specialization  String?  @db.VarChar(255)\n  languages       String[] @default([])\n  subjects        String[] @default([])\n  videoIntroUrl   String?  @map("video_intro_url") @db.VarChar(500)\n  averageRating   Decimal  @default(0) @map("average_rating") @db.Decimal(3, 2)\n  totalReviews    Int      @default(0) @map("total_reviews")\n  totalSessions   Int      @default(0) @map("total_sessions")\n  isVerified      Boolean  @default(false) @map("is_verified")\n  isFeatured      Boolean  @default(false) @map("is_featured")\n  createdAt       DateTime @default(now()) @map("created_at")\n  updatedAt       DateTime @updatedAt @map("updated_at")\n\n  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade, map: "tutor_profile_user_fkey")\n  categories   TutorCategory[]\n  availability Availability[]\n\n  @@map("tutor_profiles")\n}\n\nmodel TutorCategory {\n  id             Int      @id @default(autoincrement())\n  tutorProfileId Int      @map("tutor_profile_id")\n  categoryId     Int      @map("category_id")\n  createdAt      DateTime @default(now()) @map("created_at")\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  category     Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([tutorProfileId, categoryId])\n  @@map("tutor_categories")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean","dbName":"email_verified"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"role","kind":"enum","type":"Roles"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profile_image","kind":"scalar","type":"String"},{"name":"is_active","kind":"scalar","type":"Boolean"},{"name":"is_banned","kind":"scalar","type":"Boolean"},{"name":"is_featured","kind":"scalar","type":"Boolean"},{"name":"bio","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"tutorBookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"StudentReviews"},{"name":"receivedReviews","kind":"object","type":"Review","relationName":"TutorReviews"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"tutorProfileId","kind":"scalar","type":"Int","dbName":"tutor_profile_id"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek","dbName":"day_of_week"},{"name":"startTime","kind":"scalar","type":"String","dbName":"start_time"},{"name":"endTime","kind":"scalar","type":"String","dbName":"end_time"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"studentId","kind":"scalar","type":"String","dbName":"student_id"},{"name":"tutorId","kind":"scalar","type":"String","dbName":"tutor_id"},{"name":"subject","kind":"scalar","type":"String"},{"name":"scheduleDate","kind":"scalar","type":"String"},{"name":"scheduleTime","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"sessionNotes","kind":"scalar","type":"String","dbName":"session_notes"},{"name":"cancellationReason","kind":"scalar","type":"String","dbName":"cancellation_reason"},{"name":"cancelledBy","kind":"scalar","type":"String","dbName":"cancelled_by"},{"name":"completedAt","kind":"scalar","type":"DateTime","dbName":"completed_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"User","relationName":"TutorBookings"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"category","kind":"object","type":"Category","relationName":"BookingToCategory"},{"name":"categoryId","kind":"scalar","type":"Int"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToCategory"}],"dbName":"categories"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int","dbName":"booking_id"},{"name":"studentId","kind":"scalar","type":"String","dbName":"student_id"},{"name":"tutorId","kind":"scalar","type":"String","dbName":"tutor_id"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean","dbName":"is_public"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"tutor","kind":"object","type":"User","relationName":"TutorReviews"}],"dbName":"reviews"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Decimal","dbName":"hourly_rate"},{"name":"yearsExperience","kind":"scalar","type":"Int","dbName":"years_experience"},{"name":"education","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"languages","kind":"scalar","type":"String"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"videoIntroUrl","kind":"scalar","type":"String","dbName":"video_intro_url"},{"name":"averageRating","kind":"scalar","type":"Decimal","dbName":"average_rating"},{"name":"totalReviews","kind":"scalar","type":"Int","dbName":"total_reviews"},{"name":"totalSessions","kind":"scalar","type":"Int","dbName":"total_sessions"},{"name":"isVerified","kind":"scalar","type":"Boolean","dbName":"is_verified"},{"name":"isFeatured","kind":"scalar","type":"Boolean","dbName":"is_featured"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"}],"dbName":"tutor_profiles"},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"tutorProfileId","kind":"scalar","type":"Int","dbName":"tutor_profile_id"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":"tutor_categories"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  TutorProfile: "TutorProfile",
  TutorCategory: "TutorCategory"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  first_name: "first_name",
  last_name: "last_name",
  phone: "phone",
  profile_image: "profile_image",
  is_active: "is_active",
  is_banned: "is_banned",
  is_featured: "is_featured",
  bio: "bio",
  location: "location"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  subject: "subject",
  scheduleDate: "scheduleDate",
  scheduleTime: "scheduleTime",
  duration: "duration",
  status: "status",
  price: "price",
  sessionNotes: "sessionNotes",
  cancellationReason: "cancellationReason",
  cancelledBy: "cancelledBy",
  completedAt: "completedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  categoryId: "categoryId"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  icon: "icon",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorId: "tutorId",
  rating: "rating",
  comment: "comment",
  isPublic: "isPublic",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  hourlyRate: "hourlyRate",
  yearsExperience: "yearsExperience",
  education: "education",
  specialization: "specialization",
  languages: "languages",
  subjects: "subjects",
  videoIntroUrl: "videoIntroUrl",
  averageRating: "averageRating",
  totalReviews: "totalReviews",
  totalSessions: "totalSessions",
  isVerified: "isVerified",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorCategoryScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var prisma;
if (process.env.NODE_ENV === "production") {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

// src/lib/auth.ts
import nodemailer from "nodemailer";
import { emailOTP } from "better-auth/plugins";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT"
      },
      firstName: {
        type: "string",
        required: false,
        fieldName: "first_name"
      },
      lastName: {
        type: "string",
        required: false,
        fieldName: "last_name"
      },
      phone: {
        type: "string",
        required: false
      },
      profileImage: {
        type: "string",
        required: false,
        fieldName: "profile_image"
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        fieldName: "is_active"
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        fieldName: "is_banned"
      },
      bio: {
        type: "string",
        required: false,
        fieldName: "bio"
      },
      location: {
        type: "string",
        required: false,
        fieldName: "location"
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        SkillBridge \u{1F393}
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">
                        Verify Your Email Address
                      </h2>
                      <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Hi there! \u{1F44B}
                      </p>
                      <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Thank you for signing up for <strong>SkillBridge \u{1F393}</strong>. To complete your registration and start exploring, please verify your email address by clicking the button below.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 10px 0 0; word-break: break-all;">
                        <a href="${url}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                          ${url}
                        </a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Security Notice -->
                  <tr>
                    <td style="padding: 0 40px 40px; border-top: 1px solid #e2e8f0;">
                      <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #f7fafc; border-radius: 8px; padding: 20px;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                              <strong>\u{1F512} Security tip:</strong> If you didn't create an account with SkillBridge \u{1F393}, you can safely ignore this email. Your email address will not be used.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                        This verification link will expire in 24 hours.
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge \u{1F393}. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Additional Footer -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                  <tr>
                    <td style="text-align: center; padding: 0 20px;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                        You're receiving this email because you signed up for SkillBridge \u{1F393}.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
        const info = await transporter.sendMail({
          from: `"SkillBridge \u{1F393}" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "\u2728 Verify your email address - SkillBridge \u{1F393}",
          text: `Welcome to SkillBridge \u{1F393}!

Please verify your email address by clicking the following link:

${url}

If you didn't create an account, you can safely ignore this email.

This link will expire in 24 hours.

\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge \u{1F393}. All rights reserved.`,
          html: htmlTemplate
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
      }
    },
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        try {
          const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Verification Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                          SkillBridge \u{1F393}
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 50px 40px; text-align: center;">
                        <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">
                          Your Verification Code
                        </h2>
                        <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Use the code below to verify your email address:
                        </p>
                        
                        <!-- OTP Code -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </p>
                        </div>
                        
                        <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          This code will expire in <strong>5 minutes</strong>.
                        </p>
                        <p style="margin: 10px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          You have <strong>3 attempts</strong> to enter the correct code.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                      <td style="padding: 0 40px 40px; border-top: 1px solid #e2e8f0;">
                        <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #fff5f5; border-radius: 8px; padding: 20px; border-left: 4px solid #f56565;">
                          <tr>
                            <td>
                              <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.6;">
                                <strong>\u26A0\uFE0F Security Alert:</strong> If you didn't request this code, please ignore this email. Someone may have entered your email address by mistake.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                          Never share this code with anyone.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge \u{1F393}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Additional Footer -->
                  <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                      <td style="text-align: center; padding: 0 20px;">
                        <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                          You're receiving this email because you requested a verification code for SkillBridge \u{1F393}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;
          const info = await transporter.sendMail({
            from: `"SkillBridge \u{1F393}" <${process.env.APP_USER}>`,
            to: email,
            subject: "\u{1F510} Your Verification Code - SkillBridge \u{1F393}",
            text: `Your SkillBridge \u{1F393} verification code is: ${otp}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge \u{1F393}. All rights reserved.`,
            html: htmlTemplate
          });
          console.log(`\u{1F4E7} OTP sent to ${email}:`, info.messageId);
        } catch (error) {
          console.error("Error sending OTP email:", error);
          throw new Error("Failed to send verification OTP");
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3
    })
  ]
});

// src/app.ts
import cors from "cors";

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  console.error("Error occurred:", {
    message: err.message,
    code: err.code,
    stack: err.stack,
    path: req.path
  });
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    errorDetails = {
      message: err.message,
      type: "PrismaValidationError"
    };
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    statusCode = 400;
    errorMessage = "Database Error";
    errorDetails = {
      code: err.code,
      message: err.message,
      meta: err.meta,
      type: "PrismaKnownRequestError"
    };
  } else if (err.code) {
    statusCode = 400;
    errorMessage = err.message || "Request Failed";
    errorDetails = {
      code: err.code,
      message: err.message,
      details: err.details
    };
  } else {
    errorDetails = {
      message: err.message,
      ...process.env.NODE_ENV === "development" && { stack: err.stack }
    };
  }
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/middlewares/notFound.ts
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    date: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// src/middlewares/betterAuthErrorHandler.ts
var VALID_ROLES = ["ADMIN", "TUTOR", "STUDENT"];
function betterAuthMiddleware(req, res, next) {
  if (req.method === "POST" && req.path.includes("/sign-up")) {
    const body = req.body;
    if (body.role) {
      const upperRole = body.role.toUpperCase();
      if (!VALID_ROLES.includes(upperRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role provided",
          error: {
            code: "INVALID_ROLE",
            message: `Role must be one of: ${VALID_ROLES.map((r) => r.toLowerCase()).join(", ")}`,
            receivedRole: body.role
          }
        });
      }
      req.body.role = upperRole;
    }
  }
  next();
}
function betterAuthErrorHandler(error, req, res, next) {
  console.error("Better Auth Error:", {
    message: error.message,
    code: error.code,
    stack: error.stack,
    path: req.path,
    body: req.body
  });
  if (error.message && error.message.includes("Invalid value for")) {
    const match = error.message.match(/Invalid value for (\w+)/);
    const field = match ? match[1] : "unknown field";
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: {
        code: "VALIDATION_ERROR",
        field,
        message: error.message,
        hint: field === "role" ? `Role must be one of: ${VALID_ROLES.map((r) => r.toLowerCase()).join(", ")}` : void 0
      }
    });
  }
  if (error.code === "FAILED_TO_CREATE_USER") {
    return res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: {
        code: error.code,
        message: error.message || "User creation failed",
        details: process.env.NODE_ENV === "development" ? error.stack : void 0
      }
    });
  }
  next(error);
}

// src/modules/users/user.route.ts
import express from "express";

// src/middlewares/auth.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({ success: false, message: "Email not verified" });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email || "",
      role: session.user.role || "STUDENT" /* STUDENT */,
      emailVerified: session.user.emailVerified || false
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};
var optionalAuthMiddleware = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (session && session.user) {
      req.user = {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "STUDENT" /* STUDENT */,
        emailVerified: session.user.emailVerified || false
      };
    }
  } catch (error) {
  }
  next();
};

// src/modules/users/user.service.ts
var updateUser = async (userId, userData, requestedUser) => {
  if (requestedUser.id !== userId && requestedUser.role !== "ADMIN") {
    throw new Error(
      "You are not authorized to update this user. You can only update your own profile."
    );
  }
  if (requestedUser.role === "TUTOR" /* TUTOR */ || requestedUser.role === "STUDENT" /* STUDENT */ && userData.role) {
    delete userData.role;
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData
  });
  return updatedUser;
};
var getAllUsers = async ({
  page,
  pageSize,
  search,
  filter,
  role
}) => {
  const whereClause = {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } }
    ]
  };
  if (role) {
    whereClause.role = role;
  }
  const userData = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: whereClause,
    include: {
      tutorProfile: true,
      studentBookings: true,
      tutorBookings: true,
      reviews: true,
      receivedReviews: true
    }
  });
  const total = await prisma.user.count({
    where: whereClause
  });
  const users = {
    data: userData,
    total
  };
  return users;
};
var getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user;
};
var changeUserStatus = async (userId, is_active) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { is_active: is_active ? true : false }
  });
  return updatedUser;
};
var bannedUser = async (userId, is_banned) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { is_banned: is_banned ? true : false }
  });
  return updatedUser;
};
var deleteUser = async (userId, requestedUser) => {
  if (requestedUser.id !== userId && requestedUser.role !== "ADMIN") {
    throw new Error(
      "You are not authorized to delete this user. You can only delete your own profile."
    );
  }
  const deletedUser = await prisma.user.delete({
    where: { id: userId }
  });
  return deletedUser;
};
var makeFeatured = async (tutorId, is_featured, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to update featured status.");
  }
  if (requestedUser.role !== "ADMIN" /* ADMIN */) {
    throw new Error("Unauthorized to update featured status.");
  }
  const updatedProfile = await prisma.user.update({
    where: { id: tutorId },
    data: { is_featured }
  });
  return updatedProfile;
};
var UserService = {
  updateUser,
  getAllUsers,
  getUserDetails,
  changeUserStatus,
  bannedUser,
  deleteUser,
  makeFeatured
};

// src/utils/formatResult.ts
var formatResultWithPagination = (res, data = null, message = "Request successful", pagination, apiRoute = "") => {
  const { currentPage, pageSize, totalItems } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const apiURL = process.env.API_URL || "";
  const constructPageLink = (page) => {
    if (page === null) return null;
    const url = new URL(`${apiURL}${apiRoute}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", pageSize.toString());
    return url.toString();
  };
  const nextPageLink = constructPageLink(nextPage);
  const prevPageLink = constructPageLink(prevPage);
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      prevPage: prevPageLink,
      nextPage: nextPageLink
    }
  });
};

// src/modules/users/user.controller.ts
var updateUser2 = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  const requestedUser = req.user;
  try {
    const updatedUser = await UserService.updateUser(
      userId,
      userData,
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getAllUsers2 = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filter = "",
    role = ""
  } = req.query;
  try {
    const users = await UserService.getAllUsers({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      filter: String(filter),
      role: String(role)
    });
    formatResultWithPagination(
      res,
      users.data,
      "Users fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: users.total
      },
      "/users"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getUserDetails2 = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserService.getUserDetails(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var changeUserStatus2 = async (req, res) => {
  const { userId } = req.params;
  const { is_active } = req.body;
  console.log("Status:", is_active);
  try {
    const updatedUser = await UserService.changeUserStatus(
      userId,
      is_active
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var bannedUser2 = async (req, res) => {
  const { userId } = req.params;
  const { is_banned } = req.body;
  console.log("Status:", is_banned);
  try {
    const updatedUser = await UserService.bannedUser(
      userId,
      is_banned
    );
    res.status(200).json({
      success: true,
      message: "User banned status updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user banned status",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var deleteUser2 = async (req, res) => {
  const { userId } = req.params;
  const requestedUser = req.user;
  try {
    const deletedUser = await UserService.deleteUser(
      userId,
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var makeFeatured2 = async (req, res) => {
  const { tutorId } = req.params;
  const { is_featured } = req.body;
  const requestedUser = req.user;
  try {
    const updatedTutor = await UserService.makeFeatured(
      tutorId,
      Boolean(is_featured),
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: `Tutor ${is_featured ? "marked as" : "removed from"} featured successfully`,
      data: updatedTutor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update tutor featured status",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var UserController = {
  updateUser: updateUser2,
  getAllUsers: getAllUsers2,
  getUserDetails: getUserDetails2,
  changeUserStatus: changeUserStatus2,
  bannedUser: bannedUser2,
  deleteUser: deleteUser2,
  makeFeatured: makeFeatured2
};

// src/modules/users/user.route.ts
var router = express.Router();
router.get("/", authMiddleware("ADMIN" /* ADMIN */), UserController.getAllUsers);
router.put(
  "/:userId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  UserController.updateUser
);
router.get(
  "/:userId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  UserController.getUserDetails
);
router.patch(
  "/:userId/status",
  authMiddleware("ADMIN" /* ADMIN */),
  UserController.changeUserStatus
);
router.patch(
  "/:userId/ban",
  authMiddleware("ADMIN" /* ADMIN */),
  UserController.bannedUser
);
router.delete(
  "/:userId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  UserController.deleteUser
);
router.patch(
  "/:tutorId/featured",
  authMiddleware("ADMIN" /* ADMIN */),
  UserController.makeFeatured
);
var UserRoutes = router;

// src/modules/categories/category.route.ts
import express2 from "express";

// src/modules/categories/category.service.ts
var createCategory = async (data) => {
  const category = await prisma.category.create({
    data
  });
  return category;
};
var getAllCategories = async ({
  page,
  pageSize,
  search,
  filter,
  userRole
}) => {
  const whereClause = {};
  if (search && search.trim()) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  if (userRole !== "ADMIN") {
    whereClause.isActive = true;
  }
  const categoriesData = await prisma.category.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: whereClause,
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      _count: {
        select: {
          tutorCategories: true
        }
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false
            }
          }
        },
        select: {
          id: true
        }
      }
    }
  });
  const categoriesWithCount = categoriesData.map((category) => ({
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: void 0
  }));
  const total = await prisma.category.count({
    where: whereClause
  });
  return { data: categoriesWithCount, total };
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          tutorCategories: true
        }
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false
            }
          }
        },
        select: {
          id: true
        }
      }
    }
  });
  if (!category) return null;
  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: void 0
  };
};
var updateCategory = async (id, data) => {
  const category = await prisma.category.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          tutorCategories: true
        }
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false
            }
          }
        },
        select: {
          id: true
        }
      }
    }
  });
  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: void 0
  };
};
var deleteCategory = async (id) => {
  const category = await prisma.category.delete({
    where: { id }
  });
  return category;
};
var changeCategoryStatus = async (id, isActive, requestedUser) => {
  if (requestedUser.role !== "ADMIN" && requestedUser.role !== "TUTOR") {
    throw new Error("Unauthorized to change category status");
  }
  const category = await prisma.category.update({
    where: { id },
    data: { isActive },
    include: {
      _count: {
        select: {
          tutorCategories: true
        }
      },
      tutorCategories: {
        where: {
          tutorProfile: {
            user: {
              is_active: true,
              is_banned: false
            }
          }
        },
        select: {
          id: true
        }
      }
    }
  });
  return {
    ...category,
    tutorsCount: category.tutorCategories.length,
    tutorCategories: void 0
  };
};
var CategoryService = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus
};

// src/modules/categories/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getAllCategories2 = async (req, res) => {
  const { page = 1, limit = 10, search = "", filter = "" } = req.query;
  try {
    const categories = await CategoryService.getAllCategories({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      filter: String(filter),
      userRole: req.user?.role
    });
    formatResultWithPagination(
      res,
      categories.data,
      "Categories fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: categories.total
      },
      "/categories"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      data: null
    });
  }
};
var getCategoryById2 = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.getCategoryById(Number(categoryId));
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category details",
      data: null
    });
  }
};
var updateCategory2 = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.updateCategory(
      Number(categoryId),
      req.body
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var deleteCategory2 = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryService.deleteCategory(Number(categoryId));
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null
    });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var changeCategoryStatus2 = async (req, res) => {
  const { categoryId } = req.params;
  const { isActive } = req.body;
  const requestedUser = req.user;
  try {
    const updatedCategory = await CategoryService.changeCategoryStatus(
      Number(categoryId),
      Boolean(isActive),
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error("Error updating category status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update category status",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var CategoryController = {
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  changeCategoryStatus: changeCategoryStatus2
};

// src/modules/categories/category.route.ts
var router2 = express2.Router();
router2.post(
  "/",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  CategoryController.createCategory
);
router2.get("/", optionalAuthMiddleware, CategoryController.getAllCategories);
router2.get("/:categoryId", CategoryController.getCategoryById);
router2.put(
  "/:categoryId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  CategoryController.updateCategory
);
router2.delete(
  "/:categoryId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  CategoryController.deleteCategory
);
router2.patch(
  "/:categoryId/status",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */),
  CategoryController.changeCategoryStatus
);
var CategoryRoutes = router2;

// src/modules/availability/availability.route.ts
import express3 from "express";

// src/modules/availability/availability.service.ts
var createAvailabilityService = async (data, requestedUser) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can create availability");
  }
  const availabilityData = { ...data };
  console.log("Availability Data to be created:", availabilityData);
  const availiblityData = await prisma.availability.create({
    data: availabilityData
  });
  const getTotalSessions = await prisma.availability.count({
    where: { tutorProfileId: availiblityData.tutorProfileId }
  });
  await prisma.tutorProfile.update({
    where: { id: availiblityData.tutorProfileId },
    data: {
      totalSessions: getTotalSessions
    }
  });
  return availiblityData;
};
var updateAvailabilityService = async (data, requestedUser, availabilityId) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can update availability");
  }
  const availabilityData = { ...data };
  const updatedAvailability = await prisma.availability.update({
    where: { id: availabilityId },
    data: availabilityData
  });
  return updatedAvailability;
};
var getAllAvailabilities = async (tutorProfileId) => {
  const availabilities = await prisma.availability.findMany({
    where: { tutorProfileId }
  });
  return availabilities;
};
var deleteAvailabilityService = async (availabilityId, requestedUser) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can delete availability");
  }
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!availability) {
    throw new Error("Availability not found");
  }
  await prisma.availability.delete({
    where: { id: availabilityId }
  });
  await prisma.tutorProfile.update({
    where: { id: availability.tutorProfileId },
    data: {
      totalSessions: {
        decrement: 1
      }
    }
  });
  return { message: "Availability deleted successfully" };
};
var changeStatusService = async (availabilityId, isActive, requestedUser) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can change availability status");
  }
  const updatedAvailability = await prisma.availability.update({
    where: { id: availabilityId },
    data: { isActive }
  });
  return updatedAvailability;
};
var availabilityService = {
  createAvailabilityService,
  updateAvailabilityService,
  getAllAvailabilities,
  deleteAvailabilityService,
  changeStatusService
};

// src/modules/availability/availability.controller.ts
var createAvailabilityService2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const result = await availabilityService.createAvailabilityService(
      req.body,
      requestedUser
    );
    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: result
    });
  } catch (error) {
    console.error("Error creating availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message
    });
  }
};
var getAllAvailabilities2 = async (req, res) => {
  const tutorProfileId = Number(req.query.tutorProfileId);
  console.log("Tutor Profile ID from query:", tutorProfileId);
  try {
    const result = await availabilityService.getAllAvailabilities(tutorProfileId);
    res.status(200).json({
      success: true,
      message: "Availabilities fetched successfully",
      data: result
    });
  } catch (error) {
    console.error("Error fetching availabilities:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availabilities",
      error: error.message
    });
  }
};
var updateAvailabilityService2 = async (req, res) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  try {
    const result = await availabilityService.updateAvailabilityService(
      req.body,
      requestedUser,
      availabilityId
    );
    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
      error: error.message
    });
  }
};
var deleteAvailabilityService2 = async (req, res) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  try {
    const result = await availabilityService.deleteAvailabilityService(
      availabilityId,
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
      data: result
    });
  } catch (error) {
    console.error("Error deleting availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability",
      error: error.message
    });
  }
};
var changeStatusService2 = async (req, res) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  const { isActive } = req.body;
  try {
    const result = await availabilityService.changeStatusService(
      availabilityId,
      isActive,
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "Availability status changed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error changing availability status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to change availability status",
      error: error.message
    });
  }
};
var AvalablityController = {
  createAvailabilityService: createAvailabilityService2,
  getAllAvailabilities: getAllAvailabilities2,
  updateAvailabilityService: updateAvailabilityService2,
  deleteAvailabilityService: deleteAvailabilityService2,
  changeStatusService: changeStatusService2
};

// src/modules/availability/availability.route.ts
var router3 = express3.Router();
router3.post(
  "/",
  authMiddleware("TUTOR" /* TUTOR */),
  AvalablityController.createAvailabilityService
);
router3.get("/", AvalablityController.getAllAvailabilities);
router3.put(
  "/:id",
  authMiddleware("TUTOR" /* TUTOR */),
  AvalablityController.updateAvailabilityService
);
router3.delete(
  "/:id",
  authMiddleware("TUTOR" /* TUTOR */),
  AvalablityController.deleteAvailabilityService
);
router3.patch(
  "/:id/status",
  authMiddleware("TUTOR" /* TUTOR */),
  AvalablityController.changeStatusService
);
var AvailabilityRoutes = router3;

// src/modules/tutor-profile/tutor-profile.route.ts
import express4 from "express";

// src/modules/tutor-profile/tutor-profile.service.ts
var createTutorProfile = async (data, requestedUser) => {
  console.log("Requested User in Service:", requestedUser);
  if (requestedUser && requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can create tutor profiles");
  }
  const { categoryIds, ...profileData } = data;
  const tutorProfile = await prisma.tutorProfile.create({
    data: {
      ...profileData,
      userId: requestedUser.id
    },
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      },
      availability: true
    }
  });
  if (categoryIds && categoryIds.length > 0) {
    await prisma.tutorCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        tutorProfileId: tutorProfile.id,
        categoryId
      }))
    });
    return await prisma.tutorProfile.findUnique({
      where: { id: tutorProfile.id },
      include: {
        user: true,
        categories: {
          include: {
            category: true
          }
        },
        availability: true
      }
    });
  }
  return tutorProfile;
};
var updateTutorProfile = async (data, requestedUser) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can update tutor profiles");
  }
  console.log("Updated Profile Data:", data);
  const { categoryIds, ...profileData } = data;
  if (categoryIds !== void 0) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: requestedUser.id },
      select: { id: true }
    });
    if (!tutorProfile) {
      throw new Error("Tutor profile not found");
    }
    await prisma.tutorCategory.deleteMany({
      where: { tutorProfileId: tutorProfile.id }
    });
    if (categoryIds.length > 0) {
      await prisma.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorProfileId: tutorProfile.id,
          categoryId
        }))
      });
    }
  }
  const updatedProfile = await prisma.tutorProfile.update({
    where: { userId: requestedUser.id },
    data: profileData,
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      },
      availability: true
    }
  });
  return updatedProfile;
};
var getTutorProfile = async (requestedUser) => {
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can access tutor profiles");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: requestedUser.id },
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      },
      availability: true
    }
  });
  return tutorProfile;
};
var TutorProfileService = {
  createTutorProfile,
  updateTutorProfile,
  getTutorProfile
};

// src/modules/tutor-profile/tutor-profile.controller.ts
var createTutorProfile2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const tutorProfile = await TutorProfileService.createTutorProfile(
      req.body,
      requestedUser
    );
    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: tutorProfile
    });
  } catch (error) {
    console.error("Error creating tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var updateTutorProfile2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const tutorProfile = await TutorProfileService.updateTutorProfile(
      req.body,
      requestedUser
    );
    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      data: tutorProfile
    });
  } catch (error) {
    console.error("Error updating tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getTutorProfile2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const tutorProfile = await TutorProfileService.getTutorProfile(requestedUser);
    res.status(200).json({
      success: true,
      message: "Tutor profile retrieved successfully",
      data: tutorProfile
    });
  } catch (error) {
    console.error("Error retrieving tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var TutorProfileController = {
  createTutorProfile: createTutorProfile2,
  updateTutorProfile: updateTutorProfile2,
  getTutorProfile: getTutorProfile2
};

// src/modules/tutor-profile/tutor-profile.route.ts
var router4 = express4.Router();
router4.post(
  "/",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorProfileController.createTutorProfile
);
router4.put(
  "/",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorProfileController.updateTutorProfile
);
router4.get(
  "/",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorProfileController.getTutorProfile
);
var TutorProfileRoutes = router4;

// src/modules/tutors/tutor.route.ts
import express5 from "express";

// src/modules/tutors/tutor.service.ts
var getAllTutors = async ({
  page,
  pageSize,
  search,
  categoryId,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  is_featured
}) => {
  const whereClause = {
    role: "TUTOR" /* TUTOR */,
    is_active: true,
    is_banned: false
  };
  const tutorProfileConditions = {};
  if (categoryId) {
    tutorProfileConditions.categories = {
      some: {
        categoryId
      }
    };
  }
  if (is_featured !== void 0) {
    whereClause.is_featured = is_featured === "true" || is_featured === true;
  }
  if (minPrice !== void 0 && maxPrice !== void 0) {
    tutorProfileConditions.hourlyRate = {
      gte: minPrice,
      lte: maxPrice
    };
  }
  if (Object.keys(tutorProfileConditions).length > 0) {
    whereClause.tutorProfile = tutorProfileConditions;
  }
  let orderByClause = { createdAt: "desc" };
  if (sortBy && sortOrder) {
    const tutorProfileFields = [
      "hourlyRate",
      "totalReviews",
      "averageRating",
      "yearsExperience"
    ];
    if (tutorProfileFields.includes(sortBy)) {
      orderByClause = {
        tutorProfile: {
          [sortBy]: sortOrder
        }
      };
    } else {
      orderByClause = {
        [sortBy]: sortOrder
      };
    }
  }
  const tutors = await prisma.user.findMany({
    where: whereClause,
    include: {
      tutorProfile: {
        include: {
          categories: {
            include: {
              category: true
            }
          },
          availability: true
        }
      }
    },
    orderBy: orderByClause
  });
  let filteredTutors = tutors;
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filteredTutors = tutors.filter((tutor) => {
      const matchesBasicFields = tutor.name?.toLowerCase().includes(searchLower) || tutor.email?.toLowerCase().includes(searchLower) || tutor.bio?.toLowerCase().includes(searchLower) || tutor.location?.toLowerCase().includes(searchLower);
      const matchesSubjects = tutor.tutorProfile?.subjects?.some(
        (subject) => subject.toLowerCase().includes(searchLower)
      ) || false;
      return matchesBasicFields || matchesSubjects;
    });
  }
  const total = filteredTutors.length;
  const paginatedTutors = filteredTutors.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  return {
    data: paginatedTutors,
    total
  };
};
var getTutorById = async (userId) => {
  const tutor = await prisma.user.findUnique({
    where: {
      id: userId,
      role: "TUTOR" /* TUTOR */,
      is_active: true,
      is_banned: false
    },
    include: {
      tutorProfile: {
        include: {
          categories: {
            include: {
              category: true
            }
          },
          availability: {
            where: { isActive: true }
          }
        }
      },
      receivedReviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        where: {
          isPublic: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return tutor;
};
var getTutorReviews = async (requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view reviews.");
  }
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can view their reviews.");
  }
  const reviews = await prisma.review.findMany({
    where: { tutorId: requestedUser.id },
    include: {
      student: {
        select: {
          id: true,
          name: true
        }
      },
      booking: {
        select: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return reviews;
};
var TutorService = {
  getAllTutors,
  getTutorById,
  getTutorReviews
};

// src/modules/tutors/tutor.controller.ts
var getAllTutors2 = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    categoryId,
    minPrice = 0,
    maxPrice = 200,
    sortBy,
    sortOrder,
    is_featured
  } = req.query;
  try {
    const tutors = await TutorService.getAllTutors({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      categoryId: categoryId ? Number(categoryId) : void 0,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      sortBy: sortBy ? String(sortBy) : void 0,
      sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : void 0,
      is_featured: is_featured == "true" ? true : is_featured == "false" ? false : void 0
    });
    formatResultWithPagination(
      res,
      tutors.data,
      "Tutors fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: tutors.total
      },
      "/tutors"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getTutorDetails = async (req, res) => {
  const { tutorId } = req.params;
  try {
    const tutor = await TutorService.getTutorById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: "Tutor details fetched successfully",
      data: tutor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor details",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getTutorReviews2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const response = await TutorService.getTutorReviews(requestedUser);
    res.status(200).json({
      success: true,
      message: "Tutor reviews fetched successfully",
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor reviews",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var TutorController = {
  getAllTutors: getAllTutors2,
  getTutorDetails,
  getTutorReviews: getTutorReviews2
};

// src/modules/tutors/tutor.route.ts
var router5 = express5.Router();
router5.get("/", TutorController.getAllTutors);
router5.get("/:tutorId", TutorController.getTutorDetails);
router5.get(
  "/reviews/me",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorController.getTutorReviews
);
var TutorRoutes = router5;

// src/modules/booking/booking.route.ts
import express6 from "express";

// src/modules/booking/booking.service.ts
var CreateBooking = async (data, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to create a booking.");
  }
  if (requestedUser.role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only students can create bookings.");
  }
  const bookingData = { ...data, studentId: requestedUser.id };
  const booking = await prisma.booking.create({
    data: {
      ...bookingData
    }
  });
  return booking;
};
var getMyBookings = async (userId, requestedUser, page, limit, search) => {
  if (!requestedUser) {
    throw new Error("Please login to view your bookings.");
  }
  if (requestedUser.id !== userId) {
    throw new Error("You are not authorized to view these bookings.");
  }
  if (requestedUser.role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only students can view their bookings.");
  }
  const whereClause = {
    studentId: userId,
    ...search && {
      OR: [
        {
          tutor: {
            name: {
              contains: search,
              mode: prismaNamespace_exports.QueryMode.insensitive
            }
          }
        },
        {
          tutor: {
            tutorProfile: {
              bio: {
                contains: search,
                mode: prismaNamespace_exports.QueryMode.insensitive
              }
            }
          }
        }
      ]
    }
  };
  const bookings = await prisma.booking.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true
        }
      },
      student: true,
      category: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalBookings = await prisma.booking.count({
    where: whereClause
  });
  return { data: bookings, total: totalBookings };
};
var getAllBookingsForTutor = async (tutorId, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view bookings.");
  }
  if (requestedUser.id !== tutorId) {
    throw new Error("You are not authorized to view these bookings.");
  }
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can view their bookings.");
  }
  const whereClause = {
    tutorId
  };
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true
        }
      },
      student: true,
      category: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalBookings = await prisma.booking.count({
    where: whereClause
  });
  return { data: bookings, total: totalBookings };
};
var getAllBookings = async (requestedUser, page, limit, search) => {
  if (!requestedUser) {
    throw new Error("Please login to view all bookings.");
  }
  if (requestedUser.role !== "ADMIN" /* ADMIN */) {
    throw new Error("Only admins can view all bookings.");
  }
  const whereClause = search ? {
    OR: [
      {
        tutor: {
          tutorProfile: {
            bio: {
              contains: search,
              mode: prismaNamespace_exports.QueryMode.insensitive
            }
          }
        }
      },
      {
        student: {
          name: {
            contains: search,
            mode: prismaNamespace_exports.QueryMode.insensitive
          }
        }
      }
    ]
  } : {};
  const bookings = await prisma.booking.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: whereClause,
    include: {
      tutor: {
        include: {
          tutorProfile: true
        }
      },
      student: true,
      category: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalBookings = await prisma.booking.count({
    where: whereClause
  });
  return { data: bookings, total: totalBookings };
};
var GetBookingById = async (bookingId, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view the booking.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      tutor: {
        include: {
          tutorProfile: true
        }
      },
      student: true
    }
  });
  return booking;
};
var DeleteBooking = async (bookingId, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to delete the booking.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new Error("Booking not found.");
  }
  if (requestedUser.role === "STUDENT" /* STUDENT */ && booking.studentId !== requestedUser.id) {
    throw new Error("You are not authorized to delete this booking.");
  }
  if (requestedUser.role === "TUTOR" /* TUTOR */ && booking.tutorId !== requestedUser.id) {
    throw new Error("You are not authorized to delete this booking.");
  }
  await prisma.booking.delete({
    where: {
      id: bookingId
    }
  });
};
var ChangeBookingStatus = async (bookingId, status, requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to change the booking status.");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new Error("Booking not found.");
  }
  if (requestedUser.role === "TUTOR" /* TUTOR */ && booking.tutorId !== requestedUser.id) {
    throw new Error(
      "You are not authorized to change the status of this booking."
    );
  }
  if (requestedUser.role === "STUDENT" /* STUDENT */ && booking.studentId !== requestedUser.id) {
    throw new Error(
      "You are not authorized to change the status of this booking."
    );
  }
  if (requestedUser.role === "STUDENT" /* STUDENT */ && status === BookingStatus.COMPLETED) {
    throw new Error(
      "Students are not allowed to complete bookings. Please contact the tutor to complete the booking."
    );
  }
  if (requestedUser.role === "TUTOR" /* TUTOR */ && status === BookingStatus.CANCELLED) {
    throw new Error(
      "Tutors are not allowed to cancel bookings. Please contact the student to cancel the booking."
    );
  }
  await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status
    }
  });
};
var BookingService = {
  CreateBooking,
  getMyBookings,
  getAllBookingsForTutor,
  getAllBookings,
  GetBookingById,
  DeleteBooking,
  ChangeBookingStatus
};

// src/modules/booking/booking.controller.ts
var CreateBooking2 = async (req, res) => {
  const requestedUser = req.user;
  const data = req.body;
  try {
    const response = await BookingService.CreateBooking(data, requestedUser);
    res.status(201).json({
      message: "Booking created successfully",
      success: true,
      data: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create booking",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var GetBookingsForTutor = async (req, res) => {
  const tutorId = req.params.tutorId;
  const requestedUser = req.user;
  try {
    const bookings = await BookingService.getAllBookingsForTutor(
      tutorId,
      requestedUser
    );
    res.status(200).json({
      message: "Bookings for tutor fetched successfully",
      success: true,
      data: bookings.data,
      total: bookings.total
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var GetAllBookings = async (req, res) => {
  const requestedUser = req.user;
  const { page = 1, limit = 10, search } = req.query;
  try {
    const bookings = await BookingService.getAllBookings(
      requestedUser,
      Number(page),
      Number(limit),
      search
    );
    formatResultWithPagination(
      res,
      bookings.data,
      "Bookings fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: bookings.total
      },
      "/bookings"
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve all bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getMyBookings2 = async (req, res) => {
  const requestedUser = req.user;
  const userId = req.params.userId;
  const { page = 1, limit = 10, search } = req.query;
  try {
    const bookings = await BookingService.getMyBookings(
      userId,
      requestedUser,
      Number(page),
      Number(limit),
      search
    );
    formatResultWithPagination(
      res,
      bookings.data,
      "Your bookings fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: bookings.total
      },
      "/bookings/me/" + userId
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve your bookings",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var GetBookingById2 = async (req, res) => {
  const bookingId = req.params.bookingId;
  const requestedUser = req.user;
  try {
    const booking = await BookingService.GetBookingById(
      Number(bookingId),
      requestedUser
    );
    res.status(200).json({
      message: "Booking retrieved successfully",
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve the booking",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var DeleteBooking2 = async (req, res) => {
  const bookingId = req.params.bookingId;
  const requestedUser = req.user;
  try {
    await BookingService.DeleteBooking(Number(bookingId), requestedUser);
    res.status(200).json({
      message: "Booking deleted successfully",
      success: true
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete the booking",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var ChangeBookingStatus2 = async (req, res) => {
  const bookingId = req.params.bookingId;
  const { status } = req.body;
  const requestedUser = req.user;
  try {
    const updatedBooking = await BookingService.ChangeBookingStatus(
      Number(bookingId),
      status,
      requestedUser
    );
    res.status(200).json({
      message: "Booking status updated successfully",
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var BookingController = {
  CreateBooking: CreateBooking2,
  GetBookingsForTutor,
  GetAllBookings,
  getMyBookings: getMyBookings2,
  GetBookingById: GetBookingById2,
  DeleteBooking: DeleteBooking2,
  ChangeBookingStatus: ChangeBookingStatus2
};

// src/modules/booking/booking.route.ts
var router6 = express6.Router();
router6.post(
  "/",
  authMiddleware("STUDENT" /* STUDENT */),
  BookingController.CreateBooking
);
router6.get(
  "/:bookingId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  BookingController.GetBookingById
);
router6.get(
  "/tutor/:tutorId",
  authMiddleware("TUTOR" /* TUTOR */),
  BookingController.GetBookingsForTutor
);
router6.get(
  "/",
  authMiddleware("ADMIN" /* ADMIN */),
  BookingController.GetAllBookings
);
router6.get(
  "/me/:userId",
  authMiddleware("STUDENT" /* STUDENT */),
  BookingController.getMyBookings
);
router6.delete(
  "/:bookingId",
  authMiddleware("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  BookingController.DeleteBooking
);
router6.patch(
  "/:bookingId/status",
  authMiddleware("TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */),
  BookingController.ChangeBookingStatus
);
var BookingRoutes = router6;

// src/modules/reviews/reviews.route.ts
import express7 from "express";

// src/modules/reviews/reviews.services.ts
var CreateReview = async (data, requestedUser) => {
  console.log("Review Data:", data);
  console.log("Requested User in CreateReview:", requestedUser);
  if (!requestedUser) {
    throw new Error("Please login to create a review.");
  }
  if (requestedUser.role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only students can create reviews.");
  }
  const reviewData = { ...data, studentId: requestedUser.id };
  const review = await prisma.review.create({
    data: {
      ...reviewData
    }
  });
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: data.tutorId }
  });
  if (tutorProfile) {
    const reviewStats = await prisma.review.aggregate({
      where: { tutorId: data.tutorId },
      _avg: { rating: true },
      _count: { id: true }
    });
    const totalReviews = reviewStats._count.id;
    const averageRating = reviewStats._avg.rating || 0;
    await prisma.tutorProfile.update({
      where: { userId: data.tutorId },
      data: {
        totalReviews,
        averageRating: Number(averageRating.toFixed(2))
      }
    });
  }
  return review;
};
var ReviewService = {
  CreateReview
};

// src/modules/reviews/reviews.controller.ts
var CreateReview2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const review = await ReviewService.CreateReview(req.body, requestedUser);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create review",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var ReviewController = {
  CreateReview: CreateReview2
};

// src/modules/reviews/reviews.route.ts
var router7 = express7.Router();
router7.post(
  "/",
  authMiddleware("STUDENT" /* STUDENT */),
  ReviewController.CreateReview
);
var ReviewRoutes = router7;

// src/modules/dashboard/dashboard.route.ts
import express8 from "express";

// src/modules/dashboard/dashboard.service.ts
var GetStudentDashboardStats = async (requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view the dashboard.");
  }
  if (requestedUser.role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only students can access the dashboard.");
  }
  const [
    totalBookings,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    totalHoursResult,
    reviewsGiven,
    totalSpent,
    recentBookings
  ] = await Promise.all([
    prisma.booking.count({
      where: { studentId: requestedUser.id }
    }),
    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.CONFIRMED
      }
    }),
    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.COMPLETED
      }
    }),
    prisma.booking.count({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.CANCELLED
      }
    }),
    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: BookingStatus.COMPLETED
      },
      _sum: { duration: true }
    }),
    prisma.review.count({
      where: { studentId: requestedUser.id }
    }),
    prisma.booking.aggregate({
      where: {
        studentId: requestedUser.id,
        status: { in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] }
      },
      _sum: { price: true }
    }),
    prisma.booking.findMany({
      where: { studentId: requestedUser.id, status: BookingStatus.CONFIRMED },
      take: 2,
      orderBy: { createdAt: "desc" },
      include: {
        tutor: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);
  const stats = {
    totalBookings,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    totalHours: Number(totalHoursResult._sum.duration || 0) / 60,
    reviewsGiven,
    totalSpent: Number(totalSpent._sum.price || 0),
    completionRate: totalBookings > 0 ? Math.round(completedSessions / totalBookings * 100) : 0,
    recentBookings,
    name: requestedUser.name
  };
  return stats;
};
var GetTutorDashboardStats = async (requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view the dashboard.");
  }
  if (requestedUser.role !== "TUTOR" /* TUTOR */) {
    throw new Error("Only tutors can access the dashboard.");
  }
  const [
    totalSessions,
    upcomingSessions,
    totalEarnings,
    thisWeekEarnings,
    thisMonthEarnings,
    totalRating,
    totalStudents,
    hourlyRate,
    subjectCount,
    totalReviews
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        tutorId: requestedUser.id
      }
    }),
    prisma.booking.count({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.CONFIRMED
      }
    }),
    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED
      },
      _sum: { price: true }
    }),
    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 7))
        }
      },
      _sum: { price: true }
    }),
    prisma.booking.aggregate({
      where: {
        tutorId: requestedUser.id,
        status: BookingStatus.COMPLETED,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1)
        }
      },
      _sum: { price: true }
    }),
    prisma.review.aggregate({
      where: {
        tutorId: requestedUser.id
      },
      _avg: { rating: true }
    }),
    prisma.booking.groupBy({
      by: ["studentId"],
      where: { tutorId: requestedUser.id }
    }).then((groups) => groups.length),
    prisma.tutorProfile.findUnique({
      where: { userId: requestedUser.id },
      select: { hourlyRate: true }
    }),
    prisma.booking.groupBy({
      by: ["subject"],
      where: { tutorId: requestedUser.id }
    }).then((groups) => groups.length),
    prisma.review.count({
      where: { tutorId: requestedUser.id }
    })
  ]);
  return {
    totalSessions,
    upcomingSessions,
    totalEarnings: Number(totalEarnings._sum.price || 0).toFixed(2),
    thisWeekEarnings: Number(thisWeekEarnings._sum.price || 0).toFixed(2),
    thisMonthEarnings: Number(thisMonthEarnings._sum.price || 0).toFixed(2),
    totalRating: Number(totalRating._avg.rating || 0).toFixed(2),
    totalStudents,
    hourlyRate: hourlyRate?.hourlyRate || 0,
    subjectCount,
    totalReviews
  };
};
var GetAdminDashboardStats = async (requestedUser) => {
  if (!requestedUser) {
    throw new Error("Please login to view the dashboard.");
  }
  if (requestedUser.role !== "ADMIN" /* ADMIN */) {
    throw new Error("Only admins can access the dashboard.");
  }
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    totalEarnings,
    totalCategories,
    recentBookings,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TUTOR" /* TUTOR */ } }),
    prisma.user.count({ where: { role: "STUDENT" /* STUDENT */ } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: BookingStatus.COMPLETED },
      _sum: { price: true }
    }),
    prisma.category.count(),
    prisma.booking.findMany({
      where: { status: BookingStatus.CONFIRMED },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        tutor: true,
        student: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);
  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    totalEarnings: Number(totalEarnings._sum.price || 0).toFixed(2),
    totalCategories,
    recentBookings,
    recentUsers
  };
};
var DashboardService = {
  GetStudentDashboardStats,
  GetTutorDashboardStats,
  GetAdminDashboardStats
};

// src/modules/dashboard/dashboard.controller.ts
var GetStudentDashboardStats2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const response = await DashboardService.GetStudentDashboardStats(requestedUser);
    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var getTutorDashboardStats = async (req, res) => {
  const requestedUser = req.user;
  try {
    const response = await DashboardService.GetTutorDashboardStats(requestedUser);
    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var GetAdminDashboardStats2 = async (req, res) => {
  const requestedUser = req.user;
  try {
    const response = await DashboardService.GetAdminDashboardStats(requestedUser);
    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var DashboardController = {
  GetStudentDashboardStats: GetStudentDashboardStats2,
  getTutorDashboardStats,
  GetAdminDashboardStats: GetAdminDashboardStats2
};

// src/modules/dashboard/dashboard.route.ts
var router8 = express8.Router();
router8.get(
  "/stats",
  authMiddleware("STUDENT" /* STUDENT */),
  DashboardController.GetStudentDashboardStats
);
router8.get(
  "/tutor-stats",
  authMiddleware("TUTOR" /* TUTOR */),
  DashboardController.getTutorDashboardStats
);
router8.get(
  "/admin-stats",
  authMiddleware("ADMIN" /* ADMIN */),
  DashboardController.GetAdminDashboardStats
);
var DashboardRoutes = router8;

// src/modules/subjects/subject.route.ts
import express9 from "express";

// src/modules/subjects/subject.service.ts
var GetAllPopularSubjects = async () => {
  const tutorProfiles = await prisma.tutorProfile.findMany({
    where: {
      user: {
        role: "TUTOR",
        is_active: true,
        is_banned: false
      }
    },
    select: {
      subjects: true
    }
  });
  const subjectMap = {};
  tutorProfiles.forEach((profile) => {
    profile.subjects.forEach((subject) => {
      const normalizedSubject = subject.trim();
      if (normalizedSubject) {
        subjectMap[normalizedSubject] = (subjectMap[normalizedSubject] || 0) + 1;
      }
    });
  });
  const popularSubjects = Object.entries(subjectMap).map(([name, tutorCount]) => ({
    name,
    tutorCount
  })).sort((a, b) => b.tutorCount - a.tutorCount);
  return popularSubjects;
};
var SubjectService = {
  GetAllPopularSubjects
};

// src/modules/subjects/subject.controller.ts
var getAllPopularSubjects = async (req, res) => {
  try {
    const subjects = await SubjectService.GetAllPopularSubjects();
    res.status(200).json({
      success: true,
      message: "Popular subjects fetched successfully",
      data: subjects
    });
  } catch (error) {
    console.error("Error fetching popular subjects:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular subjects",
      error: error.message?.split("\n").pop().trim() || error.message || error
    });
  }
};
var SubjectController = {
  getAllPopularSubjects
};

// src/modules/subjects/subject.route.ts
var router9 = express9.Router();
router9.get("/popular", SubjectController.getAllPopularSubjects);
var SubjectRoutes = router9;

// src/app.ts
dotenv.config();
var app = express10();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express10.json());
app.use("/api/auth", betterAuthMiddleware, async (req, res, next) => {
  try {
    await toNodeHandler(auth)(req, res);
  } catch (error) {
    betterAuthErrorHandler(error, req, res, next);
  }
});
app.use("/api/users", UserRoutes);
app.use("/api/tutors", TutorRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/availabilities", AvailabilityRoutes);
app.use("/api/tutor-profiles", TutorProfileRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/subjects", SubjectRoutes);
app.use("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});
app.get("/", (req, res) => {
  res.send("Welcome to the Blog Management API");
});
app.use(globalErrorHandler_default);
app.use(notFoundHandler);
var PORT = process.env.PORT || 5e3;
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
