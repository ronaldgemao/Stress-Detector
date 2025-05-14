import './App.css';
import { Outlet, Link, useLocation } from "react-router-dom";

const toggleSidebar = () => {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
  } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
  }
}

function App() {
const { pathname } = useLocation();

  return (
    <div>
      <div class="flex h-screen overflow-hidden">
          <div class="hidden md:flex flex-col w-64 bg-gray-800">
              <div class="flex items-center justify-center h-16 border-b border-gray-700">
                  <span class="text-white font-bold text-2xl">Nemesis</span>
              </div>
              <div class="flex flex-col flex-grow overflow-y-auto">
                  <nav class="flex-grow px-4 pb-4 pt-8 space-y-1">
                      <Link to="/" className={`flex items-center px-4 py-3 text-white ${!pathname.match(/sentiments/) ? 'bg-gray-700' : ''} rounded-md hover:bg-gray-700 hover:text-white`}>
                        <i class="fas fa-home mr-3"></i>
                        <span>Dashboard</span>
                      </Link>
                      <Link  to="/sentiments" className={`flex items-center px-4 py-3 text-gray-300 ${pathname.match(/sentiments/) ? 'bg-gray-700' : ''} rounded-md hover:bg-gray-700 hover:text-white`}>
                        <i class="fas fa-users mr-3"></i>
                        <span>Sentiments</span>
                      </Link >
                  </nav>
              </div>
              <div class="p-4 border-t border-gray-700">
                  <a href="/" class="flex items-center text-gray-300 hover:text-white">
                      <i class="fas fa-user mr-2"></i>
                      <span>Raymond Torino</span>
                  </a>
              </div>
          </div>

          <div class="flex flex-col flex-1 overflow-hidden">
              <header class="bg-white shadow">
                  <div class="flex items-center justify-between px-6 py-3">
                      <div class="flex items-center">
                          <button class="md:hidden text-gray-500 focus:outline-none" onClick={toggleSidebar}>
                              <i class="fas fa-bars"></i>
                          </button>
                          <h1 class="text-xl font-semibold ml-3 capitalize">{ pathname.replace('/', '') || 'Dashboard'}</h1>
                      </div>
                      <div class="flex items-center space-x-4">
                          <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
                              <i class="fas fa-bell"></i>
                          </button>
                          <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
                              <i class="fas fa-envelope"></i>
                          </button>
                          <div class="md:hidden">
                              <img class="h-8 w-8 rounded-full" src="./assets/profile.webp" alt="User avatar" />
                          </div>
                      </div>
                  </div>
              </header>
              <main class="flex-1 overflow-y-auto p-6">
                <div class="w-full mb-6">
                  <Outlet />
                </div>
              </main>
          </div>
      </div>
      <div id="sidebarOverlay" class="hidden fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onclick="toggleSidebar()"></div>

      <div id="mobileSidebar" class="fixed inset-y-0 left-0 z-30 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out bg-gray-800 md:hidden">
          <div class="flex items-center justify-center h-16 border-b border-gray-700">
              <span class="text-white font-bold text-2xl">Nemesis</span>
          </div>
          <div class="flex flex-col flex-grow overflow-y-auto">
              <nav class="flex-grow px-4 pb-4 pt-8 space-y-1">
              <Link  to="/" class="flex items-center px-4 py-3 text-white bg-gray-700 rounded-md">
                <i class="fas fa-home mr-3"></i>
                <span>Dashboard</span>
              </Link>
              <Link  to="/sentiments" class="flex items-center px-4 py-3 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
                <i class="fas fa-users mr-3"></i>
                <span>Sentiments</span>
              </Link>
              </nav>
          </div>
          <div class="p-4 border-t border-gray-700">
              <a href="/" class="flex items-center text-gray-300 hover:text-white">
                <i class="fas fa-user mr-2"></i>
                  <span>Raymond Torino</span>
              </a>
          </div>
      </div>
    </div>
  );
}

export default App;
