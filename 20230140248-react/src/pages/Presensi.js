import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from 'react-webcam';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// ADDED Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; 
import L from 'leaflet'; // Ditambahkan

// Fix for default Leaflet marker icon issue (common issue in bundlers)
if (L.Icon) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
}
// END FIX

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng} - Logika mapKey dihapus
  const navigate = useNavigate();
  const [image, setImage] = useState(null); 
 	const webcamRef = useRef(null);
  const getToken = () => localStorage.getItem("token"); 
 	const capture = useCallback(() => {
 	const imageSrc = webcamRef.current.getScreenshot();
 	    setImage(imageSrc); 
 	  }, [webcamRef]);

    


  // Dihapus: const [mapKey, setMapKey] = useState(0);

  // Fungsi untuk mendapatkan header otentikasi JWT
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  };

  // Fungsi untuk mendapatkan lokasi pengguna (Geolocation API)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude, // Mendapatkan latitude
            lng: position.coords.longitude // Mendapatkan longitude
          });
          setError(null);
          // Dihapus: setMapKey(prevKey => prevKey + 1);
        },
        (error) => {
          // Penanganan error jika izin ditolak atau gagal
          let errorMessage = "Gagal mendapatkan lokasi: " + error.message;
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Akses lokasi ditolak. Presensi mungkin tidak dapat dilakukan.";
          }
          setError(errorMessage);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation(); // Dapatkan lokasi saat komponen dimuat
  }, []); // [] memastikan hanya berjalan sekali saat mount

  const handleCheckIn = async () => {
    setError(""); 
    setMessage(""); 
    const config = getAuthHeaders();
    if (!config) return;

    if (!coords || !image) {
 	      setError("Lokasi dan Foto wajib ada!");
 	      return;
 	    }


    try {
 	      
 	      const blob = await (await fetch(image)).blob();
 	      
 	      //Buat FormData
 	      const formData = new FormData();
 	      formData.append('latitude', coords.lat);
 	      formData.append('longitude', coords.lng);
 	      formData.append('image', blob, 'selfie.jpg'); 
 	
 	      const response = await axios.post(
 	        'http://localhost:3001/api/presensi/check-in',
 	        formData, 
 	        { headers: { Authorization: `Bearer ${getToken()}` } }
 	      );
 	      
 	      setMessage(response.data.message);
 
    } catch (err) {
      setError(err.response?.data?.message || "Check-In gagal");
    }
  };

  const handleCheckOut = async () => {
    setError(""); 
    setMessage(""); 
    const config = getAuthHeaders();
    if (!config) return;
    
    try {
      const response = await axios.post("http://localhost:3001/api/presensi/check-out", {}, config);
      setMessage(response.data.message); 
    } catch (err) {
      setError(err.response?.data?.message || "Check-Out gagal");
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Lakukan Presensi
      </h2>

      {/* Visualisasi Peta */}
      {coords ? (
        <div className="my-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Presensi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <div className="my-4 p-4 text-center text-gray-600 border rounded-lg bg-yellow-50">
          Memuat lokasi... (Pastikan izin lokasi diberikan)
        </div>
      )}

      {/* --- PLACE THE CAMERA HERE --- */}
      <div className="my-4 border rounded-lg overflow-hidden bg-black">
        {image ? (
          <img src={image} alt="Selfie" className="w-full" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />
        )}
      </div>

      {/* Tombol Capture / Ulang */}
      <div className="mb-4">
        {!image ? (
          <button
            onClick={capture}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Ambil Foto 📸
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          >
            Foto Ulang 🔄
          </button>
        )}
      </div>
      {/* --- END CAMERA SECTION --- */}

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Tombol Check-In & Check-Out */}
      <div className="flex space-x-4">
        <button
          onClick={handleCheckIn}
          className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50"
          disabled={!coords || !image} // WAJIB FOTO DULU
        >
          Check-In
        </button>

        <button
          onClick={handleCheckOut}
          className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
        >
          Check-Out
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-400"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  </div>
);

}

export default AttendancePage;