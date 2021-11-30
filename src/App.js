// routes
import { Provider } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';

// Notification Manager

// Redux
import store from './store';
import { isAuthenticated } from './services/auth';

// ----------------------------------------------------------------------

export default function App() {
  const isLoggedIn = isAuthenticated();

  return (
    <Provider store={store}>
      <ThemeConfig>
        <ScrollToTop />
        <Router isLoggedIn={isLoggedIn} />
        <NotificationContainer />
      </ThemeConfig>
    </Provider>
  );
}
