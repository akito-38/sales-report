import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth_token")?.value ??
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_UNAUTHORIZED",
            message: "認証が必要です",
          },
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    const user = await prisma.salesPerson.findUnique({
      where: { salesPersonId: Number(payload.sub) },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_UNAUTHORIZED",
            message: "認証が必要です",
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.salesPersonId,
      name: user.name,
      email: user.email,
      department: user.department,
      is_manager: user.isManager,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "認証が必要です",
        },
      },
      { status: 401 }
    );
  }
}
