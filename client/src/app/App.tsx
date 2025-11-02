import { AppProvider } from './provider';
import { Router } from './router';

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
