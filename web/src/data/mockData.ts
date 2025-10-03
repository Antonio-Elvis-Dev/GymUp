export const mockUser = {
  id: "1",
  name: "João Silva",
  email: "joao@email.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  xp: 2450,
  streak: 12,
  totalCheckIns: 156,
  gymsVisited: 3,
  activeDays: 89,
  badges: ["streak_7", "streak_30", "first_checkin", "gym_explorer"]
};

export const mockGyms = [
  {
    id: "1",
    name: "FitLife Academia",
    distance: 0.8,
    address: "Rua das Flores, 123",
    members: 250,
    rating: 4.8
  },
  {
    id: "2", 
    name: "PowerGym",
    distance: 1.2,
    address: "Av. Principal, 456",
    members: 180,
    rating: 4.6
  },
  {
    id: "3",
    name: "BodyFit Studio", 
    distance: 2.3,
    address: "Rua do Esporte, 789",
    members: 120,
    rating: 4.9
  },
  {
    id: "4",
    name: "Iron Fitness",
    distance: 3.1, 
    address: "Av. Saúde, 321",
    members: 300,
    rating: 4.5
  },
  {
    id: "5",
    name: "FlexZone",
    distance: 5.7,
    address: "Rua Força, 654",
    members: 95,
    rating: 4.7
  }
];

export const mockLeaderboard = [
  { id: "1", name: "Ana Costa", xp: 3200, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d8ec?w=100&h=100&fit=crop&crop=face" },
  { id: "2", name: "Carlos Mendes", xp: 2800, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "3", name: "João Silva", xp: 2450, avatar: mockUser.avatar },
  { id: "4", name: "Maria Santos", xp: 2100, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "5", name: "Pedro Lima", xp: 1950, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: "6", name: "Sofia Alves", xp: 1800, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { id: "7", name: "Bruno Ferreira", xp: 1650, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "8", name: "Camila Rocha", xp: 1400, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" }
];

export const mockGymLeaderboard = [
  { id: "1", name: "FitLife Academia", totalXP: 45600, members: 250 },
  { id: "2", name: "PowerGym", totalXP: 38200, members: 180 },
  { id: "3", name: "Iron Fitness", totalXP: 35800, members: 300 },
  { id: "4", name: "BodyFit Studio", totalXP: 28900, members: 120 },
  { id: "5", name: "FlexZone", totalXP: 22100, members: 95 }
];

export const mockCheckInHistory = [
  { id: "1", gym: "FitLife Academia", date: "2024-09-10", xpEarned: 50 },
  { id: "2", gym: "FitLife Academia", date: "2024-09-09", xpEarned: 50 },
  { id: "3", gym: "PowerGym", date: "2024-09-08", xpEarned: 50 },
  { id: "4", gym: "FitLife Academia", date: "2024-09-07", xpEarned: 50 },
  { id: "5", gym: "FitLife Academia", date: "2024-09-06", xpEarned: 50 },
  { id: "6", gym: "BodyFit Studio", date: "2024-09-05", xpEarned: 50 },
  { id: "7", gym: "FitLife Academia", date: "2024-09-04", xpEarned: 50 },
  { id: "8", gym: "FitLife Academia", date: "2024-09-03", xpEarned: 50 },
  { id: "9", gym: "PowerGym", date: "2024-09-02", xpEarned: 50 },
  { id: "10", gym: "FitLife Academia", date: "2024-09-01", xpEarned: 50 }
];

export const mockPendingCheckIns = [
  {
    id: "1",
    user: "Ana Costa",
    gym: "FitLife Academia",
    timestamp: "2024-09-10 14:30",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d8ec?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "2", 
    user: "Carlos Mendes",
    gym: "PowerGym",
    timestamp: "2024-09-10 13:15",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "3",
    user: "Maria Santos", 
    gym: "BodyFit Studio",
    timestamp: "2024-09-10 12:45",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];