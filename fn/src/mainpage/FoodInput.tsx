import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function FoodInput(): React.ReactElement {
  const navigator = useNavigation();
  const [food, setFood] = useState('');

  const handleSubmit = () => {
    navigator.navigate('Main');
    // fetch('/food/select_food', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({food}),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Food submitted:', data);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
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
