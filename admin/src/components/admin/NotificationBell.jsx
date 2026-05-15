import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, ShoppingCart, Clock, Package, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { connectSocket, joinAdminRoom, disconnectSocket } from '../../services/socket';

export default function NotificationBell() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useAuthStore();

  const {
    notifications,
    unreadCount,
    isOpen,
    loading,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllRead,
    toggleDropdown,
    closeDropdown,
  } = useNotificationStore();

  // Connect socket & listen for events
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    // Fetch existing notifications
    fetchNotifications();

    // Setup socket connection
    const socket = connectSocket();

    socket.on('connect', () => {
      joinAdminRoom();
    });

    // If already connected, join immediately
    if (socket.connected) {
      joinAdminRoom();
    }

    // Listen for new order notifications
    socket.on('newOrder', (data) => {
      addNotification(data.notification);

      // Play a subtle notification sound effect
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.value = 0.1;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Ignore audio errors
      }
    });

    return () => {
      socket.off('newOrder');
    };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Don't render for non-admin users
  if (!user || user.role !== 'admin') return null;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    closeDropdown();
    navigate('/admin/orders');
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_order': return <ShoppingCart className="w-4 h-4" />;
      case 'payment': return <Package className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="notif-bell-btn"
        id="notification-bell"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="notif-dropdown">
          {/* Header */}
          <div className="notif-dropdown-header">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-neon-purple" />
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="notif-count-pill">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="notif-action-btn"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={closeDropdown}
                className="notif-action-btn"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="notif-list">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`notif-item ${!n.isRead ? 'notif-item--unread' : ''}`}
                >
                  {/* Icon */}
                  <div className={`notif-item-icon ${!n.isRead ? 'notif-item-icon--unread' : ''}`}>
                    {getIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-gray-600">{getTimeAgo(n.createdAt)}</span>
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-neon-purple shrink-0 shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notif-dropdown-footer">
              <button
                onClick={() => { closeDropdown(); navigate('/admin/orders'); }}
                className="text-xs text-neon-cyan hover:text-white transition-colors font-medium"
              >
                View all orders →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline styles */}
      <style>{`
        .notif-bell-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .notif-bell-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.15);
        }
        .notif-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #7C3AED, #A855F7);
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
          animation: notif-pulse 2s ease-in-out infinite;
          line-height: 1;
        }
        @keyframes notif-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(124, 58, 237, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 18px rgba(124, 58, 237, 0.8); transform: scale(1.05); }
        }
        .notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 360px;
          max-height: 480px;
          background: rgba(12, 15, 28, 0.97);
          backdrop-filter: blur(24px) saturate(1.2);
          -webkit-backdrop-filter: blur(24px) saturate(1.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.08);
          z-index: 100;
          display: flex;
          flex-direction: column;
          animation: notif-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @keyframes notif-slide-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .notif-count-pill {
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #7C3AED, #A855F7);
          padding: 1px 7px;
          border-radius: 999px;
          line-height: 1.6;
        }
        .notif-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.4);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .notif-action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
        }
        .notif-list {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.05) transparent;
        }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .notif-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .notif-item--unread {
          background: rgba(124, 58, 237, 0.04);
        }
        .notif-item--unread:hover {
          background: rgba(124, 58, 237, 0.08);
        }
        .notif-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
          shrink: 0;
          flex-shrink: 0;
        }
        .notif-item-icon--unread {
          background: rgba(124, 58, 237, 0.12);
          color: #A855F7;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
        }
        .notif-dropdown-footer {
          padding: 10px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
