import tkinter as tk
from gui.registration_screen import RegistrationScreen
from database.db_connection import DatabaseConnection
import tkinter.messagebox as mb

def fake_showinfo(title, msg): print(f"INFO: {title} - {msg}")
def fake_showerror(title, msg): print(f"ERROR: {title} - {msg}")
def fake_askyesno(title, msg): 
    print(f"ASK: {title} - {msg}")
    return True

mb.askyesno = fake_askyesno
mb.showinfo = fake_showinfo
mb.showerror = fake_showerror

root = tk.Tk()
screen = RegistrationScreen(root)

db = DatabaseConnection()
conn = db.get_connection()
cursor = conn.cursor()
cursor.execute("INSERT INTO Event (event_name, category_id, coordinator_id, event_date, max_capacity, registration_fee, status) VALUES ('Cap Test Event', 1, 1, '2026-11-20', 1, 0, 'Open')")
conn.commit()
test_event_id = cursor.lastrowid
screen.load_dropdowns()

cursor.execute("SELECT participant_name FROM Participant ORDER BY participant_name LIMIT 3")
parts = [p[0] for p in cursor.fetchall()]
p1, p2, p3 = parts[0], parts[1], parts[2]

screen.var_event.set('Cap Test Event')
screen.var_participant.set(p1)
screen.var_date.set('2026-10-04')
print(f"Attempting to register {p1} to Cap Test Event")
screen.register_participant()

screen.load_data()
print(f"Registrations count: {len(screen.reg_tree.get_children())}")

screen.var_participant.set(p2)
print(f"Attempting to register {p2} to Cap Test Event")
screen.register_participant()

screen.load_data()
print(f"Waitlist count: {len(screen.wait_tree.get_children())}")

cursor.execute("DELETE FROM Waitlist WHERE event_id=%s", (test_event_id,))
cursor.execute("DELETE FROM Registration WHERE event_id=%s", (test_event_id,))
cursor.execute("DELETE FROM Event WHERE event_id=%s", (test_event_id,))
conn.commit()
