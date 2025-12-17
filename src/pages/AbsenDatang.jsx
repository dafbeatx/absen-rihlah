import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AbsenDatang() {
  // ===== CONFIG =====
  const PIN_PETUGAS = "1111";

  // ===== STATE =====
  const [authorized, setAuthorized] = useState(
    localStorage.getItem("petugas1") === "ok"
  );
  const [pin, setPin] = useState("");

  const [peserta, setPeserta] = useState([]);
  const [nama, setNama] = useState("");
  const [kelompok, setKelompok] = useState("");

  // ===== LOAD DATA PESERTA =====
  useEffect(() => {
    const ambilPeserta = async () => {
      const { data, error } = await supabase
        .from("peserta")
        .select("nama, kelompok");

      if (error) {
        alert("Gagal ambil data peserta");
        console.error(error);
      } else {
        setPeserta(data || []);
      }
    };

    ambilPeserta();
  }, []);

  // ===== CEK PIN =====
  const cekPin = () => {
    if (pin === PIN_PETUGAS) {
      localStorage.setItem("petugas1", "ok");
      setAuthorized(true);
    } else {
      alert("PIN salah");
    }
  };

  // ===== ABSEN DATANG =====
  const absenDatang = async () => {
    if (!nama) {
      alert("Pilih nama dulu");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    // Cegah dobel datang
    const { data: cek } = await supabase
      .from("absensi")
      .select("id")
      .eq("nama", nama)
      .eq("tanggal", today)
      .eq("jenis", "datang");

    if (cek && cek.length > 0) {
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

  // =====================================================
  // ===== JSX PIN (INI YANG DIMAKSUD JSX PALING ATAS) =====
  // =====================================================
  if (!authorized) {
    return (
      <div className="container">
        <h2>Masukkan PIN Petugas</h2>
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button onClick={cekPin}>Masuk</button>
      </div>
    );
  }

  // ======================
  // ===== JSX NORMAL =====
  // ======================
  const logout = () => {
  localStorage.removeItem("petugas1");
  setAuthorized(false);
};
  return (
    <div className="container">
      <h2>Absen Datang</h2>

      {/* FILTER KELOMPOK */}
      <select value={kelompok} onChange={(e) => setKelompok(e.target.value)}>
        <option value="">Semua Kelompok</option>
        {[...new Set(peserta.map((p) => p.kelompok))].map((k, i) => (
          <option key={i} value={k}>
            {k}
          </option>
        ))}
      </select>

      {/* DROPDOWN NAMA */}
      <select value={nama} onChange={(e) => setNama(e.target.value)}>
        <option value="">-- pilih nama --</option>
        {peserta
          .filter((p) => !kelompok || p.kelompok === kelompok)
          .map((p, i) => (
            <option key={i} value={p.nama}>
              {p.nama}
            </option>
          ))}
      </select>

      <button onClick={absenDatang}>HADIR</button>
    </div>
  );
<button
  style={{ background: "#dc2626", marginTop: "10px" }}
  onClick={logout}
>
  Logout
</button>
  
}
