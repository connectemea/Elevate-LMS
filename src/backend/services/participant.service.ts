import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const participantService = {
  async getAll() {
    const participants = await prisma.participant.findMany({
      include: {
        enrollments: {
          include: { course: { select: { name: true } } },
        },
        sessionStatus: {
          include: { session: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return participants.map((p: any) => ({
      ...p,
      enrollments: p.enrollments.map((e: any) => ({
        ...e,
        courseName: e.course.name,
      })),
      sessionProgress: p.sessionStatus.map((s: any) => ({
        ...s,
        sessionTitle: s.session.title,
      })),
    }));
  },

  async create(data: { name: string; email: string; year: number }) {
    // Generate default password
    const password = data.email.split("@")[0] + "123";

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password,
        email_confirm: true,
        user_metadata: { role: "participant" },
      });

    if (authError) {
      if (authError.status === 422 && authError.code === "email_exists") {
        throw new Error("EMAIL_EXISTS");
      }
      throw authError;
    }

    return prisma.participant.create({
      data: {
        id: authUser.user.id,
        name: data.name,
        email: data.email,
        year: Number(data.year),
      },
    });
  },

  async getById(id: string) {
    return prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: { include: { course: true } },
        sessionStatus: { include: { session: true } },
      },
    });
  },

  async update(id: string, data: { name?: string; email?: string; year?: number }) {
    return prisma.participant.update({
      where: { id },
      data,
    });
  },

  async deleteById(id: string) {
    return prisma.participant.delete({
      where: { id },
    });
  },
};
