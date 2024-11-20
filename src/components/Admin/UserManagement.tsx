import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { User } from '../../types';
import { mockApi } from "../../utils/mockApi.ts";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: users, isLoading, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => mockApi.users.getAll(),
  });

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_APP_DOMAIN}`, {
      path: '/ws/user',
    });

    socket.on('userCreated', () => {
      console.log('A new user was created.');
      refetch(); // Refetch the users list
    });

    socket.on('userDeleted', () => {
      console.log('A user was deleted.');
      refetch(); // Refetch the users list
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-600">Загрузка пользователей...</div>
        </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil((users?.length || 0) / usersPerPage);
  const paginatedUsers = users?.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
  );

  return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Управление пользователями
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt=""
                                className="h-10 w-10 rounded-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm">
                          {user.login.charAt(0).toUpperCase()}
                        </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.login}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.role}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/*<button className="text-indigo-600 hover:text-indigo-900 mr-4">*/}
                    {/*  Изменить*/}
                    {/*</button>*/}
                    <button className="text-red-600 hover:text-red-900">
                      Удалить
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center">
          <nav className="flex items-center space-x-2 mb-8">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Назад
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
            ))}
            <button
                onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед
            </button>
          </nav>
        </div>
      </div>
  );
}
