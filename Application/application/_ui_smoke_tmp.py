"""Temporary read-only UI smoke test (no DB writes). Deleted after use."""
import tkinter as tk
import tkinter.messagebox as mb
mb.showinfo  = lambda *a, **k: None
mb.showerror = lambda *a, **k: print(f"  [mocked error] {a[0] if a else ''}")
mb.askyesno  = lambda *a, **k: False

from database.db_connection import DatabaseConnection
from gui.app_window import AppWindow

db = DatabaseConnection()
conn = db.get_connection()
print("DB connection:", "OK" if conn else "FAILED")
if conn:
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM Event")
    print("  Event count:", cur.fetchone()[0])
    cur.close()
    conn.close()

app = AppWindow()
app.withdraw()
app.update()

order = ["dashboard", "events", "sessions", "participants",
         "registration", "attendance", "payments", "certificates"]
for name in order:
    getattr(app, "show_" + name)()
    app.update()
    scr = app.current_screen
    counts = []
    for attr in ("tree", "reg_tree", "wait_tree", "att_tree", "roster_tree"):
        tv = getattr(scr, attr, None)
        if tv is not None:
            counts.append(f"{attr}={len(tv.get_children())}")
    print(f"  {name:<13} OK   active_nav={app.active_nav}   {' '.join(counts)}")

app.destroy()
print("UI SMOKE TEST PASSED")
