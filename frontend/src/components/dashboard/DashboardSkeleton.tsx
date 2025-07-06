
export default function DashboardSkeleton(){
    return (
      <div className="flex w-full h-screen">
        <div className="w-1/5 bg-gray-100 p-4 flex flex-col animate-pulse">
          <div className="h-6 bg-purple-200 rounded mb-4 w-3/4"></div>
          <div className="flex flex-col items-center mb-5 space-y-2">
            <div className="w-16 h-16 bg-purple-200 rounded-full"></div>
            <div className="h-4 w-20 bg-purple-100 rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="h-10 bg-purple-100 rounded-md"></div>
            ))}
          </div>
        </div>

        <div className="w-4/5 p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-100 rounded-md"></div>
          <div className="h-40 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    );
}