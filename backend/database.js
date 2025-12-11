const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'workshop.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )`);

        // Workshops Table
        db.run(`CREATE TABLE IF NOT EXISTS workshops (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            dateTime TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            organizerId TEXT NOT NULL,
            organizerName TEXT NOT NULL
        )`);

        // Registrations Table
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            workshopId TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT CHECK(status IN ('enrolled', 'waitlist')) NOT NULL,
            registeredAt TEXT NOT NULL,
            FOREIGN KEY (workshopId) REFERENCES workshops (id)
        )`);

        console.log('Database tables initialized.');

        // Seed initial data if empty
        seedData();
    });
}

function seedData() {
    // Seed users
    db.get("SELECT count(*) as count FROM users", [], (err, row) => {
        if (err) return console.error(err.message);

        if (row.count === 0) {
            console.log('Seeding users...');
            const userStmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");

            const users = [
                ['u1', 'Ana Silva', 'ana.silva@example.com'],
                ['u2', 'Beatriz Cardoso', 'beatriz.cardoso@example.com'],
                ['u3', 'Carla Oliveira', 'carla.oliveira@example.com'],
                ['u4', 'David Costa', 'david.costa@example.com'],
                ['u5', 'Eva Martins', 'eva.martins@example.com'],
                ['u6', 'Filipe Rodrigues', 'filipe.rodrigues@example.com'],
                ['u7', 'Gabriela Ferreira', 'gabriela.ferreira@example.com'],
                ['u8', 'Hugo Alves', 'hugo.alves@example.com'],
                ['u9', 'Inês Pereira', 'ines.pereira@example.com'],
                ['u10', 'João Lima', 'joao.lima@example.com']
            ];

            users.forEach(u => userStmt.run(u));
            userStmt.finalize();
            console.log('Users seeded successfully.');
        }
    });

    // Seed workshops
    db.get("SELECT count(*) as count FROM workshops", [], (err, row) => {
        if (err) return console.error(err.message);

        if (row.count === 0) {
            console.log('Seeding workshops...');
            const stmt = db.prepare("INSERT INTO workshops VALUES (?, ?, ?, ?, ?, ?, ?)");

            const workshops = [
                ['1', 'Introdução ao React Native', 'Aprenda os fundamentos do desenvolvimento mobile com React Native e Expo.', '2025-12-15T14:00:00', 30, 'org1', 'Organizador'],
                ['2', 'Node.js Avançado', 'Técnicas avançadas de desenvolvimento backend com Node.js.', '2025-12-18T10:00:00', 20, 'org1', 'Organizador'],
                ['3', 'Design de UI/UX para Mobile', 'Princípios de design para aplicações mobile.', '2025-12-20T16:00:00', 25, 'org1', 'Organizador'],
                ['4', 'TypeScript na Prática', 'Domine TypeScript e melhore a qualidade do seu código.', '2025-12-22T14:00:00', 35, 'org1', 'Organizador'],
                ['5', 'Introdução ao NextJS', 'Domine NextJS e melhore a qualidade do seu código.', '2025-12-22T14:00:00', 2, 'org1', 'Organizador'],
                ['6', 'Introdução ao Vue.js (Passado)', 'Workshop introdutório sobre o framework Vue.js.', '2023-01-15T10:00:00', 20, 'org1', 'Organizador'],
                ['7', 'CSS Grid & Flexbox (Passado)', 'Domine layouts modernos com CSS.', '2023-02-20T14:00:00', 25, 'org1', 'Organizador']
            ];

            workshops.forEach(w => stmt.run(w));
            stmt.finalize();

            // Seed registrations
            const regStmt = db.prepare("INSERT INTO registrations VALUES (?, ?, ?, ?, ?, ?)");
            regStmt.run(['r1', '1', 'Pedro Costa', 'pedro@example.com', 'enrolled', '2025-12-01T10:00:00']);
            regStmt.run(['r2', '1', 'Ana Rodrigues', 'ana@example.com', 'enrolled', '2025-12-01T11:30:00']);
            regStmt.finalize();

            console.log('Workshops seeded successfully.');
        }
    });
}

module.exports = db;
