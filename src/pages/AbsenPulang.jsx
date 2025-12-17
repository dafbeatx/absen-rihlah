import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AbsenPulang() {
  const [peserta, setPeserta] = useState([]);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const ambilPeserta = async () => {
      const { data } = await supabase
        .from("peserta")
        .select("nama");
      setPeserta(data || []);
    };
    ambilPeserta();
  }, []);

  const absenPulang = async () => {
    if (!nama) {
      alert("Pilih nama dulu");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    // cegah dobel pulang
    const { data: cek } = await supabase
      .from("absensi")
      .select("id")
      .eq("nama", nama)
      .eq("tanggal", today)
      .eq("jenis", "pulang");

    if (cek.length > 0) {
      alert("Sudah absen pulang");
      return;
    }

    const { error } = await supabase.from("absensi").insert([
      {
        nama,
        jenis: "pulang",
        tanggal: today,
        waktu: new Date().toTimeString().slice(0, 8),
        petugas: "Petugas 2",
      },
    ]);

    if (error) {
      alert("ERROR: " + error.message);
    } else {
      alert("Absen pulang berhasil");
      setNama("");
    }
  };

  return (
    <div>
      <h2>Absen Pulang</h2>

      <select value={nama} onChange={(e) => setNama(e.target.value)}>
        <option value="">-- pilih nama --</option>
        {peserta.map((p, i) => (
          <option key={i} value={p.nama}>
            {p.nama}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={absenPulang}>PULANG</button>
    return (
  <div className="container">
    <h2>Absen Pulang</h2>
    ...
  </div>
);
    </div>
  );
}
