import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/Home';
import VideoWebView from './components/VideoWebView';

const App =  StackNavigator({
  Home: {
    path: '/',
    screen: HomeScreen,
  },
  Video: {
    path: 'video/:id',
    screen: VideoWebView,
  }
});

export default App