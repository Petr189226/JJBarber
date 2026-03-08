import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon, PrinterIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { VoucherTemplate, type VoucherData } from "./VoucherTemplate";

interface VoucherPreviewModalProps {
  open: boolean;
  data: VoucherData;
  onClose: () => void;
}

export function VoucherPreviewModal({ open, data, onClose }: VoucherPreviewModalProps) {
  const voucherRef = useRef<HTMLDivElement>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handlePrint = () => {
    const el = document.getElementById("voucher-print");
    if (!el) return;
    const clone = el.cloneNode(true) as HTMLElement;
    const wrap = document.createElement("div");
    wrap.style.cssText = "width:740px;height:520px;background:#FDFAF5;";
    wrap.appendChild(clone);
    const win = window.open("", "_blank");
    if (!win) return;
    const base = window.location.origin;
    win.document.write(`
      <!DOCTYPE html><html><head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=Inter:wght@300;400;500;600&display=swap" />
        <base href="${base}/" />
        <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#666;} @media print{body{background:white;}</style>
      </head><body>${wrap.outerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  const handleDownloadPdf = async () => {
    const el = voucherRef.current;
    if (!el) return;
    setGeneratingPdf(true);
    try {
      const clone = el.cloneNode(true) as HTMLDivElement;
      const origin = window.location.origin;
      const logoImg = clone.querySelector('img[src="/logo-480.webp"]') as HTMLImageElement | null;
      if (logoImg) logoImg.src = origin + "/logo-480.webp";
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:740px;height:520px;border:0;";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument!;
      doc.open();
      doc.write(`
        <!DOCTYPE html><html><head>
          <style>
            *{box-sizing:border-box}
            body{margin:0;padding:0;background:#FDFAF5;min-height:100vh;display:flex;align-items:center;justify-content:center}
          </style>
        </head><body>${clone.outerHTML}</body></html>
      `);
      doc.close();
      const img = doc.querySelector("#voucher-print img") as HTMLImageElement | null;
      if (img && !img.complete) {
        await new Promise<void>((r) => {
          img.onload = () => r();
          img.onerror = () => r();
          setTimeout(r, 2000);
        });
      }
      await new Promise((r) => setTimeout(r, 150));
      const target = doc.getElementById("voucher-print");
      if (!target) {
        iframe.remove();
        return;
      }
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FDFAF5",
        logging: false,
        windowWidth: 740,
        windowHeight: 520,
      });
      iframe.remove();
      const imgData = canvas.toDataURL("image/png", 1);
      const pdf = new jsPDF({ unit: "mm", format: [210, 148] });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const h = pdfW / ratio;
      const y = (pdfH - h) / 2;
      pdf.addImage(imgData, "PNG", 0, y, pdfW, h);
      const name = [data.firstName, data.lastName].filter(Boolean).join("_") || "voucher";
      pdf.save(`voucher_${name}_${data.voucherNumber || "bez-cisla"}.pdf`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Náhled voucheru"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between flex-shrink-0 px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Náhled voucheru</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Zavřít"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-gray-100">
          <div className="scale-[0.55] origin-top" style={{ marginLeft: 0 }}>
            <VoucherTemplate data={data} printRef={voucherRef} />
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-3 px-4 py-3 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <PrinterIcon size={18} />
            Tisk
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#08080c] transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", boxShadow: "0 4px 14px rgba(201,168,76,0.25)" }}
          >
            {generatingPdf ? <Loader2Icon size={18} className="animate-spin" /> : <DownloadIcon size={18} />}
            {generatingPdf ? "Generuji PDF…" : "Stáhnout PDF"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
