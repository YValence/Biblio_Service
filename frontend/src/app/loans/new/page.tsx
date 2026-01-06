"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { empruntsApi, usersApi, livresApi, User, Livre } from "@/lib/api";

export default function NewLoanPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Livre[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
    const [userSearch, setUserSearch] = useState("");
    const [bookSearch, setBookSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersData, booksData] = await Promise.all([
                    usersApi.getAll(),
                    livresApi.getAll(),
                ]);
                setUsers(usersData);
                setBooks(booksData.filter((b) => b.quantiteDisponible > 0));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.nom.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredBooks = books.filter(
        (book) =>
            book.titre.toLowerCase().includes(bookSearch.toLowerCase()) ||
            book.auteur.toLowerCase().includes(bookSearch.toLowerCase())
    );

    async function handleSubmit() {
        if (!selectedUser || !selectedBook) return;

        setSubmitting(true);
        setError(null);
        try {
            await empruntsApi.create({
                utilisateurId: selectedUser,
                livreId: selectedBook,
            });
            router.push("/loans");
        } catch (error: any) {
            console.error("Error creating loan:", error);
            setError(error.message || "Impossible de créer l'emprunt");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                </button>
                <h1 className="text-2xl font-semibold text-black">Nouvel Emprunt</h1>
                <p className="text-neutral-500 mt-1">Sélectionnez un utilisateur et un livre</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Selection */}
                <Card>
                    <h2 className="text-base font-semibold text-black mb-4">
                        1. Sélectionner un utilisateur
                    </h2>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black mb-4"
                    />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user.id)}
                                className={`w-full p-3 rounded-lg text-left transition-all border ${selectedUser === user.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-neutral-200 hover:border-neutral-300"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedUser === user.id ? "bg-white text-black" : "bg-neutral-100 text-black"
                                        }`}>
                                        {user.nom.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.nom}</p>
                                        <p className={`text-sm ${selectedUser === user.id ? "text-neutral-300" : "text-neutral-500"}`}>
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredUsers.length === 0 && (
                            <p className="text-neutral-400 text-center py-4 text-sm">Aucun utilisateur trouvé</p>
                        )}
                    </div>
                </Card>

                {/* Book Selection */}
                <Card>
                    <h2 className="text-base font-semibold text-black mb-4">
                        2. Sélectionner un livre
                    </h2>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={bookSearch}
                        onChange={(e) => setBookSearch(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black mb-4"
                    />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredBooks.map((book) => (
                            <button
                                key={book.id}
                                onClick={() => setSelectedBook(book.id)}
                                className={`w-full p-3 rounded-lg text-left transition-all border ${selectedBook === book.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-neutral-200 hover:border-neutral-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{book.titre}</p>
                                        <p className={`text-sm ${selectedBook === book.id ? "text-neutral-300" : "text-neutral-500"}`}>
                                            {book.auteur}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${selectedBook === book.id ? "bg-white text-black" : "bg-green-100 text-green-700"
                                        }`}>
                                        {book.quantiteDisponible} dispo
                                    </span>
                                </div>
                            </button>
                        ))}
                        {filteredBooks.length === 0 && (
                            <p className="text-neutral-400 text-center py-4 text-sm">Aucun livre disponible</p>
                        )}
                    </div>
                </Card>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Summary & Submit */}
            <Card>
                <h2 className="text-base font-semibold text-black mb-4">Résumé</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <p className="text-neutral-500 text-sm mb-1">Utilisateur</p>
                        {selectedUser ? (
                            <p className="font-medium text-black">
                                {users.find((u) => u.id === selectedUser)?.nom}
                            </p>
                        ) : (
                            <p className="text-neutral-400">Non sélectionné</p>
                        )}
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <p className="text-neutral-500 text-sm mb-1">Livre</p>
                        {selectedBook ? (
                            <p className="font-medium text-black">
                                {books.find((b) => b.id === selectedBook)?.titre}
                            </p>
                        ) : (
                            <p className="text-neutral-400">Non sélectionné</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={() => router.back()} className="flex-1">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedUser || !selectedBook}
                        isLoading={submitting}
                        className="flex-1"
                    >
                        Créer l&apos;emprunt
                    </Button>
                </div>
            </Card>
        </div>
    );
}
