import { useState, useEffect } from "react";
import { Search, Edit2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DosimetersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

interface StockHistory {
  id: string;
  user: string;
  oldValue: number;
  newValue: number;
  timestamp: string;
}

export const DosimetersDialog = ({ open, onOpenChange, campaigns }: DosimetersDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockValue, setStockValue] = useState(250); // Valore iniziale esempio
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [tempStockValue, setTempStockValue] = useState(stockValue);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([
    {
      id: '1',
      user: 'Admin',
      oldValue: 200,
      newValue: 250,
      timestamp: '2024-01-15 10:30:00'
    },
    {
      id: '2', 
      user: 'Marco Rossi',
      oldValue: 180,
      newValue: 200,
      timestamp: '2024-01-10 14:15:00'
    }
  ]);

  // Calcolo dosimetri attivi (esempio: 12 per campagna attiva)
  const activeDosimeters = campaigns.filter(c => c.status === 'active').length * 12;
  const availableDosimeters = stockValue - activeDosimeters;

  // Mock data per dosimetri per campagna
  const campaignDosimeters = campaigns.map(campaign => ({
    ...campaign,
    dosimeters: campaign.status === 'active' ? 12 : campaign.status === 'completed' ? 12 : 0
  }));

  const filteredCampaigns = campaignDosimeters.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockUpdate = () => {
    const oldValue = stockValue;
    setStockValue(tempStockValue);
    
    // Aggiungi alla cronologia
    const newHistoryEntry: StockHistory = {
      id: Date.now().toString(),
      user: user?.name || 'Utente',
      oldValue: oldValue,
      newValue: tempStockValue,
      timestamp: new Date().toLocaleString('it-IT')
    };
    
    setStockHistory(prev => [newHistoryEntry, ...prev]);
    setIsEditingStock(false);
    
    toast({
      title: "Aggiornamento completato",
      description: `Dosimetri in magazzino aggiornati: ${tempStockValue}`
    });
  };

  const cancelStockEdit = () => {
    setTempStockValue(stockValue);
    setIsEditingStock(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setIsEditingStock(false);
      setTempStockValue(stockValue);
    }
  }, [open, stockValue]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">In Corso</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completata</Badge>;
      case 'planned':
        return <Badge variant="outline">Pianificata</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gestione Dosimetri</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Riepilogo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri in Magazzino</p>
              <div className="flex items-center gap-2 mt-1">
                {isEditingStock ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempStockValue}
                      onChange={(e) => setTempStockValue(parseInt(e.target.value) || 0)}
                      className="w-20 h-8"
                    />
                    <Button size="sm" onClick={handleStockUpdate} className="h-8 w-8 p-0">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelStockEdit} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-card-foreground">{stockValue}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setIsEditingStock(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri Attivi</p>
              <p className="text-2xl font-bold text-accent">{activeDosimeters}</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri Disponibili</p>
              <p className={`text-2xl font-bold ${availableDosimeters >= 0 ? 'text-success' : 'text-destructive'}`}>
                {availableDosimeters}
              </p>
            </Card>
          </div>

          {/* Ricerca Campagne */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabella Campagne */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Campagna</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-center">Dosimetri Posizionati</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-center">{campaign.dosimeters}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Storico Modifiche */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Storico Modifiche Magazzino</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Ora</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead className="text-center">Valore Precedente</TableHead>
                    <TableHead className="text-center">Nuovo Valore</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.timestamp}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell className="text-center">{entry.oldValue}</TableCell>
                      <TableCell className="text-center font-medium">{entry.newValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};