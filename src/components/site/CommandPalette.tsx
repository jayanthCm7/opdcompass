import { useNavigate } from "@tanstack/react-router";
import { Calculator, FileSignature, Siren, Stethoscope } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { CASES } from "@/data/cases";
import { TOOLS } from "@/data/tools";
import { EMERGENCIES } from "@/data/emergencies";

export function CommandPalette({
  open,
  onOpenChange,
  onLetterhead,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLetterhead: () => void;
}) {
  const navigate = useNavigate();
  const go = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a complaint, diagnosis, tool or emergency…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No match. Try “fever”, “BMI” or “stroke”.</CommandEmpty>
        <CommandGroup heading="Emergency red flags">
          {EMERGENCIES.map((e) => (
            <CommandItem
              key={e.name}
              value={`${e.name} ${e.keywords.join(" ")}`}
              onSelect={() => go(() => navigate({ to: "/red-flags", hash: slug(e.name) }))}
            >
              <Siren className="text-destructive" />
              <span className="font-medium">{e.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Clinical tools">
          {TOOLS.map((t) => (
            <CommandItem
              key={t.id}
              value={`${t.name} ${t.desc}`}
              onSelect={() => go(() => navigate({ to: "/tools", hash: t.id }))}
            >
              <Calculator className="text-primary-glow" />
              <span>{t.name}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">{t.desc}</span>
            </CommandItem>
          ))}
          <CommandItem value="letterhead prescription doctor name" onSelect={() => go(onLetterhead)}>
            <FileSignature className="text-primary" />
            Set up prescription letterhead
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={`Cases · ${CASES.length}`}>
          {CASES.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.t} ${c.dx} ${c.kw.join(" ")} ${c.co.join(" ")}`}
              onSelect={() => go(() => navigate({ to: "/case/$id", params: { id: c.id } }))}
            >
              <Stethoscope className={c.sp === "Medicine" ? "text-medicine" : "text-obgyn"} />
              <div className="min-w-0">
                <div className="truncate font-medium">{c.t}</div>
                <div className="truncate text-xs text-muted-foreground">{c.dx}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
