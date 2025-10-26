import os
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext

def combine_files():
    folder = filedialog.askdirectory(title="Select Project Folder")
    if not folder:
        return

    output_file = os.path.join(folder, "output.txt")

    text_box.delete(1.0, tk.END)
    text_box.insert(tk.END, f"Scanning folder: {folder}\n")

    with open(output_file, "w", encoding="utf-8") as outfile:
        for root, _, files in os.walk(folder):
            for file in files:
                # Skip binary files and the output file itself
                if file == "output.txt":
                    continue
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as infile:
                        content = infile.read()
                    outfile.write(f"\n\n----- {file_path} -----\n\n")
                    outfile.write(content)
                    text_box.insert(tk.END, f"Added: {file_path}\n")
                    text_box.see(tk.END)
                    root_window.update()
                except Exception as e:
                    text_box.insert(tk.END, f"Skipped {file_path}: {e}\n")
                    text_box.see(tk.END)
                    root_window.update()

    messagebox.showinfo("Done", f"All files combined into:\n{output_file}")
    text_box.insert(tk.END, "\n✅ All done!\n")

# --- UI Setup ---
root_window = tk.Tk()
root_window.title("Project Folder Combiner")
root_window.geometry("600x400")
root_window.resizable(False, False)

title_label = tk.Label(root_window, text="📁 Combine Project Files into One Text File", font=("Arial", 14, "bold"))
title_label.pack(pady=10)

combine_button = tk.Button(root_window, text="Select Folder & Combine Files", command=combine_files, bg="#0078D7", fg="white", font=("Arial", 12), padx=10, pady=5)
combine_button.pack(pady=5)

text_box = scrolledtext.ScrolledText(root_window, width=70, height=15, wrap=tk.WORD)
text_box.pack(pady=10, padx=10)

root_window.mainloop()
