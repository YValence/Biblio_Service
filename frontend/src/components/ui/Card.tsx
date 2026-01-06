interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-white border border-neutral-200 rounded-xl p-6 ${className}`}>
            {children}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-neutral-500 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-semibold text-black mt-2">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-500"}`}>
                            <span>{trend.isPositive ? "↑" : "↓"}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-lg bg-neutral-100">
                    {icon}
                </div>
            </div>
        </Card>
    );
}
