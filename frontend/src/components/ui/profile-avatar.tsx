import { User, Upload } from "lucide-react";

export default function ProfileAvatar() {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="relative w-12 h-12">
        <div className="w-full h-full rounded-full bg-[#f2e3ff] flex items-center justify-center text-[#7b44f2]">
          <User className="w-8 h-8" />
        </div>

        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#7b44f2] rounded-full flex items-center justify-center border-2 border-white">
          <Upload className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}