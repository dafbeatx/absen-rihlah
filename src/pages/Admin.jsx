import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Admin() {
  const [data, setData] = useState([]);

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
