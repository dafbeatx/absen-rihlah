import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AbsenDatang() {
  const [peserta, setPeserta] = useState([]);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const ambilPeserta = async () => {
      const { data, error } = await supabase
        .from("peserta")
        .select("nama");

      console.log("DATA PESERTA:", data);

      if (!error) {
        setPeserta(data || []);
      }
    };

    ambilPeserta();
  }, []);

  // 🔥 FUNGSI HARUS DI SINI, SEBELUM return
  const absenDatang = async () => {
    console.log("TOMBOL DIKLIK");

    if (!nama) {
      alert("Pilih nama dulu");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: cek } = await supabase
      .from("absensi")
      .select("id")
      .eq("nama", nama)
      .eq("tanggal", today)
      .eq("jenis", "datang");

    if (cek.length > 0) {
      alert("Sudah absen datang");
      return;
    }

    const { error } = await supabase.from("absensi").insert([
      {
        nama,
        jenis: "datang",
        tanggal: today,
        waktu: new Date().toTimeString().slice(0, 8),
        petugas: "Petugas 1",
      },
    ]);

    if (error) {
      alert("ERROR: " + error.message);
    } else {
      alert("Absen datang berhasil");
      setNama("");
    }
  };

  // 🔥 JSX DI PALING BAWAH
  return (
    <div>
      <h2>Absen Datang</h2>

      <select value={nama} onChange={(e) => setNama(e.target.value)}>
        <option value="">-- pilih nama --</option>
        {peserta.map((p, i) => (
          <option key={i} value={p.nama}>
            {p.nama}
          </option>
        ))}
      </select>

      <br /><br />

      {/* 🔥 TOMBOL NYAMBUNG KE FUNGSI */}
      <button onClick={absenDatang}>HADIR</button>
    </div>
  );
}
