import { Lock, Heart } from 'lucide-react';

const DayCard = ({ date, title, description, isUnlocked, onClick }) => {
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return (
        <div
            onClick={isUnlocked ? onClick : null}
            className={`relative p-6 rounded-2xl transition-all duration-300 transform 
        ${isUnlocked
                    ? 'bg-white cursor-pointer hover:scale-105 hover:shadow-xl border-2 border-pink-200'
                    : 'bg-gray-100 opacity-80 cursor-not-allowed border-2 border-gray-200'
                }
      `}
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{formattedDate}</span>
                {isUnlocked ? (
                    <Heart className="text-pink-500 fill-current animate-pulse" size={24} />
                ) : (
                    <Lock className="text-gray-400" size={24} />
                )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-pink-700' : 'text-gray-500'}`}>
                {isUnlocked ? title : "Locked"}
            </h3>

            <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {isUnlocked ? description : "Wait for this day to arrive..."}
            </p>

            {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-2xl backdrop-blur-[1px]">
                    <Lock className="text-gray-400 opacity-50" size={48} />
                </div>
            )}
        </div>
    );
};

export default DayCard;
