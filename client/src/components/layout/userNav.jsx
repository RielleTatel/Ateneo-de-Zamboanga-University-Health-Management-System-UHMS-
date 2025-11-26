import { Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserNav = () => { 
  // Get current user from AuthContext
  const { user } = useAuth();

  // Fallback to default user if not authenticated (shouldn't happen in protected routes)
  const currentUser = user ? {
    name: user.full_name || "User",
    email: user.email || "user@adzu.edu.ph",
    position: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User",
    status: "online" 
  } : {
    name: "Loading...",
    email: "...",
    position: "User",
    status: "online" 
  };

  // Get position badge color
  const getPositionColor = (position) => {
    switch (position.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'doctor':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'nurse':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };


    return (
        <div className="px-2 mb-4 max-w-96">
            <div className="bg-container rounded-[14px] p-2">
                <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>

                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm">
                    <Circle 
                        className={`w-full h-full rounded-full ${getStatusColor(currentUser.status)}`} 
                        fill="currentColor"
                    />
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                    {currentUser.name}
                    </p>

                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPositionColor(currentUser.position)}`}>
                    {currentUser.position}
                    </span>
                </div>
                </div>
            </div>
        </div>
    )
}

export default UserNav