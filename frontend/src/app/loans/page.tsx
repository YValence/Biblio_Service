"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { empruntsApi, Emprunt } from "@/lib/api";

type FilterType = "all" | "EN_COURS" | "RETOURNE" | "EN_RETARD";

export default function LoansPage() {
    const [loans, setLoans] = useState<Emprunt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [returning, setReturning] = useState<number | null>(null);

    // Edit state
    const [editingLoan, setEditingLoan] = useState<Emprunt | null>(null);
    const [editDateEmprunt, setEditDateEmprunt] = useState("");
    const [editDateRetour, setEditDateRetour] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchLoans();
    }, []);

    async function fetchLoans() {
        try {
            const data = await empruntsApi.getAll();
            setLoans(data);
        } catch (error) {
            console.error("Error fetching loans:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleReturn(id: number) {
        setReturning(id);
        try {
            await empruntsApi.retourner(id);
            fetchLoans();
        } catch (error) {
            console.error("Error returning book:", error);
        } finally {
            setReturning(null);
        }
    }

    function openEditModal(loan: Emprunt) {
        console.log("Opening edit modal for", loan);
        setEditingLoan(loan);
        // Format dates for input type="date" (YYYY-MM-DD)
        setEditDateEmprunt(new Date(loan.dateEmprunt).toISOString().split('T')[0]);
        setEditDateRetour(new Date(loan.dateRetourPrevue).toISOString().split('T')[0]);
    }

    async function handleUpdate() {
        if (!editingLoan || !editDateEmprunt || !editDateRetour) return;

        setUpdating(true);
        try {
            const start = new Date(editDateEmprunt);
            const end = new Date(editDateRetour);
            const durationMs = end.getTime() - start.getTime();
            const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

            // Ensure start time is preserved if we want, but input date defaults to 00:00 UTC usually. 
            // Better to append a time or rely on backend to handle LocalDateTime parsing if string doesn't have time.
            // My backend expects LocalDateTime, so 'YYYY-MM-DDTHH:mm:ss'. 
            // EmpruntReqDto expects LocalDateTime.
            // If I send '2023-01-01', Jackson might fail or parse as start of day. 
            // 'isoString' usage above truncates time.
            // Let's add time T00:00:00 to be safe or keep the original time?
            // Original time might be relevant.
            // For simplicity, let's append T00:00:00 for now or rely on existing time if possible. 
            // Backend dateEmprunt is LocalDateTime.

            await empruntsApi.update(editingLoan.id, {
                dateEmprunt: editDateEmprunt + "T00:00:00",
                dureePrevueJours: durationDays
            });

            setEditingLoan(null);
            fetchLoans();
        } catch (error) {
            console.error("Error updating loan:", error);
            alert("Erreur lors de la modification");
        } finally {
            setUpdating(false);
        }
    }

    const filteredLoans = loans.filter((loan) => {
        if (filter === "all") return true;
        return loan.statut === filter;
    });

    const stats = {
        total: loans.length,
        enCours: loans.filter((l) => l.statut === "EN_COURS").length,
        retourne: loans.filter((l) => l.statut === "RETOURNE").length,
        enRetard: loans.filter((l) => l.statut === "EN_RETARD").length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Emprunts</h1>
                    <p className="text-neutral-500 mt-1">Gérez les emprunts de la bibliothèque</p>
                </div>
                <Link href="/loans/new">
                    <Button>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvel Emprunt
                    </Button>
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-neutral-200">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${filter === "all"
                        ? "border-black text-black"
                        : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                >
                    Tous ({stats.total})
                </button>
                <button
                    onClick={() => setFilter("EN_COURS")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${filter === "EN_COURS"
                        ? "border-black text-black"
                        : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                >
                    En cours ({stats.enCours})
                </button>
                <button
                    onClick={() => setFilter("RETOURNE")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${filter === "RETOURNE"
                        ? "border-black text-black"
                        : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                >
                    Retournés ({stats.retourne})
                </button>
                <button
                    onClick={() => setFilter("EN_RETARD")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1 ${filter === "EN_RETARD"
                        ? "border-black text-black"
                        : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                >
                    {stats.enRetard > 0 && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    En retard ({stats.enRetard})
                </button>
            </div>

            {/* Loans Table */}
            <Card className="p-0 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Utilisateur</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Livre</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date emprunt</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Retour prévu</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Statut</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredLoans.map((loan) => (
                            <tr key={loan.id} className="hover:bg-neutral-50">
                                <td className="px-6 py-4 font-medium text-black">#{loan.id}</td>
                                <td className="px-6 py-4 text-neutral-600">User #{loan.utilisateurId}</td>
                                <td className="px-6 py-4 text-neutral-600">Livre #{loan.livreId}</td>
                                <td className="px-6 py-4 text-neutral-600">
                                    {new Date(loan.dateEmprunt).toLocaleDateString("fr-FR")}
                                </td>
                                <td className={`px-6 py-4 ${loan.statut === "EN_RETARD" ? "text-red-500 font-medium" : "text-neutral-600"}`}>
                                    {new Date(loan.dateRetourPrevue).toLocaleDateString("fr-FR")}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${loan.statut === "EN_COURS" ? "bg-amber-100 text-amber-700" :
                                        loan.statut === "RETOURNE" ? "bg-green-100 text-green-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                        {loan.statut.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(loan)}
                                        >
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Button>

                                        {loan.statut !== "RETOURNE" && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleReturn(loan.id)}
                                                isLoading={returning === loan.id}
                                            >
                                                Retourner
                                            </Button>
                                        )}
                                        {loan.statut === "RETOURNE" && loan.dateRetourEffective && (
                                            <span className="text-sm text-green-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {new Date(loan.dateRetourEffective).toLocaleDateString("fr-FR")}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLoans.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-400">Aucun emprunt trouvé</p>
                    </div>
                )}
            </Card>


            <Modal
                isOpen={!!editingLoan}
                onClose={() => setEditingLoan(null)}
                title="Modifier l'emprunt"
            >
                <div className="space-y-4">
                    <Input
                        label="Date d'emprunt"
                        type="date"
                        value={editDateEmprunt}
                        onChange={(e) => setEditDateEmprunt(e.target.value)}
                    />
                    <Input
                        label="Date de retour prévue"
                        type="date"
                        value={editDateRetour}
                        onChange={(e) => setEditDateRetour(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="secondary" onClick={() => setEditingLoan(null)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            isLoading={updating}
                            disabled={!editDateEmprunt || !editDateRetour}
                        >
                            Enregistrer
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}
