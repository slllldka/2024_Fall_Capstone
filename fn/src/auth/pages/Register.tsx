// Update in Register.tsx

import React from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import postForm from '../../axios/postForm';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn'; // Adjust the import path as necessary

const Register: React.FC = () => {
  const navigation = useNavigation();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    vegan: false,
  });

  const setFormnull = () => {
    setForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      gender: '',
      vegan: false,
    });
  };

  const handleChange = (name: string, value: string) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    const response = await postForm(form);
    if (response.status === 201) {
      navigation.navigate('Login');
    }
    setFormnull();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.logo}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.textlink}>뒤로 가기</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.body}>
        <InputBtn placeholder='email' onChangeText={value => handleChange('email', value)} />

        <InputBtn
          placeholder='비밀번호'
          secureTextEntry
          onChangeText={value => handleChange('password', value)}
        />

        <InputBtn
          placeholder='First Name'
          onChangeText={value => handleChange('firstName', value)}
        />
        <InputBtn placeholder='Last Name' onChangeText={value => handleChange('lastName', value)} />
        <InputBtn placeholder='성별' onChangeText={value => handleChange('gender', value)} />
        <InputBtn placeholder='비건' onChangeText={value => handleChange('vegan', value)} />
      </SafeAreaView>

      <TouchableOpacity onPress={handleSubmit}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  body: {
    flex: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 55,
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    marginBottom: 50,
  },
  textlink: {
    marginTop: 40,
    marginLeft: 30,
    color: '#f3f3f3',
    fontSize: 19,
    fontWeight: 'bold',
  },
});

export default Register;
