import * as PrismaPkg from '@prisma/client'

const PrismaClientCtor = (PrismaPkg as any).PrismaClient ?? (PrismaPkg as any).default ?? PrismaPkg

const globalForPrisma = global as unknown as { prisma: any }

export const prisma = globalForPrisma.prisma || new (PrismaClientCtor as any)()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma