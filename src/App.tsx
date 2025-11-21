import './App.css';

import { ThemeProvider } from "@/components/theme-provider"

import CardGallery from '@/components/CardGallery/CardGallery';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <CardGallery/>
      </div>
    </ThemeProvider>
  );
}

export default App;
