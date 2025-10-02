import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface StockEntry {
  id: string;
  quantity: number;
  orderRef: string;
  user: string;
  timestamp: string;
}

interface AvailableDosimetersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
  }>;
}

export const AvailableDosimetersDialog = ({ open, onOpenChange, campaigns }: AvailableDosimetersDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddStock, setShowAddStock] = useState(false);
  const [newQuantity, setNewQuantity] = useState('');
  const [orderRef, setOrderRef] = useState('');
  
  const [stockValue, setStockValue] = useState(() => {
    const saved = localStorage.getItem('dosimeters_stock');
    return saved ? parseInt(saved) : 250;
  });

  const [stockRegistry, setStockRegistry] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem('dosimeters_registry');
    return saved ? JSON.parse(saved) : [];
  });

  // Calcolo dosimetri attivi (fase 1 + fase 2)
  const activeDosimeters = campaigns.filter(c => c.status === 'active').length * 12;
  
  // Calcolo previsione fabbisogno
  const phase1Campaigns = campaigns.filter(c => {
    if (c.status === 'active') {
      const startDate = new Date(c.startDate);
      const sixMonthsLater = new Date(startDate);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      return new Date() < sixMonthsLater;
    }
    return false;
  });
  const forecastNeeds = phase1Campaigns.length * 12; // Dosimetri per fase 2

  const handleAddStock = () => {
    if (!newQuantity || !orderRef) {
      toast({
        title: "Errore",
        description: "Inserisci tutti i campi richiesti",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(newQuantity);
    const newStockValue = stockValue + quantity;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      quantity: quantity,
      orderRef: orderRef,
      user: user?.name || 'Utente',
      timestamp: new Date().toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedRegistry = [newEntry, ...stockRegistry];
    setStockRegistry(updatedRegistry);
    setStockValue(newStockValue);
    
    localStorage.setItem('dosimeters_stock', newStockValue.toString());
    localStorage.setItem('dosimeters_registry', JSON.stringify(updatedRegistry));

    setNewQuantity('');
    setOrderRef('');
    setShowAddStock(false);

    toast({
      title: "Magazzino aggiornato",
      description: `Aggiunti ${quantity} dosimetri. Totale: ${newStockValue}`
    });
  };

  useEffect(() => {
    if (!open) {
      setShowAddStock(false);
      setNewQuantity('');
      setOrderRef('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Dosimetri Disponibili</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Riepilogo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => setShowAddStock(true)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Dosimetri in Magazzino</p>
              </div>
              <p className="text-2xl font-bold text-card-foreground">{stockValue}</p>
              <p className="text-xs text-primary mt-1">Clicca per aggiungere</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri Attivi</p>
              <p className="text-2xl font-bold text-accent">{activeDosimeters}</p>
              <p className="text-xs text-muted-foreground mt-1">Fase 1 e Fase 2</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Previsione Fabbisogno</p>
              <p className="text-2xl font-bold text-warning">{forecastNeeds}</p>
              <p className="text-xs text-muted-foreground mt-1">Fase 2 previste</p>
            </Card>
          </div>

          {/* Form Aggiunta Magazzino */}
          {showAddStock && (
            <Card className="p-4 bg-accent/5 border-primary">
              <h3 className="font-semibold mb-4">Aggiungi Dosimetri al Magazzino</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantità Dosimetri *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Es. 100"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderRef">Estremi Ordine *</Label>
                  <Input
                    id="orderRef"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="Es. ORD-2024-001"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddStock} className="flex-1">
                  Conferma
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddStock(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
              </div>
            </Card>
          )}

          {/* Registro Magazzino */}
          {stockRegistry.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Registro Magazzino</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Ora</TableHead>
                      <TableHead>Utente</TableHead>
                      <TableHead>Estremi Ordine</TableHead>
                      <TableHead className="text-right">Quantità</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockRegistry.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.timestamp}</TableCell>
                        <TableCell>{entry.user}</TableCell>
                        <TableCell>{entry.orderRef}</TableCell>
                        <TableCell className="text-right font-medium">+{entry.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};