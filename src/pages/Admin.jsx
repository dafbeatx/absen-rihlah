import { useEffect, useState } from "react";
import { supabase } from "../supabase";

if (!authorized) {
  return (
    <div className="container">
      <h2>PIN Admin</h2>
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button onClick={cekPin}>Masuk</button>
    </div>
  );
}
export default function Admin() {
  const [data, setData] = useState([]);
  const total = new Set(data.map(d => d.nama)).size;
const datang = data.filter(d => d.jenis === "datang").length;
const pulang = data.filter(d => d.jenis === "pulang").length;
const PIN_ADMIN = "9999";

const [authorized, setAuthorized] = useState(
  localStorage.getItem("admin") === "ok"
);
const [pin, setPin] = useState("");
const cekPin = () => {
  if (pin === PIN_ADMIN) {
    localStorage.setItem("admin", "ok");
    setAuthorized(true);
  } else {
    alert("PIN admin salah");
  }
};

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("absensi")
        .select("*")
        .eq("tanggal", today)
        .order("waktu", { ascending: true });
      setData(data || []);
    };
    load();
  }, []);

  const kirimWA = () => {
    const teks = data
      .map(d => `• ${d.nama} — ${d.jenis} (${d.waktu})`)
      .join("\n");

    window.open(
      `https://wa.me/62895351251395text=${encodeURIComponent(
        "Rekap Absen Hari Ini:\n" + teks
      )}`
    );
  };
<div className="stats">
  <div className="card">Total Peserta<br /><b>{total}</b></div>
  <div className="card">Datang<br /><b>{datang}</b></div>
  <div className="card">Pulang<br /><b>{pulang}</b></div>
</div>

  return (
    <div>
      <h2>Rekap Absen Hari Ini</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Jenis</th>
            <th>Waktu</th>
            <th>Petugas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.nama}</td>
              <td>{d.jenis}</td>
              <td>{d.waktu}</td>
              <td>{d.petugas}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={kirimWA}>Kirim ke WhatsApp</button>
    </div>
  );
}
