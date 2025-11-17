import fs from "fs";
import path from "path";

const BASE = path.join(process.cwd(), "Backups");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function saveOrderBackup(order) {
  try {
    ensureDir(BASE);
    const date = new Date();
    const day = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const dayDir = path.join(BASE, day);
    ensureDir(dayDir);

    // append to orders.json (array)
    const ordersFile = path.join(dayDir, "orders.json");
    let arr = [];
    if (fs.existsSync(ordersFile)) {
      try {
        arr = JSON.parse(fs.readFileSync(ordersFile, "utf8") || "[]");
      } catch (e) {
        arr = [];
      }
    }
    arr.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(arr, null, 2));

    // save individual file
    const ts = date.getTime();
    const single = path.join(dayDir, `order-${ts}.json`);
    fs.writeFileSync(single, JSON.stringify(order, null, 2));

    return true;
  } catch (err) {
    console.error("Backup error:", err);
    return false;
  }
}

