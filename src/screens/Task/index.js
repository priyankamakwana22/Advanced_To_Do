import {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import styles from './style';
import {useDispatch, useSelector} from 'react-redux';
import {setTasks} from '../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import {ScrollView} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';

const Task = ({navigation}) => {
  const {tasks, taskID} = useSelector(state => state.taskReducer);
  console.log('🚀 ~ Task ~ tasks:', tasks);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);
  const [color, setColor] = useState('white');
  const [bellTime, setBellTime] = useState('1');
  const [image, setImage] = useState('');

  useEffect(() => {
    navigation.addListener('focus', () => {
      getTask();
    });
    getTask();
  }, []);

  const getTask = () => {
    const Task = tasks.find(task => task.ID === taskID);
    if (Task) {
      setTitle(Task.Title);
      setDesc(Task.Desc);
      setDone(Task.Done);
      setColor(Task.Color);
      setImage(Task.Image);
    }
  };

  const setTask = () => {
    if (title.length === 0) {
      Alert.alert('Warning !', 'Please enter a title');
    } else if (desc.length === 0) {
      Alert.alert('Warning!', 'Please enter a description for the task');
    } else {
      try {
        var Task = {
          ID: taskID,
          Title: title,
          Desc: desc,
          Done: done,
          Color: color,
          Image: image,
        };

        const index = tasks.findIndex(task => task.ID === taskID);
        let newTasks = [];
        if (index > -1) {
          newTasks = [...tasks];
          newTasks[index] = Task;
        } else {
          newTasks = [...tasks, Task];
        }
        AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
          .then(() => {
            dispatch(setTasks(newTasks));
            Alert.alert('Task saved Succesfully');
            navigation.goBack();
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteImage = () => {
    RNFS.unlink(image)
      .then(() => {
        const index = tasks.findIndex(task => task.ID === taskID);
        if (index > -1) {
          let newTasks = [...tasks];
          newTasks[index].Image = '';
          AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
            .then(() => {
              dispatch(setTasks(newTasks));
              getTask();
              Alert.alert('Success!', 'Task image is removed  .');
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  const setTaskAlarm = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'task_channel',
      title: title,
      message: desc,
      date: new Date(Date.now() + parseInt(bellTime) * 60 * 100),
      allowWhileIdle: true,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          value={title}
          style={styles.input}
          placeholder="Title"
          onChangeText={title => setTitle(title)}
        />
        <TextInput
          value={desc}
          style={styles.input}
          placeholder="Description"
          multiline
          onChangeText={desc => setDesc(desc)}
        />
        <View style={styles.color_bar}>
          <TouchableOpacity
            style={styles.color_white}
            onPress={() => setColor('white')}>
            {color === 'white' && (
              <FontAwesome5 name={'check'} size={30} color={'#000000'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.color_green}
            onPress={() => setColor('green')}>
            {color === 'green' && (
              <FontAwesome5 name={'check'} size={30} color={'#000000'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.color_blue}
            onPress={() => setColor('blue')}>
            {color === 'blue' && (
              <FontAwesome5 name={'check'} size={30} color={'#000000'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.color_red}
            onPress={() => setColor('red')}>
            {color === 'red' && (
              <FontAwesome5 name={'check'} size={30} color={'#000000'} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.extra_row}>
          <Pressable
            style={styles.extra_button}
            onPress={() => {
              setShowBellModal(true);
            }}>
            <FontAwesome5 name={'bell'} color={'#ffffff'} size={25} />
          </Pressable>
          <Pressable
            style={styles.extra_button}
            onPress={() => {
              navigation.navigate('Camera', {id: taskID});
            }}>
            <FontAwesome5 name={'camera'} color={'#ffffff'} size={25} />
          </Pressable>
        </View>
        <View style={styles.checkbox}>
          <CheckBox value={done} onValueChange={done => setDone(done)} />
          <Text style={styles.checkText}>Is Done</Text>
        </View>

        {image ? (
          <View>
            <Image style={styles.img} source={{uri: image}} />
            <Pressable style={styles.delete} onPress={() => deleteImage()}>
              <FontAwesome5 name={'trash'} size={25} color={'#ff3636'} />
            </Pressable>
          </View>
        ) : null}
        <Pressable style={styles.btn} onPress={setTask}>
          <Text style={styles.btnText}>Save Task</Text>
        </Pressable>
        <Modal
          visible={showBellModal}
          transparent
          onRequestClose={() => setShowBellModal(false)}
          animationType="slide"
          hardwareAccelerated>
          <View style={styles.centered_view}>
            <View style={styles.bell_modal}>
              <View style={styles.bell_body}>
                <Text style={styles.text}>Remind me after</Text>
                <TextInput
                  style={styles.bell_input}
                  keyboardType="numeric"
                  value={bellTime}
                  onChangeText={bellTime => setBellTime(bellTime)}
                />
                <Text style={styles.text}>minutes(s)</Text>
              </View>
              <View style={styles.bell_buttons}>
                <Pressable
                  style={styles.bell_cancel_button}
                  onPress={() => {
                    setShowBellModal(false);
                  }}>
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.bell_ok_button}
                  onPress={() => {
                    setShowBellModal(false);
                    setTaskAlarm();
                  }}>
                  <Text>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Task;
