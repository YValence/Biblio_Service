const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8762';

// Types
export interface User {
    id: number;
    nom: string;
    email: string;
    adresse: string;
    tel: string;
}

export interface UserInput {
    nom: string;
    email: string;
    adresse: string;
    tel: string;
}

export interface Livre {
    id: number;
    titre: string;
    auteur: string;
    categorie: string;
    isbn: string;
    quantiteTotale: number;
    quantiteDisponible: number;
    quantiteEmpruntee: number;
}

export interface LivreInput {
    titre: string;
    auteur: string;
    categorie: string;
    isbn: string;
    quantiteTotale: number;
    quantiteDisponible: number;
    quantiteEmpruntee: number;
}

export interface Emprunt {
    id: number;
    utilisateurId: number;
    livreId: number;
    dateEmprunt: string;
    dateRetourPrevue: string;
    dateRetourEffective: string | null;
    statut: 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';
    user?: User;
    livre?: Livre;
}

export interface EmpruntInput {
    utilisateurId?: number;
    livreId?: number;
    dureePrevueJours?: number;
    dateEmprunt?: string;
}

// Users API
export const usersApi = {
    getAll: async (): Promise<User[]> => {
        const res = await fetch(`${API_BASE_URL}/api/users/AllUser`);
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    getById: async (id: number): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    create: async (user: UserInput): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/api/users/addUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error:', res.status, res.statusText, errorText);
            throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    update: async (id: number, user: UserInput): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/api/users/DelUser/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete user');
    },
};

// Livres API
export const livresApi = {
    getAll: async (): Promise<Livre[]> => {
        const res = await fetch(`${API_BASE_URL}/api/livre`);
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
    },

    getById: async (id: number): Promise<Livre> => {
        const res = await fetch(`${API_BASE_URL}/api/livre/${id}`);
        if (!res.ok) throw new Error('Failed to fetch book');
        return res.json();
    },

    create: async (livre: LivreInput): Promise<Livre> => {
        const res = await fetch(`${API_BASE_URL}/api/livre/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livre),
        });
        if (!res.ok) throw new Error('Failed to create book');
        return res.json();
    },

    update: async (id: number, livre: LivreInput): Promise<Livre> => {
        const res = await fetch(`${API_BASE_URL}/api/livre/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livre),
        });
        if (!res.ok) throw new Error('Failed to update book');
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/api/livre/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete book');
    },
};

// Emprunts API
export const empruntsApi = {
    getAll: async (): Promise<Emprunt[]> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts`);
        if (!res.ok) throw new Error('Failed to fetch loans');
        return res.json();
    },

    getById: async (id: number): Promise<Emprunt> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch loan');
        return res.json();
    },

    getEnCours: async (): Promise<Emprunt[]> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/en-cours`);
        if (!res.ok) throw new Error('Failed to fetch active loans');
        return res.json();
    },

    getEnRetard: async (): Promise<Emprunt[]> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/en-retard`);
        if (!res.ok) throw new Error('Failed to fetch late loans');
        return res.json();
    },

    getByUserId: async (userId: number): Promise<Emprunt[]> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/user/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user loans');
        return res.json();
    },

    getByLivreId: async (livreId: number): Promise<Emprunt[]> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/livre/${livreId}`);
        if (!res.ok) throw new Error('Failed to fetch book loans');
        return res.json();
    },

    create: async (emprunt: EmpruntInput): Promise<Emprunt> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emprunt),
        });
        if (!res.ok) {
            const errorText = await res.text();
            // Try to parse JSON error from Spring Boot
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || 'Failed to create loan');
            } catch (e) {
                // If parsing fails or no message, use generic or text
                throw new Error(errorText || 'Failed to create loan');
            }
        }
        return res.json();
    },

    update: async (id: number, emprunt: EmpruntInput): Promise<Emprunt> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emprunt),
        });
        if (!res.ok) {
            const errorText = await res.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || 'Failed to update loan');
            } catch (e) {
                throw new Error(errorText || 'Failed to update loan');
            }
        }
        return res.json();
    },

    retourner: async (id: number): Promise<Emprunt> => {
        const res = await fetch(`${API_BASE_URL}/api/emprunts/${id}/retourner`, {
            method: 'PUT',
        });
        if (!res.ok) throw new Error('Failed to return book');
        return res.json();
    },
};
