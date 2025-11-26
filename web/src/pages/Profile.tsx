import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/gamification/Badge";
import { StatsCard } from "@/components/ui/stats-card";
import { mockCheckInHistory } from "@/data/mockData";
import {
  User,
  Trophy,
  Calendar,
  MapPin,
  Activity,
  History,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
export const Profile = () => {
  const { signOut, userData, updateUser } = useAuth();

  async function handleSignOut() {
    signOut();
  }

  // form state
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? "");
      setEmail(userData.email ?? "");
    }
  }, [userData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (email) payload.email = email;
      if (password) payload.password = password;
      if (avatarFile) payload.avatarFile = avatarFile;

      // Só envia se houver algo para atualizar
      if (Object.keys(payload).length === 0) {
        // toast informativo já é feito, ou pode ignorar
        return;
      }

      await updateUser(payload);
      setOpen(false);
      setPassword("");
    } catch (err) {
      // error handled in context
    }
  }
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-success text-success-foreground p-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-20 h-20 rounded-full border-4 border-success-foreground/20 bg-muted flex items-center justify-center">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <svg className="w-10 h-10 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button className="flex flex-1" onClick={() => setOpen(true)}>
                  Editar
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button className="flex flex-1 bg-red-600" onClick={() => handleSignOut()}>
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog fora do Dropdown, controlado por state */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar perfil</DialogTitle>
                <DialogDescription>Atualize sua foto, nome, e-mail ou senha.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm">Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm">Nome</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
                </div>

                <div>
                  <label className="text-sm">E-mail</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                </div>

                <div>
                  <label className="text-sm">Senha (deixe vazio para não alterar)</label>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" type="password" />
                </div>

                <DialogFooter>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div>
            <h1 className="text-2xl font-bold">{userData?.name ?? "Usuário"}</h1>
            <p className="text-success-foreground/80">{userData?.email ?? "-"}</p>
            <div className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">
                {0} XP
              </span>
              <span className="text-success-foreground/60">•</span>
              <span>{0} dias seguidos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Dias Ativos"
            value={0}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Academias"
            value={0}
            icon={MapPin}
            variant="secondary"
          />
          <StatsCard
            title="Check-ins"
            value={0}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Conquistas"
            value={0}
            icon={Award}
          />
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Minhas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <Badge
                type="first_checkin"
                unlocked={false}
              />
              <Badge
                type="streak_7"
                unlocked={false}
              />
              <Badge
                type="streak_30"
                unlocked={false}
              />
              <Badge
                type="streak_100"
                unlocked={false}
              />
              <Badge
                type="gym_explorer"
                unlocked={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCheckInHistory.map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <div className="font-medium text-sm">{checkIn.gym}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(checkIn.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-success">
                    +{checkIn.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
