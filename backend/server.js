const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// --- USERS ROUTES ---

// Get all users
app.get('/api/users', (req, res) => {
    const sql = "SELECT * FROM users ORDER BY name";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Get single user
app.get('/api/users/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            message: "success",
            data: row
        });
    });
});

// Create new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    console.log('POST /api/users - Request body:', { name, email });

    if (!name || !email) {
        console.log('POST /api/users - Missing name or email');
        res.status(400).json({ error: "Name and email are required" });
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('POST /api/users - Invalid email format');
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    // Check if email already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
            console.error('POST /api/users - Error checking email:', err);
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            console.log('POST /api/users - Email already exists');
            res.status(400).json({ error: "Email already exists" });
            return;
        }

        // Create new user
        const id = Math.random().toString(36).substr(2, 9);
        const sql = `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`;
        const params = [id, name, email];

        console.log('POST /api/users - Creating user with id:', id);

        db.run(sql, params, function (err) {
            if (err) {
                console.error('POST /api/users - Error inserting user:', err);
                res.status(400).json({ error: err.message });
                return;
            }
            console.log('POST /api/users - User created successfully:', { id, name, email });
            res.json({
                message: "success",
                data: { id, name, email }
            });
        });
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!name || !email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    // Check if email already exists for another user
    db.get("SELECT * FROM users WHERE email = ? AND id != ?", [email, id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }

        // Update user
        const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
        const params = [name, email, id];

        db.run(sql, params, function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json({
                message: "success",
                data: { id, name, email }
            });
        });
    });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            message: "success",
            data: { id }
        });
    });
});

// --- WORKSHOPS ROUTES ---

// Get all workshops (with stats)
app.get('/api/workshops', (req, res) => {
    const sql = `
        SELECT w.*, 
        (SELECT COUNT(*) FROM registrations r WHERE r.workshopId = w.id AND r.status = 'enrolled') as enrolled,
        (SELECT COUNT(*) FROM registrations r WHERE r.workshopId = w.id AND r.status = 'waitlist') as waitlist
        FROM workshops w
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Get single workshop details
app.get('/api/workshops/:id', (req, res) => {
    const sql = `
        SELECT w.*, 
        (SELECT COUNT(*) FROM registrations r WHERE r.workshopId = w.id AND r.status = 'enrolled') as enrolled,
        (SELECT COUNT(*) FROM registrations r WHERE r.workshopId = w.id AND r.status = 'waitlist') as waitlist
        FROM workshops w
        WHERE w.id = ?
    `;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Workshop not found" });
            return;
        }
        res.json({
            message: "success",
            data: row
        });
    });
});

// Create new workshop
app.post('/api/workshops', (req, res) => {
    const { title, description, dateTime, capacity, organizerId, organizerName } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    const sql = `INSERT INTO workshops (id, title, description, dateTime, capacity, organizerId, organizerName) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, title, description, dateTime, capacity, organizerId, organizerName];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id, title, description, dateTime, capacity, organizerId, organizerName }
        });
    });
});

// Update workshop
app.put('/api/workshops/:id', (req, res) => {
    const { title, description, dateTime, capacity } = req.body;
    const { id } = req.params;

    if (!title || !description || !dateTime || !capacity) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    const sql = `UPDATE workshops SET title = ?, description = ?, dateTime = ?, capacity = ? WHERE id = ?`;
    const params = [title, description, dateTime, capacity, id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Workshop not found" });
            return;
        }
        res.json({
            message: "success",
            data: { id, title, description, dateTime, capacity }
        });
    });
});

// Delete workshop
app.delete('/api/workshops/:id', (req, res) => {
    const { id } = req.params;

    // First delete all registrations for this workshop
    db.run("DELETE FROM registrations WHERE workshopId = ?", [id], (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        // Then delete the workshop
        db.run("DELETE FROM workshops WHERE id = ?", [id], function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: "Workshop not found" });
                return;
            }
            res.json({
                message: "success",
                data: { id }
            });
        });
    });
});

// --- REGISTRATIONS ROUTES ---

