import { useNotification } from "../context/NotificationContext";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-black text-white px-5 py-4 rounded-xl shadow-lg flex items-center justify-between gap-4 min-w-75"
        >
          <span className="text-sm">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
