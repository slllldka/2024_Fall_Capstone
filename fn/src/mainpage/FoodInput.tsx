import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../api/axiosConfig.tsx';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
};

export default function FoodInput(): React.ReactElement {
  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [food, setFood] = useState('');

  const handleSubmit = async () => {
    // const response = await api.post('/food/select_food', {food});
    // console.log(response);

    navigator.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter the food you ate:</Text>
      <TextInput
        style={styles.input}
        value={food}
        onChangeText={setFood}
        placeholder='e.g., Apple'
        placeholderTextColor='#888'
      />
      <Button title='Submit' onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  label: {
    color: '#f3f3f3',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f3f3f3',
    padding: 10,
    color: '#ffffff',
    marginBottom: 20,
    borderRadius: 8,
  },
});
