import React, {useEffect} from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn';
import BlueBtn from '../../components/BlueBtn';
import JWTManager from '../../utils/jwtManager.tsx';
import api from '../../api/axiosConfig.tsx';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ChatRoom: undefined;
  Main: undefined;
};

export default function Login(): React.JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const token = await JWTManager.getAccessToken();
      if (token) {
        // 토큰 유효성 검증
        const response = await api.post('/account/valid');
        if (response.data.success) {
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('자동 로그인 실패:', error);
    }
  };

  const handleChange = (name: string, value: string) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/account/login', form);

      if (response.status === 200) {
        const {access, refresh} = response.data;
        await JWTManager.setTokens({access, refresh});
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
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
    backgroundColor: '#1A1A1A',
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
