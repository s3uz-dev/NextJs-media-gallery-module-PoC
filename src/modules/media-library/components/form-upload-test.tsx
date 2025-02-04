'use client'
import { useState } from "react";

const FormUploadTest = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor selecciona una imagen");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/media/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            console.log("DATA: ", data)
            if (data.success) {
                setImageUrl(data.data.url);
            } else {
                alert("Error al subir la imagen");
            }
        } catch (error) {
            console.error("Error en la subida:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Subiendo..." : "Subir Imagen"}
            </button>

            {imageUrl && (
                <div>
                    <p>Imagen subida con éxito:</p>
                    <img src={imageUrl} alt="Imagen subida" width="200" />
                </div>
            )}
        </div>
    );
};

export default FormUploadTest;
