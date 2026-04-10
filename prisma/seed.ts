import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.warn("シードデータの投入を開始します...");

  // 営業担当者の作成（管理者2名・一般8名）
  const salesPersons = await Promise.all([
    prisma.salesPerson.upsert({
      where: { email: "tanaka.manager@example.com" },
      update: {},
      create: {
        name: "田中部長",
        email: "tanaka.manager@example.com",
        department: "営業1課",
        isManager: true,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "suzuki.manager@example.com" },
      update: {},
      create: {
        name: "鈴木課長",
        email: "suzuki.manager@example.com",
        department: "営業2課",
        isManager: true,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "yamada@example.com" },
      update: {},
      create: {
        name: "山田太郎",
        email: "yamada@example.com",
        department: "営業1課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "sato@example.com" },
      update: {},
      create: {
        name: "佐藤花子",
        email: "sato@example.com",
        department: "営業1課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "ito@example.com" },
      update: {},
      create: {
        name: "伊藤次郎",
        email: "ito@example.com",
        department: "営業2課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "watanabe@example.com" },
      update: {},
      create: {
        name: "渡辺三郎",
        email: "watanabe@example.com",
        department: "営業2課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "nakamura@example.com" },
      update: {},
      create: {
        name: "中村四郎",
        email: "nakamura@example.com",
        department: "営業1課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "kobayashi@example.com" },
      update: {},
      create: {
        name: "小林五郎",
        email: "kobayashi@example.com",
        department: "営業2課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "kato@example.com" },
      update: {},
      create: {
        name: "加藤六郎",
        email: "kato@example.com",
        department: "営業1課",
        isManager: false,
      },
    }),
    prisma.salesPerson.upsert({
      where: { email: "yoshida@example.com" },
      update: {},
      create: {
        name: "吉田七郎",
        email: "yoshida@example.com",
        department: "営業2課",
        isManager: false,
      },
    }),
  ]);

  console.warn(`営業担当者 ${salesPersons.length} 名を作成しました`);

  // 顧客の作成（100社）
  const customerData = Array.from({ length: 100 }, (_, i) => ({
    companyName: `株式会社サンプル${String(i + 1).padStart(3, "0")}`,
    contactPerson: `担当者${i + 1}`,
    phone: `03-${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    email: `contact${i + 1}@sample${i + 1}.co.jp`,
    address: `東京都千代田区サンプル${i + 1}-1-1`,
  }));

  await prisma.customer.createMany({
    data: customerData,
    skipDuplicates: true,
  });

  const customers = await prisma.customer.findMany({ take: 100 });
  console.warn(`顧客 ${customers.length} 社を作成しました`);

  // 過去3ヶ月分の日報作成（平日のみ、担当者8名分）
  const generalStaff = salesPersons.filter((sp) => !sp.isManager);
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  let reportCount = 0;
  for (const staff of generalStaff) {
    const current = new Date(threeMonthsAgo);
    while (current <= today) {
      const dayOfWeek = current.getDay();
      // 平日のみ（月〜金）
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const reportDate = new Date(current);
        reportDate.setHours(0, 0, 0, 0);

        try {
          const report = await prisma.dailyReport.create({
            data: {
              salesPersonId: staff.salesPersonId,
              reportDate,
              problem: `${current.toLocaleDateString("ja-JP")}の課題: 新規開拓の進捗確認が必要です。顧客からの反応を分析中。`,
              plan: `翌日の計画: 重要顧客へのフォローアップ訪問を実施予定。提案資料の準備も行う。`,
              visitRecords: {
                create: Array.from(
                  { length: Math.floor(1 + Math.random() * 4) },
                  (_, idx) => ({
                    customerId:
                      customers[
                        Math.floor(Math.random() * customers.length)
                      ].customerId,
                    visitContent: `${idx + 1}件目の訪問: 商品提案および関係構築を実施。次回アポイントを設定。`,
                    visitTime: new Date(`1970-01-01T${String(9 + idx * 2).padStart(2, "0")}:00:00.000Z`),
                  })
                ),
              },
            },
          });

          // 約30%の日報にコメントを追加
          if (Math.random() < 0.3) {
            const manager = salesPersons.find((sp) => sp.isManager);
            if (manager) {
              await prisma.managerComment.create({
                data: {
                  reportId: report.reportId,
                  managerId: manager.salesPersonId,
                  comment:
                    "よく頑張っています。引き続き積極的に取り組んでください。",
                },
              });
            }
          }

          reportCount++;
        } catch {
          // ユニーク制約違反（既存レコード）は無視
        }
      }
      current.setDate(current.getDate() + 1);
    }
  }

  console.warn(`日報 ${reportCount} 件を作成しました`);
  console.warn("シードデータの投入が完了しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
