import React, { useState } from 'react';
import { X, Download, Upload, Trash2, Check, ShieldCheck, HardDrive } from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReload: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataReload,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HabitFinancial_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMsg({ text: 'File cadangan berhasil diunduh!', success: true });
  };

  const handleCopyClipboard = () => {
    const jsonStr = exportBackupJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importBackupJSON(importText);
    if (ok) {
      setStatusMsg({ text: 'Data berhasil dipulihkan!', success: true });
      onDataReload();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMsg({ text: 'Format data JSON tidak valid.', success: false });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importBackupJSON(content);
      if (ok) {
        setStatusMsg({ text: 'Data berhasil dipulihkan dari file!', success: true });
        onDataReload();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatusMsg({ text: 'File tidak valid atau rusak.', success: false });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 w-full max-w-md shadow-2xl border border-gray-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
          <div className="flex items-center space-x-2">
            <HardDrive size={18} className="text-rose-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Data & Cadangan Offline
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Offline Badge */}
        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start space-x-2.5 mb-4">
          <ShieldCheck size={18} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              100% Offline & Tersimpan di HP Anda
            </p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              Semua habit, keuangan, dan jurnal disimpan langsung di memori HP tanpa membutuhkan internet.
            </p>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl mb-3 text-xs font-bold ${
              statusMsg.success
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Export section */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-2">
              Ekspor / Unduh Cadangan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadFile}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-xs font-bold text-gray-800 dark:text-white transition"
              >
                <Download size={15} />
                <span>Unduh File .JSON</span>
              </button>
              <button
                onClick={handleCopyClipboard}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-xs font-bold text-gray-800 dark:text-white transition"
              >
                {copied ? <Check size={15} className="text-emerald-500" /> : <HardDrive size={15} />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="pt-2 border-t border-gray-100 dark:border-neutral-800">
            <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-2">
              Pulihkan / Impor Data
            </label>

            <div className="mb-2">
              <label className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 border-2 border-dashed border-gray-200 dark:border-neutral-700 hover:border-rose-500 rounded-2xl cursor-pointer text-xs font-bold text-gray-600 dark:text-neutral-300 transition">
                <Upload size={15} />
                <span>Pilih File Backup (.JSON)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={3}
              placeholder="Atau tempel teks JSON backup di sini..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-[11px] font-mono dark:text-white mb-2"
            />

            {importText.trim() && (
              <button
                onClick={handleImportSubmit}
                className="w-full py-2.5 rounded-2xl insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Terapkan Data Backup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
