import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

interface Phase2RemovalData {
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
  codiceDispositivo2: string;
  piano: string;
  ubicazione: string;
  misurazione1: string;
  misurazione2: string;
}

interface Phase2RemovalFormProps {
  data: Phase2RemovalData;
  onChange: (field: keyof Phase2RemovalData, value: string) => void;
  onBack: () => void;
  onComplete: (readings: DosimetroReading[]) => void;
  phase2Dosimetri: Array<{
    id: number;
    codiceDispositivo2: string;
    piano: string;
    ubicazione: string;
  }>;
  phase1Readings: Array<{
    id: number;
    misurazione1: string;
  }>;
}

export const Phase2RemovalForm = ({ data, onChange, onBack, onComplete, phase2Dosimetri, phase1Readings }: Phase2RemovalFormProps) => {
  const [readings, setReadings] = useState<DosimetroReading[]>(
    phase2Dosimetri.map(d => {
      const phase1Reading = phase1Readings.find(r => r.id === d.id);
      return {
        id: d.id,
        codiceDispositivo2: d.codiceDispositivo2,
        piano: d.piano,
        ubicazione: d.ubicazione,
        misurazione1: phase1Reading?.misurazione1 || '0',
        misurazione2: ''
      };
    })
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReadingChange = (id: number, value: string) => {
    setReadings(prev => 
      prev.map(reading => 
        reading.id === id ? { ...reading, misurazione2: value } : reading
      )
    );
  };

  const calculateAverage = (val1: string, val2: string): number => {
    const num1 = Number(val1) || 0;
    const num2 = Number(val2) || 0;
    return Math.round((num1 + num2) / 2);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.dataInizio) {
      newErrors.dataInizio = 'Campo obbligatorio';
    }
    
    readings.forEach(reading => {
      if (!reading.misurazione2) {
        newErrors[`reading_${reading.id}`] = 'Campo obbligatorio';
      } else if (isNaN(Number(reading.misurazione2)) || Number(reading.misurazione2) < 0) {
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
    
    onComplete(readings);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            Rimozione Fase 2
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
            Misurazioni Fase 2 e Media Finale
          </h2>

          <div className="space-y-4">
            {readings.map((reading) => (
              <Card key={reading.id} className="p-4 border-2">
                <div className="mb-4">
                  <h3 className="font-medium text-foreground">
                    R{reading.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reading.codiceDispositivo2} - {reading.piano} - {reading.ubicazione}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Misurazione Fase 1 (Bq/m³)</Label>
                    <Input
                      type="number"
                      value={reading.misurazione1}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Misurazione Fase 2 (Bq/m³) *</Label>
                    <Input
                      type="number"
                      value={reading.misurazione2}
                      onChange={(e) => handleReadingChange(reading.id, e.target.value)}
                      placeholder="Inserisci valore"
                      className={errors[`reading_${reading.id}`] ? 'border-destructive' : ''}
                    />
                    {errors[`reading_${reading.id}`] && (
                      <p className="text-sm text-destructive">{errors[`reading_${reading.id}`]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Media (Bq/m³)</Label>
                    <div className="h-10 px-3 rounded-md border bg-primary/10 flex items-center font-semibold">
                      {calculateAverage(reading.misurazione1, reading.misurazione2)} Bq/m³
                    </div>
                  </div>
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
              Completa Campagna
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};