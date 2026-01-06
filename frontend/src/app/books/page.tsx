"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { livresApi, Livre, LivreInput } from "@/lib/api";

const categories = [
    { value: "ROMAN", label: "Roman" },
    { value: "SCIENCE_FICTION", label: "Science Fiction" },
    { value: "HISTOIRE", label: "Histoire" },
    { value: "BIOGRAPHIE", label: "Biographie" },
    { value: "TECHNIQUE", label: "Technique" },
    { value: "JEUNESSE", label: "Jeunesse" },
    { value: "AUTRE", label: "Autre" },
];

export default function BooksPage() {
    const [books, setBooks] = useState<Livre[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Livre | null>(null);
    const [formData, setFormData] = useState<LivreInput>({
        titre: "",
        auteur: "",
        categorie: "ROMAN",
        isbn: "",
        quantiteTotale: 1,
        quantiteDisponible: 1,
        quantiteEmpruntee: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            const data = await livresApi.getAll();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.titre.toLowerCase().includes(search.toLowerCase()) ||
            book.auteur.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || book.categorie === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    function openCreateModal() {
        setEditingBook(null);
        setFormData({
            titre: "",
            auteur: "",
            categorie: "ROMAN",
            isbn: "",
            quantiteTotale: 1,
            quantiteDisponible: 1,
            quantiteEmpruntee: 0,
        });
        setIsModalOpen(true);
    }

    function openEditModal(book: Livre) {
        setEditingBook(book);
        setFormData({
            titre: book.titre,
            auteur: book.auteur,
            categorie: book.categorie,
            isbn: book.isbn,
            quantiteTotale: book.quantiteTotale,
            quantiteDisponible: book.quantiteDisponible,
            quantiteEmpruntee: book.quantiteEmpruntee,
        });
        setIsModalOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingBook) {
                await livresApi.update(editingBook.id, formData);
            } else {
                await livresApi.create(formData);
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            console.error("Error saving book:", error);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;

        try {
            await livresApi.delete(id);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Livres</h1>
                    <p className="text-neutral-500 mt-1">{books.length} livres dans le catalogue</p>
                </div>
                <Button onClick={openCreateModal}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher par titre, auteur ou ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Books Table */}
            <Card className="p-0 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Livre</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Catégorie</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">ISBN</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredBooks.map((book) => (
                            <tr key={book.id} className="hover:bg-neutral-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-black">{book.titre}</p>
                                        <p className="text-sm text-neutral-500">{book.auteur}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700">
                                        {book.categorie}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-neutral-600 font-mono text-sm">{book.isbn}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${book.quantiteDisponible > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {book.quantiteDisponible}
                                        </span>
                                        <span className="text-neutral-400">/ {book.quantiteTotale}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditModal(book)}>
                                            Modifier
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Supprimer
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBooks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-400">Aucun livre trouvé</p>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBook ? "Modifier le livre" : "Nouveau livre"}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Titre"
                            value={formData.titre}
                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            placeholder="Le Petit Prince"
                            required
                        />
                        <Input
                            label="Auteur"
                            value={formData.auteur}
                            onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                            placeholder="Antoine de Saint-Exupéry"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Catégorie"
                            value={formData.categorie}
                            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                            options={categories}
                        />
                        <Input
                            label="ISBN"
                            value={formData.isbn}
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                            placeholder="978-3-16-148410-0"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Quantité totale"
                            type="number"
                            min="1"
                            value={formData.quantiteTotale}
                            onChange={(e) => setFormData({ ...formData, quantiteTotale: parseInt(e.target.value) || 1 })}
                        />
                        <Input
                            label="Disponible"
                            type="number"
                            min="0"
                            value={formData.quantiteDisponible}
                            onChange={(e) => setFormData({ ...formData, quantiteDisponible: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="Empruntée"
                            type="number"
                            min="0"
                            value={formData.quantiteEmpruntee}
                            onChange={(e) => setFormData({ ...formData, quantiteEmpruntee: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" isLoading={submitting} className="flex-1">
                            {editingBook ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
