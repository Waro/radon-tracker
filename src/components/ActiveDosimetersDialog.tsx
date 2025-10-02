import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface ActiveDosimetersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
  }>;
}

export const ActiveDosimetersDialog = ({ open, onOpenChange, campaigns }: ActiveDosimetersDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calcola dosimetri in magazzino (fisso per ora)
  const stockValue = parseInt(localStorage.getItem('dosimeters_stock') || '250');
  
  // Calcolo dosimetri attivi (esempio: 12 per campagna attiva)
  const activeDosimeters = campaigns.filter(c => c.status === 'active').length * 12;

  // Mock data per campagne in corso
  const activeCampaigns = campaigns
    .filter(c => c.status === 'active')
    .map(campaign => {
      const startDate = new Date(campaign.startDate);
      const expectedPickup = new Date(startDate);
      expectedPickup.setMonth(expectedPickup.getMonth() + 6);
      
      return {
        commessa: campaign.id,
        cliente: 'Cliente ' + campaign.name.split(' ')[0],
        ritiroPrevisto: expectedPickup.toLocaleDateString('it-IT'),
        dosimetriPosizionati: 12
      };
    });

  const filteredCampaigns = activeCampaigns.filter(campaign =>
    campaign.commessa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gestione Dosimetri Attivi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Riepilogo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri in Magazzino</p>
              <p className="text-2xl font-bold text-card-foreground">{stockValue}</p>
            </Card>
            
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Dosimetri Attualmente Posizionati</p>
              <p className="text-2xl font-bold text-accent">{activeDosimeters}</p>
            </Card>
          </div>

          {/* Ricerca Campagne */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca campagne in corso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabella Campagne in Corso */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commessa</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ritiro Previsto</TableHead>
                  <TableHead className="text-center">Dosimetri Posizionati</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.commessa}</TableCell>
                      <TableCell>{campaign.cliente}</TableCell>
                      <TableCell>{campaign.ritiroPrevisto}</TableCell>
                      <TableCell className="text-center">{campaign.dosimetriPosizionati}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nessuna campagna in corso
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};