import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage
} from 'react-native';

import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState('');

  async function addTask() {
    if (newTask === '') {
      Alert.alert('Atenção', 'Insira uma tarefa antes de enviar!');
      return;
    }

    const search = task.filter(task => task === newTask);

    if(search.length != 0) {
      Alert.alert('Atenção', 'Tarefa já existente!');
      setNewTask('');

      Keyboard.dismiss();

      return;
    }

    // Atribui a lista que ja existia mais a nova.
    setTask([ ...task, newTask ]);
    setNewTask('');

    Keyboard.dismiss();
  }

  async function deleteTask(item) {
    Alert.alert(
      'Deletar Task', 
      'Tem certeza que deseja deletar esta tarefa?', 
      [
        {
          text: 'Cancel', 
          onPress: () => {
            return;
          },
          style: 'cancel'
        },
        {
          text: 'OK', 
          onPress: () => setTask(task.filter(tasks => tasks != item))
        }
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    async function setData() {
      const task = await AsyncStorage.getItem('task');

      if(task) {
        setTask(JSON.parse(task));
      }
    }
    
    setData();
  }, [])

  useEffect(() => { 
    async function saveData() {
      AsyncStorage.setItem('task', JSON.stringify(task))
    }
    saveData();
  }, [task])

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior='padding'
        style= {{ flex: 1 }}
        enabled={ Platform.OS === 'ios' }
      >
        <View style={styles.container}>
          <View style={styles.body}>
            <Text style={styles.title}>To do List <Feather name="check-circle" size={14} color="#333" /></Text>
            { task == '' 
            ?
              <View style={styles.body}>
                <Text style={styles.textMuted}>Nenhuma tarefa criada</Text>
              </View>
            :
              <>
                <FlatList 
                  style={styles.flatList}
                  data={task}
                  keyExtractor={item => item.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.containerView}>
                      <View style={styles.row}>
                        {/* <TouchableOpacity 
                          onPress={() => changeTaskState(item)} 
                          style={styles.checkButton}
                        >
                          { 
                          completeTask ? 
                            <Feather name="check-circle" size={14} color="#1c6cce" /> 
                          : 
                            <Feather name="circle" size={14} color="#1c6cce" />
                          }
                        </TouchableOpacity> */}
                        <Text style={styles.text}>{item}</Text>
                      </View>
                      <View style={styles.listButtons}>
                        <TouchableOpacity
                          onPress={() => deleteTask(item)}
                          style={styles.deleteButton}
                        >
                          <MaterialIcons name='delete-forever' size={25} color='#f64c75'/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              </>
            }
          </View>
          <View style={styles.form}>
            <TextInput 
              style={styles.input}
              placeholderTextColor='#999'
              autoCorrect={true}
              placeholder='Adicione uma tarefa'
              maxLength={25}
              onChangeText={text => setNewTask(text)}
              value={newTask}
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={ () => addTask() }
            >
              <Ionicons name="ios-add" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20
  },
  body: {
    flex: 1
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 5,
    marginLeft: 10
  },
  flatList: {
    flex: 1,
    marginTop: 5
  },
  containerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#eee',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center'
  },
  textMuted: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center'
  },
  listButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkButton: {
    marginRight: 10,
  },
  deleteButton: {
    margin: 5
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
