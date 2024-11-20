import { MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Интерактивная карта меток
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Создавайте метки на карте, делитесь интересными местами и участвуйте в развитии сообщества.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  {isAuthenticated ? (
                    <Link
                      to="/map"
                      className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Открыть карту
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Войти
                      </Link>
                      <Link
                        to="/register"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Регистрация <span aria-hidden="true">→</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Возможности</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Всё что нужно для работы с картой
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <MapPin className="h-5 w-5 flex-none text-blue-600" />
                Создание меток
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Добавляйте метки на карту, описывайте интересные места и делитесь ими с сообществом.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Users className="h-5 w-5 flex-none text-blue-600" />
                Сообщество
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Общайтесь с другими пользователями, комментируйте метки и участвуйте в обсуждениях.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Star className="h-5 w-5 flex-none text-blue-600" />
                Репутация
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Зарабатывайте репутацию за активность, получайте достижения и открывайте новые возможности.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}