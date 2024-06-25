import { PrismaClient } from "@prisma/client";

const prismadb = global.prismadb || new PrismaClient();
global.prismadb = prismadb;

export default prismadb;
