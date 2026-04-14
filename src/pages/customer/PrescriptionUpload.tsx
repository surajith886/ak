// ============================================
// Prescription Upload Page
// ============================================

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileImage, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PrescriptionUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a prescription image");
      return;
    }
    setLoading(true);
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("Prescription submitted for review!", {
      description: "An admin will review your prescription and process your order.",
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-in">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Prescription Submitted</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          Your prescription has been uploaded and is pending review. You'll be notified once it's approved.
        </p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setNotes(""); }}>
          Upload Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Prescription</h1>
        <p className="text-muted-foreground text-sm">Upload your prescription to pre-order medicines</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          className={`glass-card p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors min-h-[200px] ${
            preview ? "p-4" : ""
          }`}
        >
          {preview ? (
            <img src={preview} alt="Prescription preview" className="max-h-60 rounded-lg object-contain" />
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-foreground font-medium">Click to upload prescription</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF up to 10MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
            <FileImage className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
          </div>
        )}

        <div>
          <Label className="text-foreground">Notes (optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific instructions or notes for the pharmacist..."
            className="mt-1 bg-secondary border-border"
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Submit Prescription
        </Button>
      </form>
    </div>
  );
};

export default PrescriptionUpload;
