import React from 'react';
import {Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import postForm from '../../axios/postForm';
import {useNavigation} from '@react-navigation/native';

const Register: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phonenumber: '',
    gender: '',
  });

  const setFormnull = () => {
    setForm({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      phonenumber: '',
      gender: '',
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

      <SafeAreaView style={styles.inputbtn}>
        <TextInput
          placeholder='비밀번호'
          secureTextEntry
          onChangeText={value => handleChange('password', value)}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='아이디'
          onChangeText={value => handleChange('username', value)}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='email'
          onChangeText={value => handleChange('email', value)}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='핸드폰번호'
          onChangeText={value => handleChange('phonenumber', value)}
          autoCapitalize='none'
        />
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

  logo: {
    flex: 55,
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    marginBottom: 50,
  },
  signup: {
    flex: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textlink: {
    marginTop: 40,
    marginLeft: 30,
    color: '#1E1E1E',
    fontSize: 19,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 배경 흐리게 처리
  },
});

export default Register;
