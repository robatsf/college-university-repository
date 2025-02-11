// // components/cards/CommunityCard.jsx
// import { Link } from 'react-router-dom';
// import { ChevronRight, BookOpen } from 'lucide-react';

// export default function CommunityCard({ title, itemCount, href = '#' }) {
//   return (
//     <Link to={href}>
//       <div className="p-6 border-2 border-[#E5E7EB] rounded-lg 
//                     hover:border-[#0066CC]/20 hover:bg-[#F8FAFC] 
//                     transition-all duration-300 hover:scale-[1.02] 
//                     cursor-pointer group shadow-sm hover:shadow-md">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#0066CC]/10 rounded-lg 
//                           group-hover:bg-[#0066CC]/20 transition-colors">
//               <BookOpen className="h-6 w-6 text-[#0066CC]" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg text-gray-900 
//                            group-hover:text-[#0066CC] transition-colors">
//                 {title}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {itemCount.toLocaleString()} {itemCount === 1 ? 'Item' : 'Items'}
//               </p>
//             </div>
//           </div>
//           <ChevronRight className="h-5 w-5 text-gray-400 
//                                 group-hover:text-[#0066CC] 
//                                 group-hover:transform group-hover:translate-x-1 
//                                 transition-all" />
//         </div>

//         {/* Optional: Add metadata or description */}
//         <div className="mt-4 flex flex-wrap gap-2">
//           {/* Example tags or metadata */}
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
//                          text-xs font-medium bg-[#0066CC]/10 text-[#0066CC]">
//             Active
//           </span>
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
//                          text-xs font-medium bg-gray-100 text-gray-800">
//             Updated Today
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // Example usage with TypeScript props (optional)
// /*
// interface CommunityCardProps {
//   title: string;
//   itemCount: number;
//   href?: string;
// }
// */