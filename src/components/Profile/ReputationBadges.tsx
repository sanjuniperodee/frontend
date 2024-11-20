import { useAuthStore } from '../../store/authStore';
import { Trophy, Award, Star, Shield, Target } from 'lucide-react';

const REPUTATION_TIERS = {
  NOVICE: { min: 0, max: 99, icon: Star, color: 'text-gray-500' },
  CONTRIBUTOR: { min: 100, max: 499, icon: Award, color: 'text-blue-500' },
  EXPERT: { min: 500, max: 999, icon: Shield, color: 'text-purple-500' },
  MASTER: { min: 1000, max: Infinity, icon: Trophy, color: 'text-yellow-500' },
};

export default function ReputationBadges() {
  const { user } = useAuthStore();

  if (!user) return null;

  const getCurrentTier = (reputation: number) => {
    return Object.entries(REPUTATION_TIERS).find(
      ([_, tier]) => reputation >= tier.min && reputation <= tier.max
    )?.[0];
  };

  const currentTier = getCurrentTier(user.reputation);
  const currentTierData = currentTier ? REPUTATION_TIERS[currentTier as keyof typeof REPUTATION_TIERS] : null;
  const TierIcon = currentTierData?.icon || Target;

  const getNextTier = (reputation: number) => {
    const tiers = Object.entries(REPUTATION_TIERS);
    const nextTier = tiers.find(([_, tier]) => reputation < tier.min);
    return nextTier ? {
      name: nextTier[0],
      ...nextTier[1],
      progress: ((reputation - currentTierData?.min!) / (nextTier[1].min - currentTierData?.min!)) * 100
    } : null;
  };

  const nextTier = getNextTier(user.reputation);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Репутация
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-gray-100 ${currentTierData?.color}`}>
              <TierIcon className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {currentTier} ({user.reputation} очков)
              </h4>
              {nextTier && (
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    До следующего уровня: {nextTier.min - user.reputation} очков
                  </div>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${nextTier.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}