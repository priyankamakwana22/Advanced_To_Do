import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import {useDispatch, useSelector} from 'react-redux';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {setTasks, setTaskID} from '../../redux/action';
  import {FlatList} from 'react-native-gesture-handler';
  import CheckBox from '@react-native-community/checkbox';
  import styles from './style';
  
  const Done = ({navigation}) => {
    const {tasks} = useSelector(state => state.taskReducer);
    console.log('🚀 ~ ToDo ~ tasks:', tasks);
    const dispatch = useDispatch();
  
    
    
    createTask = () => {
      navigation.navigate('Task');
      dispatch(setTaskID(tasks.length + 1));
    };
  
    checkTask = (id, done) => {
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
  
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={tasks.filter(task => task.Done === true)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => openTask(item)}>
                <View style={styles.item_row}>
                  <CheckBox value={item.Done} onValueChange={(done) => checkTask(item.ID, done)} />
                  <View style={styles.item_body}>
                    <Text numberOfLines={1} style={styles.title}>
                      {item.Title}
                    </Text>
                    <Text style={styles.subTitle}>{item.Desc}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        
      </View>
    );
  };
  
  export default Done;
  