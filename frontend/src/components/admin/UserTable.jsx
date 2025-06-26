import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUserRole } from "../../services/adminService";
import ConfirmModal from "../common/ConfirmModal";

const UserTable = ({ users }) => {
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: deleteHandler } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const { mutate: roleHandler } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      roleHandler({ userId: user._id, role: e.target.value })
                    }
                    className="border text-sm px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-red-600 hover:underline text-sm flex items-center gap-1"
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowConfirm(true);
                    }}
                    disabled={user.role === "admin"}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => deleteHandler(selectedUserId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
};

export default UserTable;
