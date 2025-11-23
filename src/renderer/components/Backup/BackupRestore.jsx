import React, { useState } from "react";
import JSZip from "jszip";
import CryptoJS from "crypto-js";
import "./BackupRestore.css"; // Assuming you have a CSS file for styles.
import { exportDatabaseBackup, importDatabaseBackup } from "../../Utils/DBService";

const PASSWORD = "your-secure-password"; // Replace with a secure password or prompt the user for it.

const BackupRestoreComponent = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Function to handle database backup
    const handleBackup = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await exportDatabaseBackup();

            if (response.success) {
                // Encrypt the JSON data
                const encryptedData = CryptoJS.AES.encrypt(response.data, PASSWORD).toString();

                // Create a ZIP file
                const zip = new JSZip();
                zip.file("database.json.enc", encryptedData);
                const zippedContent = await zip.generateAsync({ type: "blob" });

                // Save as a ZIP file
                const link = document.createElement("a");
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                link.href = URL.createObjectURL(zippedContent);
                link.download = `database-backup-${timestamp}.zip`;
                link.click();

                setMessage({ type: "success", text: "نسخه پشتیبان با موفقیت ذخیره شد." });
            } else {
                setMessage({ type: "error", text: "خطا در ذخیره‌سازی نسخه پشتیبان." });
            }
        } catch (error) {
            console.error("Backup error:", error);
            setMessage({ type: "error", text: "خطا در فرایند ذخیره‌سازی." });
        }

        setLoading(false);
    };

    // Function to handle database restore
    const handleRestore = async (event) => {
        setLoading(true);
        setMessage(null);

        try {
            const file = event.target.files[0];
            if (!file) {
                setMessage({ type: "error", text: "فایلی انتخاب نشده است." });
                setLoading(false);
                return;
            }

            // Load and unzip the file
            const zip = await JSZip.loadAsync(file);
            const encryptedData = await zip.file("database.json.enc").async("string");

            // Decrypt the zipped content
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, PASSWORD);
            const backupData = decryptedBytes.toString(CryptoJS.enc.Utf8);

            if (!backupData) {
                throw new Error("رمز عبور نادرست یا فایل پشتیبان نامعتبر است.");
            }

            // Validate and restore data
            const parsed = JSON.parse(backupData);
            if (!parsed || !Array.isArray(parsed.collections)) {
                setMessage({ type: "error", text: "پشتیبان داده نامعتبر است." });
                setLoading(false);
                return;
            }

            const response = await importDatabaseBackup(backupData);

            if (response.success) {
                setMessage({ type: "success", text: "بازیابی پایگاه داده با موفقیت انجام شد." });
            } else {
                setMessage({ type: "error", text: "خطا در بازیابی پایگاه داده." });
            }
        } catch (error) {
            console.error("Restore error:", error);
            setMessage({ type: "error", text: error.message || "خطا در فرایند بازیابی." });
        }

        setLoading(false);
    };

    return (
        <div className="backup-restore-container display_flex flex_direction_column align_items_center">
            <h1 className="margin_bottom_10">پشتیبان‌گیری و بازیابی پایگاه داده</h1>
            <div className="actions margin_top_20">
                <button onClick={handleBackup} className="btn primary" disabled={loading}>
                    {loading ? "در حال ذخیره‌سازی..." : "ذخیره نسخه پشتیبان"}
                </button>
                <div className="restore-action">
                    <input
                        type="file"
                        accept=".zip"
                        id="fileInput"
                        onChange={handleRestore}
                        disabled={loading}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="fileInput" className="btn secondary">
                        {loading ? "در حال بازیابی..." : "بازیابی از نسخه پشتیبان"}
                    </label>
                </div>
            </div>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default BackupRestoreComponent;
