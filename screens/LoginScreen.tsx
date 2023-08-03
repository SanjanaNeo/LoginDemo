import React, {useState, useRef, FC, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FormData {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  emailError: string;
  passwordError: string;
}

const LoginScreen: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    showPassword: false,
    isLoading: false,
    emailError: '',
    passwordError: '',
  });

  const navigation = useNavigation();
  const passwordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (email: string) => emailRegex.test(email);
  }, []);

  const validatePassword = useMemo(() => {
    return (password: string) => password.length >= 6;
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    setFormData(prevData => ({
      ...prevData,
      emailError: '',
      passwordError: '',
    }));

    try {
      setFormData(prevData => ({
        ...prevData,
        isLoading: true,
      }));

      // Retrieve the array of user objects from AsyncStorage
      const usersData = await AsyncStorage.getItem('users');
      const users: Array<{email: string; password: string}> = usersData
        ? JSON.parse(usersData)
        : [];

      // Find the user object based on the entered email
      const user = users.find(u => u.email === formData.email);
      console.log('user', user);

      if (user && user.password === formData.password) {
        setFormData(prevData => ({
          ...prevData,
          isLoading: false,
          email: '', // Reset the email field
          password: '', // Reset the password field
        }));

        // Navigate to DummyPostsScreen
        Alert.alert('Login Successful', 'Welcome ' + user.email + '!');
        navigation.navigate('DummyPosts');
      } else {
        setFormData(prevData => ({
          ...prevData,
          isLoading: false,
          emailError: '',
          passwordError: '',
        }));
        // Handle login error
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please try again.',
        );
      }
    } catch (error) {
      setFormData(prevData => ({
        ...prevData,
        isLoading: false,
        email: '', // Reset the email field
        password: '', // Reset the password field
      }));
      // Handle login error
      Alert.alert(
        'Login Failed',
        'An error occurred while logging in. Please try again.',
      );
    }
  };

  const handleSignup = () => {
    navigation.navigate('Registration');
  };

  const togglePasswordVisibility = () => {
    setFormData(prevData => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  return (
    <View style={styles.container}>
      <Icon name="user" size={60} color="#333" />
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, formData.emailError && styles.errorInput]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={text => handleInputChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
      </View>
      {formData.email.trim() !== '' && !isValidEmail(formData.email) ? (
        <Text style={styles.errorMessage}>Invalid email format</Text>
      ) : null}
      <View style={styles.passwordContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          ref={passwordInputRef}
          style={[
            styles.passwordInput,
            formData.passwordError && styles.errorInput,
          ]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!formData.showPassword}
          value={formData.password}
          onChangeText={text => handleInputChange('password', text)}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Icon
            name={formData.showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {formData.password.trim() !== '' &&
      !validatePassword(formData.password) ? (
        <Text style={styles.errorMessage}>
          Password must be at least 6 characters long
        </Text>
      ) : null}
      <TouchableOpacity
        testID="login-button"
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={formData.isLoading}>
        {formData.isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F3E6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    borderColor: '#E9B44C',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    borderColor: '#E9B44C',
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingLeft: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#FF5722',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
  },
});

export default LoginScreen;
