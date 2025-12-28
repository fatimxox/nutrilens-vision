import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Droplets,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  ChefHat,
  Droplet,
  Pill
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export type DashboardTab = 'overview' | 'meals' | 'water' | 'progress' | 'profile' | 'settings' | 'streaks' | 'recipes' | 'meal-planner' | 'blood-sugar' | 'medications';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: 'overview' as DashboardTab, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'meals' as DashboardTab, icon: Utensils, label: 'Meals' },
  { id: 'meal-planner' as DashboardTab, icon: ChefHat, label: 'AI Meal Planner' },
  { id: 'water' as DashboardTab, icon: Droplets, label: 'Hydration' },
  { id: 'streaks' as DashboardTab, icon: Flame, label: 'Streaks' },
  { id: 'blood-sugar' as DashboardTab, icon: Droplet, label: 'Blood Sugar' },
  { id: 'medications' as DashboardTab, icon: Pill, label: 'Medications' },
  { id: 'progress' as DashboardTab, icon: TrendingUp, label: 'Progress' },
  { id: 'profile' as DashboardTab, icon: User, label: 'Profile' },
  { id: 'settings' as DashboardTab, icon: Settings, label: 'Settings' },
];

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onLogout,
  collapsed,
  onToggleCollapse
}: DashboardSidebarProps) {
  const { account, dailyLog } = useUser();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              NV
            </div>
            <span className="text-lg font-semibold text-foreground">NutriVision</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
            NV
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Profile Preview */}
      <div className={`border-b border-border p-4 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="relative">
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {account.firstName || 'Guest'} {account.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {account.email || 'Complete your profile'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${isActive
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === 'water' && dailyLog.water.glasses < dailyLog.water.target && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-info/20 text-xs text-info">
                  {dailyLog.water.target - dailyLog.water.glasses}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-1">
        <button
          onClick={() => onTabChange('settings')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${collapsed ? 'justify-center' : ''
            }`}
        >
          <Bell className="h-5 w-5" />
          {!collapsed && <span>Notifications</span>}
        </button>
        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors ${collapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
