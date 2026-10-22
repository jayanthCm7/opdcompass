import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileSignature } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLetterhead } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LetterheadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { doc, setDoc, clear } = useLetterhead();
  const [form, setForm] = useState(doc);
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(doc);
      setError(false);
    }
  }, [open, doc]);

  const save = () => {
    const name = form.name.trim();
    if (!name) {
      setError(true);
      setShakeKey((k) => k + 1);
      return;
    }
    setDoc({ name, qual: form.qual.trim(), clinic: form.clinic.trim() });
    onOpenChange(false);
    toast.success("Letterhead saved");
  };

  const field =
    "mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-secondary focus:ring-4 focus:ring-primary/10";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-lg rounded-3xl border-border p-0 sm:rounded-3xl">
        <div className="relative overflow-hidden rounded-t-3xl border-b border-border p-6">
          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <DialogHeader className="relative">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
              <FileSignature className="h-5 w-5" />
            </div>
            <DialogTitle className="font-display text-2xl">Prescription letterhead</DialogTitle>
            <DialogDescription>
              Shown at the top of every draft prescription. Stored only in this browser.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form
          className="space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="block text-xs font-medium text-muted-foreground">
            Doctor name <span className="text-destructive">*</span>
            <input
              key={shakeKey}
              autoFocus
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setError(false);
              }}
              placeholder="Dr. A. Kumar"
              className={cn(field, error && "animate-shake border-destructive/70")}
            />
            {error && <span className="mt-1 block text-destructive">Enter a name to activate the letterhead.</span>}
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Qualification and registration no.
            <input
              value={form.qual}
              onChange={(e) => setForm({ ...form, qual: e.target.value })}
              placeholder="MBBS, MD · Reg. KMC 12345"
              className={field}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Clinic / contact
            <input
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
              placeholder="City Clinic, MG Road · +91 98xxx xxxxx"
              className={field}
            />
          </label>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => {
                clear();
                setForm({ name: "", qual: "", clinic: "" });
                toast("Letterhead cleared");
              }}
            >
              Clear
            </Button>
            <Button type="submit" variant="hero" className="h-11 flex-1 rounded-xl">
              Save letterhead →
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
