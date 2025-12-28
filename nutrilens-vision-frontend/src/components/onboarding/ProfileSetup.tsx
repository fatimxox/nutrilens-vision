import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Upload } from 'lucide-react';
import { UserAccount } from '@/contexts/UserContext';

interface ProfileSetupProps {
  account: UserAccount;
  onAccountChange: (account: UserAccount) => void;
}

export function ProfileSetup({ account, onAccountChange }: ProfileSetupProps) {
  const [previewUrl, setPreviewUrl] = useState(account.avatarUrl);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewUrl(url);
        onAccountChange({ ...account, avatarUrl: url });
      };
      reader.readAsDataURL(file);
    }
  };

  // Simple color options for avatar background
  const colorOptions = [
    { bg: 'bg-primary', label: 'Green' },
    { bg: 'bg-blue-500', label: 'Blue' },
    { bg: 'bg-purple-500', label: 'Purple' },
    { bg: 'bg-orange-500', label: 'Orange' },
    { bg: 'bg-pink-500', label: 'Pink' },
    { bg: 'bg-slate-600', label: 'Slate' },
  ];

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].bg);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create Your Profile</h2>
        <p className="mt-2 text-muted-foreground">
          Tell us about yourself to personalize your experience
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center">
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative cursor-pointer group"
        >
          <div className={`relative h-28 w-28 rounded-full overflow-hidden border-4 border-card shadow-xl ${!previewUrl ? selectedColor : 'bg-muted'}`}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-14 w-14 text-white" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Upload className="h-4 w-4" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </motion.label>
      </div>

      {/* Avatar Color Options */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">Or choose an avatar color</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {colorOptions.map((color, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedColor(color.bg);
                setPreviewUrl('');
                onAccountChange({ ...account, avatarUrl: '' });
              }}
              className={`h-12 w-12 rounded-full ${color.bg} flex items-center justify-center border-2 transition-all ${
                selectedColor === color.bg && !previewUrl
                  ? 'border-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
                  : 'border-transparent hover:border-border'
              }`}
            >
              <User className="h-6 w-6 text-white" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={account.firstName}
                onChange={(e) => onAccountChange({ ...account, firstName: e.target.value })}
                placeholder="John"
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={account.lastName}
                onChange={(e) => onAccountChange({ ...account, lastName: e.target.value })}
                placeholder="Doe"
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={account.email}
              onChange={(e) => onAccountChange({ ...account, email: e.target.value })}
              placeholder="john.doe@example.com"
              className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}