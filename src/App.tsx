// src/App.tsx
import { PrimeReactProvider } from 'primereact/api';
import { DataTableComponent } from './components/DataTableComponent';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // This should be first
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

function App() {
  return (
    <PrimeReactProvider>
      <div className="App min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <i className="pi pi-building text-blue-500"></i>
              Art Institute of Chicago - Artworks
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Data from the Art Institute of Chicago API • Server-side pagination • Persistent row selection
            </p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <DataTableComponent />
        </main>

        <footer className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-8">
          <p>React Internship Assignment • Built with Vite, TypeScript, and PrimeReact</p>
        </footer>
      </div>
    </PrimeReactProvider>
  );
}

export default App;