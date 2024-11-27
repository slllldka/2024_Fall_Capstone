import React from 'react';
import {Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import InputBtn from '../../components/InputBtn'; // Adjust the import path as necessary
import BlueBtn from '../../components/BlueBtn';
import {StackNavigationProp} from '@react-navigation/stack'; // Adjust the import path as necessary
import api from '../../api/axiosConfig';
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Register: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    gender: '',
    vegan: false,
  });

  const handleChange = (name: string, value: string | boolean) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    console.log(form);
    const response = await api.post('/account/signup', form);
    console.log(response);

    if (response.status === 201) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.logo}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.body}>
        <InputBtn placeholder='email' onChangeText={value => handleChange('email', value)} />

        <InputBtn
          placeholder='Password'
          secureTextEntry
          onChangeText={value => handleChange('password', value)}
        />

        <InputBtn
          placeholder='First Name'
          onChangeText={value => handleChange('first_name', value)}
        />
        <InputBtn
          placeholder='Last Name'
          onChangeText={value => handleChange('last_name', value)}
        />

        <SafeAreaView style={styles.checkboxContainer}>
          <CheckBox
            value={form.gender === '남'}
            onValueChange={value => handleChange('gender', value ? '남' : '')}
          />
          <Text style={styles.label}>Man</Text>
          <CheckBox
            value={form.gender === '여'}
            onValueChange={value => handleChange('gender', value ? '여' : '')}
          />
          <Text style={styles.label}>Woman</Text>
          <CheckBox value={form.vegan} onValueChange={value => handleChange('vegan', value)} />
          <Text style={styles.label}>Vegan</Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.confirm}>
        <BlueBtn title='Submit' onPress={handleSubmit} />
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    margin: 10,
    color: '#fff',
  },
});

export default Register;
