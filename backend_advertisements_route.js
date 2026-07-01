// routes/advertisements.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust to your db/pool import
const { verifyToken, isAdmin } = require("../middleware/auth"); // adjust to your auth middleware

// ── Public: GET /api/advertisements ──────────────────────────────────────────
// Query params: ?category=Services&active=true
router.get("/", async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = "SELECT * FROM advertisements WHERE 1=1";
    const params = [];

    if (active === "true") {
      params.push(true);
      query += ` AND is_active = $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, params);
    res.json({ advertisements: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Public: GET /api/advertisements/:id ──────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM advertisements WHERE id = $1", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── Admin: POST /api/advertisements ──────────────────────────────────────────
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, category, description, location, phone, image, is_active = true } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const result = await db.query(
      `INSERT INTO advertisements (title, category, description, location, phone, image, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, category, description, location, phone, image, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Admin: PUT /api/advertisements/:id ───────────────────────────────────────
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, category, description, location, phone, image, is_active } = req.body;
    const result = await db.query(
      `UPDATE advertisements
       SET title=$1, category=$2, description=$3, location=$4, phone=$5, image=$6, is_active=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [title, category, description, location, phone, image, is_active, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Admin: PATCH /api/advertisements/:id/toggle ──────────────────────────────
router.patch("/:id/toggle", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE advertisements SET is_active = NOT is_active, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── Admin: DELETE /api/advertisements/:id ────────────────────────────────────
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM advertisements WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
