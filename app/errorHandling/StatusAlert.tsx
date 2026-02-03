import { useState, useEffect } from "react";
import clsx from "clsx";

type Props = {
  statusCode: number;
};

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<Boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

function StatusAlert({ statusCode }: Props) {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div className="text-center flex flex-col p-4 text-red-500 text-sm">
        <p className="font-ubuntu">You're Currently Offline</p>
      </div>
    );
  }

  if (!statusCode) return null;

  const statusConfig: Record<number | string, { color: string; msg: string }> =
    {
      401: {
        color: "text-orange-500",
        msg: "Invalid API Key. Please check your Gemini credentials.",
      },
      404: {
        color: "text-blue-500",
        msg: "Venue data not found. Try uploading the image again.",
      },
      429: {
        color: "text-purple-500",
        msg: "Rate limit reached. EchoVision is taking a breather—try again in a minute.",
      },
      500: {
        color: "text-red-500",
        msg: "Server error. Our acoustic engine is down for maintenance.",
      },
      default: { color: "gray", msg: "An unexpected error occurred." },
    };

  const { color, msg } = statusConfig[statusCode] || statusConfig["default"];

  return (
    <div className={clsx("text-center flex flex-col p-4", color)}>
      <p className="italic font-poppins">{msg}</p>
    </div>
  );
}

export default StatusAlert;
