import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {setTasks, setTaskID} from '../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import styles from './style';

const ToDo = ({navigation}) => {
  const {tasks} = useSelector(state => state.taskReducer);
  console.log('🚀 ~ ToDo ~ tasks:', tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    getTasks();
  }, []);

  const openTask = item => {
    dispatch(setTaskID(item.ID));
    navigation.navigate('Task');
  };

  const getTasks = () => {
    AsyncStorage.getItem('Tasks')
      .then(tasks => {
        const parsedTasks = JSON.parse(tasks);
        if (parsedTasks && typeof parsedTasks === 'object') {
          dispatch(setTasks(parsedTasks));
        }
      })
      .catch(err => console.log(err));
  };

  const createTask = () => {
    dispatch(setTaskID(tasks.length + 1));
    navigation.navigate('Task');
  };

  const checkTask = (id, done) => {
    const index = tasks.findIndex(tasks => tasks.ID === id);
    if (index > -1) {
      let newTasks = [...tasks];
      newTasks[index].Done = done;
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks));
          Alert.alert('');
        })
        .catch(err => console.log(err));
    }
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.ID !== id);
    AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
        .then(() => {
            dispatch(setTasks(filteredTasks));
            Alert.alert('Success!', 'Task removed successfully.');
        })
        .catch(err => console.log(err))
}

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={tasks.filter(task => task.Done === false)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => openTask(item)}>
              <View style={styles.item_row}>
                <View
                  style={[
                    {
                      backgroundColor:
                        item.Color === 'red'
                          ? '#f28b82'
                          : item.Color === 'blue'
                          ? '#aecbfa'
                          : item.Color === 'green'
                          ? '#ccff90'
                          : '#ffffff',
                    },
                    styles.color,
                  ]}
                />
                <CheckBox
                  value={item.Done}
                  onValueChange={done => checkTask(item.ID, done)}
                />
                <View style={styles.item_body}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.Title}
                  </Text>
                  <Text style={styles.subTitle}>{item.Desc}</Text>
                </View>
                <TouchableOpacity
                                style={styles.delete}
                                onPress={() => { deleteTask(item.ID) }}
                            >
                                <FontAwesome5
                                    name={'trash'}
                                    size={25}
                                    color={'#ff3636'}
                                />
                            </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Pressable style={styles.btn} onPress={() => createTask()}>
        <FontAwesome5 name={'plus'} color={'#000000'} size={30} />
      </Pressable>
    </View>
  );
};

export default ToDo;
