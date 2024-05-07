import {Image, Text, View} from 'react-native';
import styles from './style';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

const Splash = ({navigation}) => {
  useEffect(() => {
    createChannels();
    setTimeout(() => {
      navigation.navigate('HomeTabs');
    }, 3000);
  }, []);

  // create a channel from notification

  const createChannels = () => {
    PushNotification.createChannel(
      {
        channelId : 'task_channel',
        channelName : 'Task Channel'
      }
    )
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={{
          uri: 'https://static.vecteezy.com/system/resources/thumbnails/003/529/153/small/business-to-do-list-flat-icon-modern-style-free-vector.jpg',
        }}
      />
      <Text style={styles.txt}>To-do App</Text>
    </View>
  );
};

export default Splash;
