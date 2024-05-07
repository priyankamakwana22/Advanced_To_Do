import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {useDispatch, useSelector} from 'react-redux';
import {setTasks} from '../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Camera = ({navigation, route}) => {
  console.log('🚀 ~ Camera ~ route:', route);
  const {tasks} = useSelector(state => state.taskReducer);
  const dispatch = useDispatch();
  const [{cameraRef}, {takePicture}] = useCamera(null);

  const captureHandle = async () => {
    try {
      const data = await takePicture();
      const filePath = data.uri;
      updateTask(route.params.id, filePath);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = (id, path) => {
    const index = tasks.findIndex(task => task.ID === id);
    let newTasks = [];
    if (index > -1) {
      newTasks = [...tasks];
      newTasks[index].Image = path;
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks));
          Alert.alert('Success!', 'Task image is saved.');
          navigation.goBack();
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}>
        <Pressable style={styles.btn} onPress={captureHandle}>
          <Text style={styles.txt}>Capture</Text>
        </Pressable>
      </RNCamera>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {flex: 1},
  txt: {fontSize: 20, fontWeight: 'bold', color: '#000000'},

  btn: {
    backgroundColor: 'lightgreen',
    width: 170,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  preview: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
});
