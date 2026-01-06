"use client";

import { useEffect, useState } from "react";
import { StatCard, Card } from "@/components/ui/Card";
import { usersApi, livresApi, empruntsApi, Emprunt } from "@/lib/api";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        books: 0,
        loans: 0,
        lateLoans: 0,
    });
    const [recentLoans, setRecentLoans] = useState<Emprunt[]>([]);
    const [lateLoans, setLateLoans] = useState<Emprunt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [users, books, loans, late] = await Promise.all([
                    usersApi.getAll(),
                    livresApi.getAll(),
                    empruntsApi.getAll(),
                    empruntsApi.getEnRetard(),
                ]);

                setStats({
                    users: users.length,
                    books: books.length,
                    loans: loans.length,
                    lateLoans: late.length,
                });

                setRecentLoans(loans.slice(-5).reverse());
                setLateLoans(late.slice(0, 5));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
                <p className="text-neutral-500 mt-1">Vue d&apos;ensemble de votre bibliothèque</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs"
                    value={stats.users}
                    icon={
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Livres"
                    value={stats.books}
                    icon={
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    }
                />
                <StatCard
                    title="Emprunts"
                    value={stats.loans}
                    icon={
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    }
                />
                <StatCard
                    title="En Retard"
                    value={stats.lateLoans}
                    icon={
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Loans */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-black">Emprunts Récents</h2>
                        <span className="text-xs text-neutral-400">Derniers 5</span>
                    </div>
                    <div className="space-y-3">
                        {recentLoans.length === 0 ? (
                            <p className="text-neutral-400 text-center py-4 text-sm">Aucun emprunt</p>
                        ) : (
                            recentLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">Emprunt #{loan.id}</p>
                                            <p className="text-xs text-neutral-400">
                                                User #{loan.utilisateurId} • Livre #{loan.livreId}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${loan.statut === "EN_COURS" ? "bg-amber-100 text-amber-700" :
                                            loan.statut === "RETOURNE" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {loan.statut.replace("_", " ")}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Late Loans */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-black flex items-center gap-2">
                            {lateLoans.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                            Emprunts en Retard
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {lateLoans.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-neutral-600 text-sm">Aucun retard</p>
                            </div>
                        ) : (
                            lateLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">Emprunt #{loan.id}</p>
                                            <p className="text-xs text-neutral-500">
                                                Retour prévu: {new Date(loan.dateRetourPrevue).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
