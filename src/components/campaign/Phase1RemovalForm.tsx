import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

interface Phase1RemovalData {
  dataInizio: string;
  dataFine: string;
  tecnicoNome: string;
  tecnicoCognome: string;
  tecnicoFirma: string;
  referenteNome: string;
  referenteCognome: string;
  referenteRuolo: string;
  referenteFirma: string;
}

interface DosimetroReading {
  id: number;
  codiceDispositivo1: string;
  piano: string;
  ubicazione: string;
  misurazione1: string;
}

interface Phase1RemovalFormProps {
  data: Phase1RemovalData;
  onChange: (field: keyof Phase1RemovalData, value: string) => void;
  onBack: () => void;
  onNext: (readings: DosimetroReading[]) => void;
  phase1Dosimetri: Array<{
    id: number;
    codiceDispositivo1: string;
    piano: string;
    ubicazione: string;
  }>;
}

export const Phase1RemovalForm = ({ data, onChange, onBack, onNext, phase1Dosimetri }: Phase1RemovalFormProps) => {
  const [readings, setReadings] = useState<DosimetroReading[]>(
    phase1Dosimetri.map(d => ({
      id: d.id,
      codiceDispositivo1: d.codiceDispositivo1,
      piano: d.piano,
      ubicazione: d.ubicazione,
      misurazione1: ''
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReadingChange = (id: number, value: string) => {
    setReadings(prev => 
      prev.map(reading => 
        reading.id === id ? { ...reading, misurazione1: value } : reading
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.dataInizio) {
      newErrors.dataInizio = 'Campo obbligatorio';
    }
    
    readings.forEach(reading => {
      if (!reading.misurazione1) {
        newErrors[`reading_${reading.id}`] = 'Campo obbligatorio';
      } else if (isNaN(Number(reading.misurazione1)) || Number(reading.misurazione1) < 0) {
        newErrors[`reading_${reading.id}`] = 'Valore non valido';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const today = new Date().toISOString().split('T')[0];
    onChange('dataFine', today);
    
    onNext(readings);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            Rimozione Fase 1
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInizio">Data Inizio *</Label>
                <Input
                  id="dataInizio"
                  type="date"
                  value={data.dataInizio}
                  onChange={(e) => onChange('dataInizio', e.target.value)}
                  className={errors.dataInizio ? 'border-destructive' : ''}
                />
                {errors.dataInizio && (
                  <p className="text-sm text-destructive">{errors.dataInizio}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFine">Data Fine</Label>
                <Input
                  id="dataFine"
                  type="date"
                  value={data.dataFine}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Si compila automaticamente</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Tecnico Proj.Eco</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tecnicoNome">Nome</Label>
                  <Input
                    id="tecnicoNome"
                    value={data.tecnicoNome}
                    onChange={(e) => onChange('tecnicoNome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tecnicoCognome">Cognome</Label>
                  <Input
                    id="tecnicoCognome"
                    value={data.tecnicoCognome}
                    onChange={(e) => onChange('tecnicoCognome', e.target.value)}
                    placeholder="Cognome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tecnicoFirma">Firma</Label>
                  <Input
                    id="tecnicoFirma"
                    value={data.tecnicoFirma}
                    onChange={(e) => onChange('tecnicoFirma', e.target.value)}
                    placeholder="Firma"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Referente Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referenteNome">Nome</Label>
                  <Input
                    id="referenteNome"
                    value={data.referenteNome}
                    onChange={(e) => onChange('referenteNome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteCognome">Cognome</Label>
                  <Input
                    id="referenteCognome"
                    value={data.referenteCognome}
                    onChange={(e) => onChange('referenteCognome', e.target.value)}
                    placeholder="Cognome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteRuolo">Ruolo</Label>
                  <Input
                    id="referenteRuolo"
                    value={data.referenteRuolo}
                    onChange={(e) => onChange('referenteRuolo', e.target.value)}
                    placeholder="Ruolo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteFirma">Firma</Label>
                  <Input
                    id="referenteFirma"
                    value={data.referenteFirma}
                    onChange={(e) => onChange('referenteFirma', e.target.value)}
                    placeholder="Firma"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            Misurazioni Fase 1
          </h2>

          <div className="space-y-4">
            {readings.map((reading) => (
              <Card key={reading.id} className="p-4 border-2">
                <div className="mb-4">
                  <h3 className="font-medium text-foreground">
                    R{reading.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reading.codiceDispositivo1} - {reading.piano} - {reading.ubicazione}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Misurazione Radon (Bq/m³) *</Label>
                  <Input
                    type="number"
                    value={reading.misurazione1}
                    onChange={(e) => handleReadingChange(reading.id, e.target.value)}
                    placeholder="Inserisci valore in Bq/m³"
                    className={errors[`reading_${reading.id}`] ? 'border-destructive' : ''}
                  />
                  {errors[`reading_${reading.id}`] && (
                    <p className="text-sm text-destructive">{errors[`reading_${reading.id}`]}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <Card className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Indietro
            </Button>
            <Button 
              type="submit"
              className="flex-1 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Completa Rimozione Fase 1
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};