import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@local.dev";
  const adminPassword = "Admin123!";
  const hash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, role: Role.ADMIN, name: "Admin" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: hash,
      role: Role.ADMIN
    }
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${admin.email} / ${adminPassword}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
