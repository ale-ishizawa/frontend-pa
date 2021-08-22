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

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
      <ThemeConfig>
        <ScrollToTop />
        <Router />
        <NotificationContainer />
      </ThemeConfig>
    </Provider>
  );
}
