import Image from "next/image";

import { cn } from "@/lib/utils";
import { getStatistics } from "@/lib/admin/general";

interface StatCardProps {
  label: string;
  count: number;
  changeAmount: number;
  isStatIncrease: boolean;
}
const StatCard = ({
  label,
  count,
  changeAmount,
  isStatIncrease,
}: StatCardProps) => {
  return (
    <div className="stat">
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <div className="flex items-center gap-1">
          <Image
            src={
              isStatIncrease
                ? "/icons/admin/caret-up.svg"
                : "/icons/admin/caret-down.svg"
            }
            alt="Change Icon"
            width={16}
            height={16}
            className="object-contain"
          />
          <p
            className={cn(!isStatIncrease ? "text-red-500" : "text-green-500")}
          >
            {changeAmount}
          </p>
        </div>
      </div>
      <p className="stat-count">{count < 10 ? `0${count}` : count}</p>
    </div>
  );
};

const Statistics = async () => {
  const { data: stats } = await getStatistics();
  if (!stats) {
    throw new Error("Failed to fetch statistics");
  }
  return (
    <section className="flex flex-wrap min-w-fit gap-5">
      <StatCard
        label="Borrowed Books"
        count={stats?.borrowRecord.total!}
        changeAmount={stats?.borrowRecord.change!}
        isStatIncrease={stats?.borrowRecord.change! > 0}
      />
      <StatCard
        label="Total Users"
        count={stats?.user.total!}
        changeAmount={stats?.user.change!}
        isStatIncrease={stats?.user.change! > 0}
      />
      <StatCard
        label="Total Books"
        count={stats?.book.total!}
        changeAmount={stats?.book.change!}
        isStatIncrease={stats?.book.change! > 0}
      />
    </section>
  );
};

export default Statistics;
