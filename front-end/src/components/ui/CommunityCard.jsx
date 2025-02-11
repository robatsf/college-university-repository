// components/ui/CommunityCard.jsx
export default function CommunityCard({ title, itemCount }) {
    return (
      <div className="p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] 
                      transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <h3 className="font-semibold text-lg mb-2 text-black">{title}</h3>
        <p className="text-sm text-gray-600">Items: {itemCount}</p>
      </div>
    );
  }
  