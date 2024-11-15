import React from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import postForm from '../../axios/auth/postForm.tsx';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn'; // Adjust the import path as necessary
import BlueBtn from '../../components/BlueBtn'; // Adjust the import path as necessary

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ChatRoom: undefined;
};

export default function Login(): React.JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    console.log(form);
    const response: unknown = await postForm('/account/login', form);
    navigation.navigate('Main');
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
          {/*<Text style={styles.text}>로고화면 </Text>*/}
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.body}>
        <InputBtn placeholder='email' onChangeText={value => handleChange('email', value)} />

        <InputBtn
          placeholder='Password'
          secureTextEntry
          onChangeText={value => handleChange('password', value)}
        />
        <TouchableOpacity
          style={styles.forgotpassword}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.label}>First Come?</Text>
        </TouchableOpacity>
        <BlueBtn title='로그인' onPress={handleSubmit} />
      </SafeAreaView>
      <SafeAreaView style={styles.confirm}></SafeAreaView>
    </SafeAreaView>
  );
}

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
    color: '#f3f3f3',
    fontSize: 15,
    fontWeight: '400',
  },
  forgotpassword: {
    marginLeft: 30,
    alignSelf: 'flex-start',
  },
});
