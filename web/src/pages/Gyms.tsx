import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockGyms } from "@/data/mockData";
import { MapPin, Search, Star, Users } from "lucide-react";

export const Gyms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredGyms = mockGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground p-6">
        <h1 className="text-2xl font-bold mb-2">Academias Parceiras</h1>
        <p className="text-secondary-foreground/80">
          Encontre a academia mais próxima de você
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar academias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Gyms List */}
        <div className="space-y-3">
          {filteredGyms.map((gym) => (
            <Card key={gym.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{gym.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{gym.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">{gym.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{gym.members} membros</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {gym.distance} km
                    </div>
                    <div className="text-xs text-muted-foreground">
                      distância
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGyms.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma academia encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente buscar por outro nome
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gyms