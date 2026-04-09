import { cn } from "@/lib/utils";

describe("cn (class name utility)", () => {
  it("単一のクラス名を返す", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("複数のクラス名をマージする", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("Tailwindの競合するクラスを正しくマージする", () => {
    // tailwind-merge: 後から指定したクラスが優先される
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("falsy な値を無視する", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("条件付きクラスを適用する", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });
});
