import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

export const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const { toast } = useToast();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setIsOpen(false);
      setManualCode('');
      toast({
        title: "Codice inserito",
        description: `Codice: ${manualCode.trim()}`
      });
    }
  };

  const handleOpenScanner = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpenScanner}
        className="flex items-center gap-2"
      >
        <QrCode className="h-4 w-4" />
        Scansiona
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Scanner Codice a Barre
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-code">Inserisci il codice del dispositivo</Label>
              <Input
                id="manual-code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Codice dispositivo"
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                Su dispositivi mobili, lo scanner fotografico sarà disponibile con l'app nativa.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={!manualCode.trim()}>
                Conferma
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};