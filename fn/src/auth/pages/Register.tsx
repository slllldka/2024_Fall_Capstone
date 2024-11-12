import React from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import postForm from '../../axios/auth/postForm.tsx';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn'; // Adjust the import path as necessary
import BlueBtn from '../../components/BlueBtn';
import {StackNavigationProp} from '@react-navigation/stack'; // Adjust the import path as necessary

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Register: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    vegan: false,
  });

  const handleChange = (name: string, value: string | boolean) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    console.log(form);
    const response = await postForm('account/signup', form);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (response.status === 201) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.logo}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>뒤로 가기</Text>
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

        <SafeAreaView style={styles.checkboxContainer}>
          <CheckBox
            value={form.gender === '남'}
            onValueChange={value => handleChange('gender', value ? '남' : '')}
          />
          <Text style={styles.label}>남</Text>
          <CheckBox
            value={form.gender === '여'}
            onValueChange={value => handleChange('gender', value ? '여' : '')}
          />
          <Text style={styles.label}>여</Text>
        </SafeAreaView>

        <SafeAreaView style={styles.checkboxContainer}>
          <CheckBox value={form.vegan} onValueChange={value => handleChange('vegan', value)} />
          <Text style={styles.label}>비건 여부</Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.confirm}>
        <BlueBtn title='회원가입' onPress={handleSubmit} />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#262626',
  },
  body: {
    flex: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  logo: {
    flex: 10,
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  text: {
    marginTop: 40,
    marginLeft: 30,
    color: '#f3f3f3',
    fontSize: 19,
    fontWeight: 'bold',
  },
  confirm: {
    flex: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    margin: 10,
    color: '#fff',
  },
});

export default Register;
