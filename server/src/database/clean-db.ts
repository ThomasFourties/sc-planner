import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'sc-planner-db',
  logging: true,
});

async function cleanDatabase() {
  try {
    console.log('🔌 Connexion à la base de données...');
    await dataSource.initialize();
    console.log('✅ Connexion établie');

    console.log('🧹 Début du nettoyage de la base de données...');

    // Désactiver temporairement les contraintes de clés étrangères
    console.log('🔓 Désactivation des contraintes de clés étrangères...');
    await dataSource.query('SET session_replication_role = replica;');

    // Supprimer les données dans l'ordre pour éviter les problèmes de contraintes
    const tables = [
      'tasks',      // Table avec des clés étrangères vers users et projects
      'projects',   // Table avec des clés étrangères vers clients
      'clients',    // Table indépendante
      'users',      // Table de base
    ];

    for (const table of tables) {
      console.log(`🗑️  Suppression des données de la table: ${table}`);
      const result = await dataSource.query(`DELETE FROM "${table}"`);
      console.log(`✅ ${result.length || 0} lignes supprimées de ${table}`);
    }

    // Réactiver les contraintes de clés étrangères
    console.log('🔒 Réactivation des contraintes de clés étrangères...');
    await dataSource.query('SET session_replication_role = DEFAULT;');

    // Réinitialiser les séquences si nécessaire
    console.log('🔄 Réinitialisation des séquences...');
    await dataSource.query(`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'ALTER SEQUENCE IF EXISTS ' || quote_ident(r.tablename) || '_id_seq RESTART WITH 1';
        END LOOP;
      END $$;
    `);

    console.log('✅ Base de données nettoyée avec succès!');
    console.log('📊 Résumé:');
    console.log('   - Toutes les données ont été supprimées');
    console.log('   - Les contraintes de clés étrangères ont été préservées');
    console.log('   - Les séquences ont été réinitialisées');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('🎉 Script de nettoyage terminé avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { cleanDatabase }; 