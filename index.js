import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background for iOS, ignore
    //in this point your app is mounted automatically.
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);