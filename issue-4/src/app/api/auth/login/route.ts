import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, getTokenExpiry } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "入力値が不正です",
            details: result.error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.salesPerson.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_INVALID_CREDENTIALS",
            message: "メールアドレスまたはパスワードが正しくありません",
          },
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: {
            code: "AUTH_INVALID_CREDENTIALS",
            message: "メールアドレスまたはパスワードが正しくありません",
          },
        },
        { status: 401 }
      );
    }

    const token = await signToken({
      sub: String(user.salesPersonId),
      email: user.email,
      isManager: user.isManager,
    });

    const expiresAt = getTokenExpiry();

    const response = NextResponse.json({
      token,
      expires_at: expiresAt.toISOString(),
      user: {
        id: user.salesPersonId,
        name: user.name,
        email: user.email,
        department: user.department,
        is_manager: user.isManager,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "サーバーエラーが発生しました",
        },
      },
      { status: 500 }
    );
  }
}
