import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, AlertTriangle } from "lucide-react";

export interface RadonCampaign {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'planned' | 'unplanned' | 'awaiting_results';
  averageLevel?: number; // Bq/m³
  riskLevel: 'low' | 'medium' | 'high';
}

interface RadonCampaignCardProps {
  campaign: RadonCampaign;
  onClick?: () => void;
}

const statusColors = {
  planned: 'bg-blue-500 text-white',
  unplanned: 'bg-purple-500 text-white',
  active: 'bg-green-500 text-white',
  awaiting_results: 'bg-orange-500 text-white',
  completed: 'bg-red-500 text-white'
};

const riskColors = {
  low: 'text-success',
  medium: 'text-warning', 
  high: 'text-destructive'
};

const statusLabels = {
  planned: 'Pianificata',
  unplanned: 'Non pianificata',
  active: 'In corso',
  awaiting_results: 'Attesa esiti',
  completed: 'Terminata'
};

export const RadonCampaignCard = ({ campaign, onClick }: RadonCampaignCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/50 hover:border-primary/20 bg-card"
      onClick={onClick}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-card-foreground">{campaign.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{campaign.location}</span>
            </div>
          </div>
          <Badge className={statusColors[campaign.status]}>
            {statusLabels[campaign.status]}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Inizio</p>
              <p className="font-medium text-card-foreground">
                {new Date(campaign.startDate).toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-warning" />
            <div className="text-sm">
              <p className="text-muted-foreground">Ritiro</p>
              <p className="font-medium text-warning">
                {(() => {
                  const start = new Date(campaign.startDate);
                  const pickup = new Date(start);
                  pickup.setMonth(pickup.getMonth() + 6);
                  return pickup.toLocaleDateString('it-IT');
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Radon Level */}
        {campaign.averageLevel && (
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${riskColors[campaign.riskLevel]}`} />
                <span className="text-sm text-muted-foreground">Livello medio</span>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${riskColors[campaign.riskLevel]}`}>
                  {campaign.averageLevel} Bq/m³
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  Rischio {campaign.riskLevel === 'low' ? 'basso' : campaign.riskLevel === 'medium' ? 'medio' : 'alto'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};