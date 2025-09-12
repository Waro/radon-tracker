import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

interface CampaignData {
  commessa: string;
  cliente: string;
  insegna: string;
  citta: string;
  provincia: string;
  indirizzo: string;
  telefono: string;
  mail: string;
  altro: string;
}

interface CampaignDataFormProps {
  data: CampaignData;
  onChange: (field: keyof CampaignData, value: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const CampaignDataForm = ({ data, onChange, onNext, onCancel }: CampaignDataFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!data.commessa || !data.cliente || !data.citta) {
      return;
    }
    
    onNext();
  };

  const isValid = data.commessa && data.cliente && data.citta;

  return (
    <Card className="max-w-4xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
          Dati Campagna
        </h2>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commessa">Commessa *</Label>
            <Input
              id="commessa"
              value={data.commessa}
              onChange={(e) => onChange('commessa', e.target.value)}
              placeholder="Numero commessa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Input
              id="cliente"
              value={data.cliente}
              onChange={(e) => onChange('cliente', e.target.value)}
              placeholder="Nome cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insegna">Insegna</Label>
            <Input
              id="insegna"
              value={data.insegna}
              onChange={(e) => onChange('insegna', e.target.value)}
              placeholder="Insegna"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citta">Città *</Label>
            <Input
              id="citta"
              value={data.citta}
              onChange={(e) => onChange('citta', e.target.value)}
              placeholder="Città"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia</Label>
            <Input
              id="provincia"
              value={data.provincia}
              onChange={(e) => onChange('provincia', e.target.value)}
              placeholder="Provincia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              value={data.telefono}
              onChange={(e) => onChange('telefono', e.target.value)}
              placeholder="Numero di telefono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="indirizzo">Indirizzo</Label>
          <Input
            id="indirizzo"
            value={data.indirizzo}
            onChange={(e) => onChange('indirizzo', e.target.value)}
            placeholder="Indirizzo completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mail">Email</Label>
          <Input
            id="mail"
            type="email"
            value={data.mail}
            onChange={(e) => onChange('mail', e.target.value)}
            placeholder="Email di contatto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="altro">Altro</Label>
          <Textarea
            id="altro"
            value={data.altro}
            onChange={(e) => onChange('altro', e.target.value)}
            placeholder="Note aggiuntive..."
            rows={3}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Annulla
          </Button>
          <Button 
            type="submit"
            disabled={!isValid}
            className="flex-1 flex items-center gap-2"
          >
            Continua
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};