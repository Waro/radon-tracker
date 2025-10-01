import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";

interface Dosimetro {
  id: string;
  address: string;
  room: string;
  level?: number;
}

interface CampaignCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dosimeters: Dosimetro[];
  onComplete: (data: { [key: string]: number }) => void;
}

export const CampaignCompletionDialog = ({
  open,
  onOpenChange,
  dosimeters,
  onComplete
}: CampaignCompletionDialogProps) => {
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dosimeterLevels, setDosimeterLevels] = useState<{ [key: string]: string }>({});

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast({
        title: "PDF caricato",
        description: "Il file PDF è stato caricato con successo"
      });
    } else {
      toast({
        title: "Errore",
        description: "Si prega di caricare un file PDF valido",
        variant: "destructive"
      });
    }
  };

  const handleLevelChange = (dosimeterId: string, value: string) => {
    setDosimeterLevels(prev => ({
      ...prev,
      [dosimeterId]: value
    }));
  };

  const handleSubmit = () => {
    if (!pdfFile) {
      toast({
        title: "PDF mancante",
        description: "Si prega di caricare il PDF con gli esiti di laboratorio",
        variant: "destructive"
      });
      return;
    }

    // Verifica che tutti i dosimetri abbiano un livello inserito
    const missingLevels = dosimeters.filter(d => !dosimeterLevels[d.id] || dosimeterLevels[d.id] === '');
    if (missingLevels.length > 0) {
      toast({
        title: "Dati incompleti",
        description: "Si prega di inserire i livelli per tutti i dosimetri",
        variant: "destructive"
      });
      return;
    }

    // Converti i livelli da stringa a numero
    const levels: { [key: string]: number } = {};
    for (const [id, value] of Object.entries(dosimeterLevels)) {
      levels[id] = parseFloat(value);
    }

    onComplete(levels);
    
    toast({
      title: "Campagna conclusa",
      description: "La campagna è stata conclusa con successo"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Conclusione Campagna - Caricamento Esiti
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload PDF */}
          <div className="space-y-2">
            <Label htmlFor="pdf-upload" className="text-base font-semibold">
              Carica PDF Esiti Laboratorio
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="cursor-pointer"
              />
              {pdfFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  {pdfFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Inserimento Livelli Dosimetri */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Inserisci Livelli Rilevati (Bq/m³)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dosimeters.map((dosimeter, index) => (
                <div key={dosimeter.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-semibold">R{index + 1}</span>
                    <span className="text-xs text-muted-foreground">{dosimeter.id}</span>
                  </div>
                  <div className="space-y-2 text-sm mb-3">
                    <p><span className="text-muted-foreground">Stanza:</span> {dosimeter.room}</p>
                    <p><span className="text-muted-foreground">Indirizzo:</span> {dosimeter.address}</p>
                  </div>
                  <div>
                    <Label htmlFor={`level-${dosimeter.id}`} className="text-xs">
                      Livello Radon (Bq/m³)
                    </Label>
                    <Input
                      id={`level-${dosimeter.id}`}
                      type="number"
                      placeholder="Es: 120"
                      value={dosimeterLevels[dosimeter.id] || ''}
                      onChange={(e) => handleLevelChange(dosimeter.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>
              Concludi Campagna
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