// Get registrations for a workshop
app.get('/api/registrations/:workshopId', (req, res) => {
    const sql = "SELECT * FROM registrations WHERE workshopId = ?";
    db.all(sql, [req.params.workshopId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Check if user is registered for a workshop
app.get('/api/registrations/check/:workshopId/:email', (req, res) => {
    const { workshopId, email } = req.params;

    const sql = "SELECT * FROM registrations WHERE workshopId = ? AND email = ?";
    db.get(sql, [workshopId, email], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: {
                isRegistered: !!row,
                registration: row || null
            }
        });
    });
});

// Register for a workshop
app.post('/api/registrations', (req, res) => {
    const { workshopId, name, email } = req.body;

    // First check if user is already registered for this workshop
    db.get("SELECT * FROM registrations WHERE workshopId = ? AND email = ?", [workshopId, email], (err, existingRegistration) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (existingRegistration) {
            res.status(400).json({ error: "Já está inscrito neste workshop" });
            return;
        }

        // Check capacity
        db.get("SELECT capacity, (SELECT COUNT(*) FROM registrations WHERE workshopId = ? AND status = 'enrolled') as enrolled FROM workshops WHERE id = ?", [workshopId, workshopId], (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(404).json({ error: "Workshop not found" });
                return;
            }

            const isFull = row.enrolled >= row.capacity;
            const status = isFull ? 'waitlist' : 'enrolled';
            const id = Math.random().toString(36).substr(2, 9);
            const registeredAt = new Date().toISOString();

            const sql = `INSERT INTO registrations (id, workshopId, name, email, status, registeredAt) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [id, workshopId, name, email, status, registeredAt];

            db.run(sql, params, function (err) {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: { id, workshopId, name, email, status, registeredAt }
                });
            });
        });
    });
});

// Cancel registration
app.delete('/api/registrations/:workshopId/:email', (req, res) => {
    const { workshopId, email } = req.params;

    // First, get the registration being cancelled to check its status
    db.get("SELECT status FROM registrations WHERE workshopId = ? AND email = ?", [workshopId, email], (err, registration) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!registration) {
            res.status(404).json({ error: "Registration not found" });
            return;
        }

        const wasEnrolled = registration.status === 'enrolled';

        // Delete the registration
        const sql = "DELETE FROM registrations WHERE workshopId = ? AND email = ?";
        db.run(sql, [workshopId, email], function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }

            // If the cancelled registration was enrolled, promote the first waitlist user
            if (wasEnrolled) {
                // Find the oldest waitlist registration for this workshop
                db.get(
                    "SELECT id FROM registrations WHERE workshopId = ? AND status = 'waitlist' ORDER BY registeredAt ASC LIMIT 1",
                    [workshopId],
                    (err, waitlistUser) => {
                        if (err) {
                            console.error('Error finding waitlist user:', err);
                            // Still return success for the cancellation
                            res.json({
                                message: "success",
                                data: { workshopId, email }
                            });
                            return;
                        }

                        if (waitlistUser) {
                            // Promote the waitlist user to enrolled
                            db.run(
                                "UPDATE registrations SET status = 'enrolled' WHERE id = ?",
                                [waitlistUser.id],
                                (err) => {
                                    if (err) {
                                        console.error('Error promoting waitlist user:', err);
                                    } else {
                                        console.log(`Promoted waitlist user ${waitlistUser.id} to enrolled`);
                                    }
                                    // Return success regardless
                                    res.json({
                                        message: "success",
                                        data: { workshopId, email, promoted: true }
                                    });
                                }
                            );
                        } else {
                            // No waitlist users to promote
                            res.json({
                                message: "success",
                                data: { workshopId, email, promoted: false }
                            });
                        }
                    }
                );
            } else {
                // Cancelled registration was from waitlist, no promotion needed
                res.json({
                    message: "success",
                    data: { workshopId, email, promoted: false }
                });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('  GET    /api/users');
    console.log('  GET    /api/users/:id');
    console.log('  POST   /api/users');
    console.log('  PUT    /api/users/:id');
    console.log('  DELETE /api/users/:id');
    console.log('  GET    /api/workshops');
    console.log('  GET    /api/workshops/:id');
    console.log('  POST   /api/workshops');
    console.log('  PUT    /api/workshops/:id');
    console.log('  DELETE /api/workshops/:id');
    console.log('  GET    /api/registrations/:workshopId');
    console.log('  POST   /api/registrations');
    console.log('  GET    /api/registrations/check/:workshopId/:email');
    console.log('  DELETE /api/registrations/:workshopId/:email');
});