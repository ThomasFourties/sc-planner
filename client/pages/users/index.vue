<template>
    <div class="content-users">
        <div class="users-list">
            <h2>Liste des utilisateurs</h2>
            <div v-for="user in users" :key="user.id" class="user-item">
                <div class="user-info">
                    {{ user.first_name }}
                    {{ user.last_name }} — {{ user.email }} — {{ user.role }}
                </div>
                <button @click="deleteUser(user.id)" class="delete-btn" :disabled="isDeleting === user.id">
                    {{ isDeleting === user.id ? 'Suppression...' : 'Supprimer' }}
                </button>
            </div>
        </div>

        <div class="add-user-form">
            <h2>Ajouter un utilisateur</h2>
            <form @submit.prevent="handleSubmit" class="form">
                <div class="form-groups">
                    <div class="form-group">
                        <label for="first_name">Prénom</label>
                        <input id="first_name" v-model="newUser.first_name" type="text" required>
                    </div>

                    <div class="form-group">
                        <label for="last_name">Nom</label>
                        <input id="last_name" v-model="newUser.last_name" type="text" required>
                    </div>
                </div>


                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="newUser.email" type="email" required>
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input id="password" v-model="newUser.password" type="password" required>
                </div>

                <div class="form-group">
                    <label for="role">Rôle</label>
                    <select id="role" v-model="newUser.role" required>
                        <option value="" disabled>Choisir un rôle</option>
                        <option value="SALARIE">Salarié</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="CLIENT">Client</option>
                    </select>
                </div>

                <div class="checkboxes-wp">
                    <div class="checkbox-wp">
                        <input id="is_admin" v-model="newUser.is_admin" type="checkbox">
                        <label for="is_admin">Administrateur</label>
                    </div>
                </div>

                <button type="submit" class="btn outline">Ajouter l'utilisateur</button>
            </form>
        </div>
    </div>
</template>

<script setup>
const users = ref([]);
const isDeleting = ref(null);
const newUser = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    is_admin: false
});

// Charger les utilisateurs
const loadUsers = async () => {
    try {
        users.value = await $fetch('http://localhost:3001/users');
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
};

// Soumettre le formulaire
const handleSubmit = async () => {
    try {
        await $fetch('http://localhost:3001/users', {
            method: 'POST',
            body: newUser.value
        });

        // Réinitialiser le formulaire
        newUser.value = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: '',
            is_admin: false
        };

        // Recharger la liste des utilisateurs
        await loadUsers();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    }
};

// Supprimer un utilisateur
const deleteUser = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        return;
    }

    try {
        isDeleting.value = id;
        await $fetch(`http://localhost:3001/users/${id}`, {
            method: 'DELETE'
        });
        await loadUsers();
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    } finally {
        isDeleting.value = null;
    }
};

// Charger les utilisateurs au montage du composant
onMounted(() => {
    loadUsers();
});
</script>

<style scoped>
.content-users {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.users-list,
.add-user-form {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-item {
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    flex: 1;
}

.delete-btn {
    background: #dc3545;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 1rem;
}

.delete-btn:hover {
    background: #c82333;
}

.delete-btn:disabled {
    background: #e4606d;
    cursor: not-allowed;
}
</style>