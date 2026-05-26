import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/admin-utils";
import { toast } from "sonner";

const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan transition-colors";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-muted-foreground/70 mt-1">{hint}</div>}
    </label>
  );
}

export function TextInput({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return <input type={type} className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <input type="number" className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} />;
}

export function TextArea({ value, onChange, rows = 4, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return <textarea className={inputCls} value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)} />;
}

export function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all ${value ? "bg-cyan/10 border-cyan text-cyan" : "border-border text-muted-foreground"}`}>
      <span className={`w-2 h-2 rounded-full ${value ? "bg-cyan" : "bg-muted-foreground"}`} />
      {label ?? (value ? "On" : "Off")}
    </button>
  );
}

export function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-[oklch(0.83_0.16_215)]" />
      <span className="text-xs font-mono text-cyan w-10 text-right">{value}%</span>
    </div>
  );
}

export function TagInput({ tags, onChange, placeholder = "Type and press Enter" }: {
  tags: string[]; onChange: (t: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  const remove = (t: string) => onChange(tags.filter((x) => x !== t));
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="chip chip-cyan inline-flex items-center gap-1">
            {t}
            <button type="button" onClick={() => remove(t)} className="hover:text-red-400"><X size={10} /></button>
          </span>
        ))}
      </div>
      <input
        className={inputCls}
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
        }}
        onBlur={add}
      />
    </div>
  );
}

export function ListInput({ items, onChange, placeholder = "Add item" }: {
  items: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={it}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items]; next[i] = e.target.value; onChange(next);
            }}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="px-3 text-muted-foreground hover:text-red-400">
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="inline-flex items-center gap-1 text-xs text-cyan hover:underline">
        <Plus size={12} /> Add item
      </button>
    </div>
  );
}

export function FileDrop({ bucket, value, onChange, accept = "image/*", label = "Upload file" }: {
  bucket: string; value: string | null; onChange: (url: string) => void; accept?: string; label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(bucket, file);
      onChange(url);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files[0]); }}
        className="border-2 border-dashed border-border hover:border-cyan rounded-lg p-6 text-center cursor-pointer transition-colors bg-background/40"
      >
        {busy ? (
          <Loader2 className="animate-spin mx-auto text-cyan" size={20} />
        ) : value ? (
          <div className="space-y-2">
            {accept.startsWith("image") && <img src={value} alt="" className="max-h-32 mx-auto rounded" />}
            <div className="text-xs text-muted-foreground truncate">{value.split("/").pop()}</div>
            <div className="text-[11px] text-cyan">Click to replace</div>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto text-muted-foreground mb-2" size={20} />
            <div className="text-xs text-muted-foreground">{label} — click or drop</div>
          </div>
        )}
      </div>
      <input
        ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handle(e.target.files?.[0])}
      />
    </div>
  );
}

export const formCardCls = "card-tech p-6 space-y-5";
export const btnPrimary = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-accent text-primary-foreground text-sm font-medium hover:scale-[1.02] transition-transform disabled:opacity-60";
export const btnSecondary = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm hover:border-cyan hover:text-cyan transition-colors";
export const btnDanger = "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-colors";