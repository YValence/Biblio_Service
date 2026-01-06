"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { usersApi, User, UserInput } from "@/lib/api";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserInput>({
        nom: "",
        email: "",
        adresse: "",
        tel: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const data = await usersApi.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.nom.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    function openCreateModal() {
        setEditingUser(null);
        setFormData({ nom: "", email: "", adresse: "", tel: "" });
        setIsModalOpen(true);
    }

    function openEditModal(user: User) {
        setEditingUser(user);
        setFormData({
            nom: user.nom,
            email: user.email,
            adresse: user.adresse,
            tel: user.tel,
        });
        setIsModalOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingUser) {
                console.log("Updating user:", formData);
                await usersApi.update(editingUser.id, formData);
            } else {
                console.log("Creating user:", formData);
                await usersApi.create(formData);
            }
            console.log("Operation successful");
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Erreur lors de l'enregistrement : " + error);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

        try {
            await usersApi.delete(id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
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
                    <h1 className="text-2xl font-semibold text-black">Utilisateurs</h1>
                    <p className="text-neutral-500 mt-1">{users.length} utilisateurs enregistrés</p>
                </div>
                <Button onClick={openCreateModal}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
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
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            {/* Users Table */}
            <Card className="p-0 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Nom</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Téléphone</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-neutral-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                                            {user.nom.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-black">{user.nom}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                                <td className="px-6 py-4 text-neutral-600">{user.tel || "—"}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                                            Modifier
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Supprimer
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-400">Aucun utilisateur trouvé</p>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label="Adresse"
                        value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                        placeholder="123 Rue Exemple"
                    />
                    <Input
                        label="Téléphone"
                        value={formData.tel}
                        onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                        placeholder="+212 600 000 000"
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" isLoading={submitting} className="flex-1">
                            {editingUser ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
