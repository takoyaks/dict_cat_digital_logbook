function downloadTableAsCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) {
    alert("Table not found!");
    return;
  }

  let csvContent = "";
  const rows = table.querySelectorAll("tr");

  rows.forEach((row) => {
    // Check if the row is visible
    if (row.style.display !== "none") {
      const cells = row.querySelectorAll("th, td");
      const rowData = Array.from(cells).map((cell) => {
        // Escape double quotes and wrap content in quotes
        const content = cell.textContent.trim().replace(/"/g, '""');
        return `"${content}"`;
      });
      csvContent += rowData.join(",") + "\n";
    }
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export { downloadTableAsCSV };