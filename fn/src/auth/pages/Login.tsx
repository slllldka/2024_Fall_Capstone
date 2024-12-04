import React, {useEffect, useRef} from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn';
import BlueBtn from '../../components/BlueBtn';
import JWTManager from '../../utils/jwtManager.tsx';
import api from '../../api/axiosConfig.tsx';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ChatRoom: undefined;
  Main: undefined;
};

const GradientButton = ({onPress, title}: {onPress: () => void; title: string}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient
        colors={['#f213d2', '#023de2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientButton}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function Login(): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    checkAutoLogin();
  }, []);

  useEffect(() => {
    // 로고 표시 후 1초 뒤에 나머지 컨텐츠 페이드인
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // 1초 동안 페이드인
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const checkAutoLogin = async () => {
    try {
      const token = await JWTManager.getAccessToken();
      if (token) {
        // 토큰 유효성 검증
        const response = await api.post('/account/valid');
        if (response.data.success) {
          // navigation.navigate('Main');
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

  const GradientText = () => {
    return (
      <MaskedView
        style={styles.logoContainer}
        maskElement={<Text style={[styles.logoText, {backgroundColor: 'transparent'}]}>FLEX</Text>}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{flex: 1}}
        >
          <Text style={[styles.logoText, {opacity: 0}]}>FLEX</Text>
        </LinearGradient>
      </MaskedView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.logo}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <GradientText />
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.View style={[styles.body, {opacity: fadeAnim}]}>
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
        <GradientButton title='LOGIN' onPress={handleSubmit} />
      </Animated.View>
      <Animated.View style={[styles.confirm, {opacity: fadeAnim}]} />
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
    marginTop: 500,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  logo: {
    flex: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'absolute',
    top: 300,
  },
  logoContainer: {
    height: 80,
    width: '100%',
  },
  logoText: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  text: {
    position: 'absolute',
    top: 400,
    left: 170,
    color: '#f3f3f3',
    fontSize: 44,
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
  buttonContainer: {
    width: '80%', // 버튼의 너비
    marginTop: 20,
    borderRadius: 25, // 둥근 모서리
    overflow: 'hidden', // 그라데이션이 모서리를 넘어가지 않도록
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
