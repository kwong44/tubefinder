'use client';

import { X, Heart, MapPin, User, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCustomSpots } from '@/lib/hooks/useCustomSpots';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, signOut } = useAuthStore();
  const { favorites } = useFavorites();
  const { customSpots } = useCustomSpots();

  if (!isOpen || !user) return null;

  const userCustomSpots = customSpots.filter((spot) => spot.user_id === user.id);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-ocean-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Profile</h2>
              <p className="text-sm text-ocean-100">Your account details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span className="text-xs font-semibold text-red-700">Favorites</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{favorites.length}</p>
                <p className="text-xs text-red-600 mt-1">
                  {favorites.length === 1 ? 'spot saved' : 'spots saved'}
                </p>
              </div>

              <div className="p-4 bg-ocean-50 rounded-lg border border-ocean-100">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-ocean-600" />
                  <span className="text-xs font-semibold text-ocean-700">Custom Spots</span>
                </div>
                <p className="text-2xl font-bold text-ocean-600">{userCustomSpots.length}</p>
                <p className="text-xs text-ocean-600 mt-1">
                  {userCustomSpots.length === 1 ? 'spot created' : 'spots created'}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Spots List */}
          {userCustomSpots.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Custom Spots</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {userCustomSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{spot.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{spot.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      spot.is_public
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {spot.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
